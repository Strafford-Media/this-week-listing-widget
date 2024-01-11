import { CollectionResult, Listing, Category, CollectionValue } from '../@types/duda'
import { getHasuraUrl } from './urls'

export type IslandValue = 'oahu' | 'maui' | 'kauai' | 'hawaii' | ''

export interface SearchParams {
  island: IslandValue
  search: string
}

export interface SearchResult {
  matches: CollectionValue<Listing>[]
  suggestions: CollectionValue<Listing>[]
  categoryTags: Category[]
  notEnough: boolean
  emptySearch?: boolean
  error?: Error | null
}

const collectionMapping = {
  Listings: {
    listKey: 'listings',
    mapKey: 'listingsMap',
  },
  Categories: {
    listKey: 'primaryCategories',
    mapKey: 'primaryCategoriesMap',
  },
  'All Categories': {
    listKey: 'allCategories',
    mapKey: 'allCategoriesMap',
  },
}

const emptyResult = { matches: [], suggestions: [], categoryTags: [], emptySearch: true, notEnough: true }

export class ListingsEngine extends EventTarget {
  collectionsAPI: any
  listings: CollectionResult<Listing>['values'] = []
  listingsMap: Record<string, CollectionResult<Listing>['values'][number]> = {}
  primaryCategories: CollectionResult<Category>['values'] = []
  primaryCategoriesMap: Record<string, CollectionResult<Category>['values'][number]> = {}
  allCategories: CollectionResult<Category>['values'] = []
  allCategoriesMap: Record<string, CollectionResult<Category>['values'][number]> = {}
  error: Error | null = null
  listingsCategorized = false

  constructor(categories: (keyof typeof collectionMapping)[] = ['Listings']) {
    super()
    this.loadCollections(categories)
  }

  filterList({ island, categories }: { island?: string; categories?: string[] }): CollectionResult<Listing>['values'] {
    if (!island && !categories?.length) {
      return this.listings
    }

    const categoryMap = categories?.reduce<Record<string, true>>((map, cat) => ({ ...map, [cat]: true }), {}) ?? {}

    return this.listings.filter(
      (l) =>
        (!island || l.data.island === island) &&
        (!categories?.length || l.data.categories?.some((c) => categoryMap[c.label])),
    )
  }

  async search({
    search,
    island,
    includeCategories = false,
  }: {
    search: string
    island?: string
    includeCategories?: boolean
  }): Promise<SearchResult> {
    if (!this.listings.length) {
      await this.loadCollections()
    }

    if (!search) {
      return emptyResult
    }

    if (search.length < 2) {
      return { ...emptyResult, emptySearch: false }
    }

    const [[err, matches], [catErr, catSuggestions]] = await Promise.all([
      this.findMatches(search, island),
      includeCategories ? this.findSuggestedCategories(search, island) : [],
    ])

    if (catErr) {
      // not important enough to stop the show on its own, but we'll let people inspect it in the console if they want
      console.error("couldn't fetch categories:", catErr)
    }

    if (err) {
      return { ...emptyResult, error: err, emptySearch: false, notEnough: false }
    }

    let suggestions: CollectionValue<Listing>[] = []

    if ((matches?.length ?? 0) < 3) {
      const [suggestionErr, fetchedSuggestions] = await this.findSuggestions(search, island, matches?.length ? 5 : 10)

      if (suggestionErr) {
        console.error('trouble fetching suggestions:', suggestionErr)
      }

      if (fetchedSuggestions) {
        suggestions = fetchedSuggestions.filter((fs) => !matches || matches.every((m) => m.data.id !== fs.data.id))
      }
    }

    return {
      matches: matches ?? [],
      suggestions,
      categoryTags: catSuggestions ?? [],
      notEnough: false,
      emptySearch: false,
    }
  }

  async findMatches(search: string, island = ''): Promise<[Error | null, CollectionValue<Listing>[] | null]> {
    const [err, res] = await this.graphqlRequest<{
      data: { search_listings: { id: number; business_name: string }[] }
    }>(
      `query searchListings ($search: String!){
      search_listings(args: { search: $search }${island ? `, where: { island: { _eq: "${island}" } }` : ''}) {
        id
      }
    }`,
      { search },
    )

    if (err) {
      return [err, null]
    }

    if (!res || !Array.isArray(res?.data?.search_listings)) {
      return [new Error('Unable to search for matches'), null]
    }

    return [null, res.data.search_listings.map((r) => this.listingsMap[r.id]).filter(Boolean)]
  }

  async findSuggestions(
    search: string,
    island = '',
    limit = 5,
  ): Promise<[Error | null, CollectionValue<Listing>[] | null]> {
    const [err, res] = await this.graphqlRequest<{
      data: { fuzzy_search_listings: { id: number }[] }
    }>(
      `query fuzzySearchListings ($search: String!, $limit: Int!){
        fuzzy_search_listings(args: {search: $search}${
          island ? `, where: { island: { _eq: "${island}" } }` : ''
        }, limit: $limit) {
          id
        }
      }`,
      { search, limit },
    )

    if (err) {
      return [err, null]
    }

    if (!res || !Array.isArray(res?.data?.fuzzy_search_listings)) {
      return [new Error('Unable to search for matches'), null]
    }

    return [null, res.data.fuzzy_search_listings.map((r) => this.listingsMap[r.id]).filter(Boolean)]
  }

  async findSuggestedCategories(search: string, island?: string): Promise<[Error | null, Category[] | null]> {
    const [err, res] = await this.graphqlRequest<{
      data: { fuzzy_search_categories: { id: number; label: string; listings_count: number }[] }
    }>(
      `query fuzzySearchCategories ($search: String!, $island: String) {
        fuzzy_search_categories(args: { search: $search, island: $island }) {
          id
          label
          listings_count
        }
      }`,
      { search, island },
    )

    if (err) {
      return [err, null]
    }

    if (!res || !Array.isArray(res?.data?.fuzzy_search_categories)) {
      return [new Error('Unable to search for matches'), null]
    }

    return [
      null,
      res.data.fuzzy_search_categories
        .map((c) => ({
          ...c,
          // spoof the category type
          listing_category_tags: [],
        }))
        .filter(Boolean),
    ]
  }

  async loadCollections(collectionNames: (keyof typeof collectionMapping)[] = ['Listings']) {
    if (!this.collectionsAPI) {
      if (typeof (window as any).dmAPI === 'undefined') {
        return console.error('no dmAPI object available to bootstrap widget content')
      }

      const collectionsAPI = await (window as any).dmAPI?.loadCollectionsAPI?.()

      if (!collectionsAPI) return console.error('failed to load collections API')

      this.collectionsAPI = collectionsAPI
    }

    // doing it this way to parallelize the processing
    await Promise.all(
      collectionNames.map(async (name) => {
        switch (name) {
          case 'Listings': {
            const { list, map } = await this.loadCollection<Listing>('Listings')
            this.listings = list
            this.listingsMap = map
            break
          }
          case 'All Categories': {
            const { list, map } = await this.loadCollection<Category>('All Categories')
            this.allCategories = list
            this.allCategoriesMap = map
          }
        }
      }),
    )

    if (this.listings.length && this.allCategories.length) {
      this.allCategories.forEach((cat) => {
        cat.data.listing_category_tags?.forEach((lct) => {
          if (this.listingsMap[lct.listing_id]) {
            if (!Array.isArray(this.listingsMap[lct.listing_id].data.categories)) {
              this.listingsMap[lct.listing_id].data.categories = []
            }

            this.listingsMap[lct.listing_id].data.categories?.push(cat.data)
          }
        })
      })
    }

    this.dispatchEvent(new Event('collections-loaded'))
  }

  async loadCollection<T extends { id: number }>(collectionName: string) {
    let list: CollectionResult<T>['values'] = []

    let moar = true
    let nextPage = 0
    let pageSize = 100
    while (moar) {
      const results: CollectionResult<T> = await this.collectionsAPI
        .data(collectionName)
        .pageSize(pageSize)
        .pageNumber(nextPage)
        .get()
        .catch((err: any) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

      if (results instanceof Error) {
        this.error = results
        list = []
        moar = false
      }

      if (!Array.isArray(results.values)) {
        this.error = new Error('No results fetched')
        list = []
        moar = false
      }

      list = list.concat(results.values)

      nextPage = results.page.pageNumber + 1
      moar = nextPage < results.page.totalPages
    }

    const map = list.reduce((map, item) => ({ ...map, [item.data.id]: item }), {})

    return { map, list }
  }

  async graphqlRequest<Data = any>(query: string, variables: any): Promise<[Error | null, Data | null]> {
    const hasuraUrl = getHasuraUrl()
    const res: Data | Error = await fetch(hasuraUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })
      .then((r) => r.json())
      .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

    if (res instanceof Error) {
      return [res, null]
    }

    return [null, res]
  }
}
