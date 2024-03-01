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

export interface CategorySearchSegment {
  substring: string
  match: boolean
}

export interface CategorySearchResult {
  value: Category
  matchCount: number
  segments: CategorySearchSegment[]
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

  searchCategories(search: string, island: string): CategorySearchResult[] {
    search = search.toLowerCase()

    if (!search) {
      return this.allCategories.map((cat) => ({
        value: cat.data,
        matchCount: 0,
        segments: [{ substring: cat.data.label, match: false }],
      }))
    }

    const results = {
      exact: [] as CategorySearchResult[],
      exactPartialFromStart: [] as CategorySearchResult[],
      exactPartial: [] as CategorySearchResult[],
      allCharsFromStart: [] as CategorySearchResult[],
      allChars: [] as CategorySearchResult[],
      partialPartialFromStart: [] as CategorySearchResult[],
      partialPartial: [] as CategorySearchResult[],
      someCharsFromStart: [] as CategorySearchResult[],
      someChars: [] as CategorySearchResult[],
    }

    this.allCategories.forEach((cat) => {
      if (island && !cat.data.island?.[island]) return

      const label = cat.data.label
      const lowerLabel = label.toLowerCase()

      if (lowerLabel === search) {
        results.exact.push({ value: cat.data, matchCount: label.length, segments: [{ substring: label, match: true }] })
        return
      }

      let startsRight = false
      let wholeSearch = false
      let matchCount = 0

      const searchChars = Array.from(search)
      let searchChar = searchChars.shift()
      const segments: CategorySearchSegment[] = []
      for (let i = 0; i < label.length; i++) {
        if (wholeSearch) {
          segments.push({ match: false, substring: label.slice(i) })
          break
        }

        const searchMatched = searchChar === lowerLabel[i]

        if (searchMatched) {
          matchCount++
          searchChar = searchChars.shift()

          if (!searchChar) {
            wholeSearch = true
          }
        }

        if (i === 0) {
          startsRight = searchMatched
          segments.push({ match: searchMatched, substring: label[i] })
          continue
        }

        const currentSegment = segments.at(-1)
        if (!currentSegment) continue

        const currentlyMatching = currentSegment.match

        if (currentlyMatching === searchMatched) {
          currentSegment.substring += label[i]
        } else {
          segments.push({ match: searchMatched, substring: label[i] })
        }
      }

      if (matchCount === 0) {
        return
      }

      const hasGaps = segments.length > (startsRight ? 2 : 3)

      switch (true) {
        case wholeSearch && !hasGaps && startsRight:
          return results.exactPartialFromStart.push({ value: cat.data, matchCount, segments })
        case wholeSearch && !hasGaps && !startsRight:
          return results.exactPartial.push({ value: cat.data, matchCount, segments })
        case wholeSearch && hasGaps && startsRight:
          return results.allCharsFromStart.push({ value: cat.data, matchCount, segments })
        case wholeSearch && hasGaps && !startsRight:
          return results.allChars.push({ value: cat.data, matchCount, segments })
        case !wholeSearch && !hasGaps && startsRight:
          return results.partialPartialFromStart.push({ value: cat.data, matchCount, segments })
        case !wholeSearch && !hasGaps && !startsRight:
          return results.partialPartial.push({ value: cat.data, matchCount, segments })
        case !wholeSearch && hasGaps && startsRight:
          return results.someCharsFromStart.push({ value: cat.data, matchCount, segments })
        case !wholeSearch && hasGaps && !startsRight:
          return results.someChars.push({ value: cat.data, matchCount, segments })
      }
    })

    return [
      ...results.exact,
      ...results.exactPartialFromStart.sort((a, b) => a.value.label.length - b.value.label.length),
      ...results.exactPartial.sort((a, b) => a.value.label.length - b.value.label.length),
      ...results.allCharsFromStart.sort((a, b) => a.value.label.length - b.value.label.length),
      ...results.allChars.sort((a, b) => a.value.label.length - b.value.label.length),
      ...results.partialPartialFromStart.sort((a, b) => b.matchCount - a.matchCount),
      ...results.partialPartial.sort((a, b) => b.matchCount - a.matchCount),
      ...results.someCharsFromStart.sort((a, b) => b.matchCount - a.matchCount),
      ...results.someChars.sort((a, b) => b.matchCount - a.matchCount),
    ]
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
      `query searchListings ($search: String!, $island: String){
      search_listings(args: { search: $search, search_island: $island }) {
        id
      }
    }`,
      { search, island },
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
      `query fuzzySearchListings ($search: String!, $island: String, $limit: Int!){
        fuzzy_search_listings(args: {search: $search, island: $island}, limit: $limit) {
          id
        }
      }`,
      { search, limit, island },
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
            break
          }
        }
      }),
    )

    if (this.listings.length && this.allCategories.length) {
      this.allCategories.forEach((cat) => {
        cat.data.island = { hawaii: false, maui: false, oahu: false, kauai: false }

        cat.data.listing_category_tags?.forEach((lct) => {
          if (this.listingsMap[lct.listing_id]) {
            if (!Array.isArray(this.listingsMap[lct.listing_id].data?.categories)) {
              this.listingsMap[lct.listing_id].data.categories = []
            }

            this.listingsMap[lct.listing_id].data.categories?.push(cat.data)
          }

          if (this.listingsMap[lct.listing_id]?.data?.island) {
            cat.data.island![this.listingsMap[lct.listing_id].data.island] = true
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
