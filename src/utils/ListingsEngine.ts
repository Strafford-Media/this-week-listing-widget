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

export interface CollectionMetadata<T extends { id: number } = any> {
  totalCount: number
  results?: CollectionResult<T>
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
  collectionManager: CollectionManager
  error: Error | null = null

  constructor() {
    super()
    this.collectionManager = getCollectionManager()
    this.collectionManager.addEventListener('collections-loaded', () => {
      this.dispatchEvent(new Event('collections-loaded'))
    })

    if (this.collectionManager.loaded) {
      this.dispatchEvent(new Event('collections-loaded'))
    }
  }

  searchCategories(search: string, island: string): CategorySearchResult[] {
    search = search.toLowerCase()

    if (!search) {
      return this.collectionManager.allCategories.map((cat) => ({
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

    this.collectionManager.allCategories.forEach((cat) => {
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
      return this.collectionManager.listings
    }

    const categoryMap = categories?.reduce<Record<string, true>>((map, cat) => ({ ...map, [cat]: true }), {}) ?? {}

    return this.collectionManager.listings.filter(
      (l) =>
        (!island || l.data.island?.includes(island)) &&
        (!categories?.length || l.data.categories?.some((c) => categoryMap[c.label])),
    )
  }

  async search({
    search,
    island,
    includeCategories = false,
    limit,
  }: {
    search: string
    island?: string
    includeCategories?: boolean
    limit?: number
  }): Promise<SearchResult> {
    if (!this.collectionManager.listings.length) {
      await this.collectionManager.loadCollections()
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

    const numMatches = matches?.length ?? 0

    if (numMatches < (limit || 3)) {
      const [suggestionErr, fetchedSuggestions] = await this.findSuggestions(
        search,
        island,
        limit || (numMatches ? 5 : 10),
      )

      if (suggestionErr) {
        console.error('trouble fetching suggestions:', suggestionErr)
      }

      if (fetchedSuggestions) {
        suggestions = fetchedSuggestions
          .filter((fs) => !matches || matches.every((m) => m.data.id !== fs.data.id))
          .slice(0, (limit || 3) - numMatches)
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

    return [null, res.data.search_listings.map((r) => this.collectionManager.listingsMap[r.id]).filter(Boolean)]
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

    return [null, res.data.fuzzy_search_listings.map((r) => this.collectionManager.listingsMap[r.id]).filter(Boolean)]
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

const getCollectionManager = () => {
  if (!(window as any).thisWeekCollectionManager) {
    ;(window as any).thisWeekCollectionManager = new CollectionManager()
  }
  return (window as any).thisWeekCollectionManager
}

class CollectionManager extends EventTarget {
  collectionsAPI: any
  listings: CollectionResult<Listing>['values'] = []
  listingsMap: Record<string, CollectionResult<Listing>['values'][number]> = {}
  primaryCategories: CollectionResult<Category>['values'] = []
  primaryCategoriesMap: Record<string, CollectionResult<Category>['values'][number]> = {}
  allCategories: CollectionResult<Category>['values'] = []
  allCategoriesMap: Record<string, CollectionResult<Category>['values'][number]> = {}
  error: Error | null = null
  loaded = false

  //                                  !!!!!!!!!!STOP!!!!!!!!!!
  // There is listing categorization logic that you must account for if you change this parameter!
  constructor(collections: (keyof typeof collectionMapping)[] = ['Listings', 'All Categories']) {
    super()
    this.loadCollections(collections)
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
            this.listingsMap[lct.listing_id].data.island.split('|').forEach((isle) => {
              cat.data.island![isle] = true
            })
          }
        })
      })
    }

    this.dispatchEvent(new Event('collections-loaded'))
    this.loaded = true
  }

  async loadCollection<T extends { id: number }>(collectionName: string) {
    const currentMetadata = await this.getCollectionMetadata<T>(collectionName)

    if (currentMetadata.totalCount === 0) {
      return { list: [], map: {} }
    }

    const preResults = currentMetadata.results?.values ?? []

    const startingPage = preResults.length ? 1 : 0
    const pageCount = Math.ceil(currentMetadata.totalCount / 100) - startingPage

    const fetched = await Promise.all(
      Array(pageCount)
        .fill(startingPage)
        .map((s, i) => s + i)
        .map((pageNumber) => this.makeCollectionRequest<T>(collectionName, { pageNumber })),
    )

    const lastPage = fetched.filter(([err]) => !err).at(-1)?.[1]?.page

    if (lastPage?.totalItems && lastPage.totalItems !== currentMetadata.totalCount) {
      // fetch more if necessary (do math on last result)
      this.setCollectionMetadata(collectionName, { totalCount: lastPage.totalItems })

      const missingPages = Math.ceil(lastPage.totalItems / 100) - Math.ceil(currentMetadata.totalCount / 100)

      if (missingPages) {
        fetched.push(
          ...(
            await Promise.all(
              Array(missingPages)
                .fill(pageCount + startingPage)
                .map((s, i) => s + i)
                .map((pageNumber) => this.makeCollectionRequest<T>(collectionName, { pageNumber })),
            )
          ).filter(([err]) => !err),
        )
      }
    }

    const list = preResults.concat(fetched.flatMap(([_, result]) => result?.values ?? []))

    const map = list.reduce((map, item) => ({ ...map, [item.data.id]: item }), {})

    return { map, list }
  }

  async makeCollectionRequest<T extends { id: number }>(
    collectionName: string,
    { pageSize = 100, pageNumber = 0 } = {},
  ): Promise<[Error | null, CollectionResult<T> | null]> {
    const results: CollectionResult<T> = await this.collectionsAPI
      .data(collectionName)
      .pageSize(pageSize)
      .pageNumber(pageNumber)
      .get()
      .catch((err: any) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

    if (results instanceof Error) {
      this.error = results
      console.error('error fetching collection:', { collectionName, pageNumber, pageSize }, results)
      return [results, null]
    }

    if (!Array.isArray(results?.values)) {
      this.error = new Error('No results fetched')
      console.error('error fetching collection:', this.error, results)
      return [this.error, results]
    }

    return [null, results]
  }

  async getCollectionMetadata<T extends { id: number } = any>(collectionName: string): Promise<CollectionMetadata> {
    try {
      const parsed = JSON.parse(localStorage.getItem(`this-week-collection-metadata-${collectionName}`) as string)

      if (typeof parsed.totalCount !== 'number' || !parsed.totalCount) {
        throw 'bad metadata'
      }

      return parsed
    } catch (error) {
      const [err, results] = await this.makeCollectionRequest<T>(collectionName)

      if (err || !results) {
        this.error = err

        return {
          totalCount: 0,
        }
      }

      const metadata = { totalCount: results.page.totalItems }

      this.setCollectionMetadata(collectionName, metadata)

      return {
        ...metadata,
        results,
      }
    }
  }

  setCollectionMetadata(collectionName: string, metadata: CollectionMetadata) {
    try {
      const stringified = JSON.stringify(metadata)

      localStorage.setItem(`this-week-collection-metadata-${collectionName}`, stringified)
    } catch (error) {
      console.error('trouble storing collection metadata:', collectionName, metadata, error)
    }
  }
}
