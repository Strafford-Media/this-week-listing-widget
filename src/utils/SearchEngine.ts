import { CollectionResult } from '../@types/duda'
import { getHasuraUrl } from './urls'

export type IslandValue = 'oahu' | 'maui' | 'kauai' | 'hawaii' | ''

export interface SearchParams {
  island: IslandValue
  search: string
}

export interface SearchResult {
  matches: SearchResultItem[]
  suggestions: SearchResultItem[]
  notEnough: boolean
  emptySearch?: boolean
  error?: Error | null
}

interface SearchResultItem {
  id: number
  value: string
  label: string
}

export class SearchEngine {
  collectionsAPI: any
  collection: CollectionResult['values'] = []
  collectionMap: Record<string, CollectionResult['values'][number]> = {}
  loaded = false
  error: Error | null = null

  constructor() {
    this.loadCollection()
  }

  async search({ search, island }: { search: string; island?: string }): Promise<SearchResult> {
    if (!this.collection.length) {
      await this.loadCollection()
    }

    if (!search) {
      return { matches: [], suggestions: [], emptySearch: true, notEnough: true }
    }

    if (search.length < 3) {
      return { matches: [], suggestions: [], notEnough: true, emptySearch: false }
    }

    const [err, matches] = await this.findMatches(search, island)

    if (err) {
      return { error: err, matches: [], suggestions: [], emptySearch: false, notEnough: false }
    }

    let suggestions: SearchResultItem[] = []

    if ((matches?.length ?? 0) < 3) {
      const [suggestionErr, fetchedSuggestions] = await this.findSuggestions(search, island, matches?.length ? 5 : 10)

      if (suggestionErr) {
        console.error('trouble fetching suggestions:', suggestionErr)
      }

      if (fetchedSuggestions) {
        suggestions = fetchedSuggestions.filter((fs) => !matches || matches.every((m) => m.id !== fs.id))
      }
    }

    return {
      matches: matches ?? [],
      suggestions,
      notEnough: false,
      emptySearch: false,
    }
  }

  async findMatches(search: string, island = ''): Promise<[Error | null, SearchResultItem[] | null]> {
    const [err, res] = await this.graphqlRequest<{
      data: { search_listings: { id: number; business_name: string }[] }
    }>(
      `query searchListings ($search: String!){
      search_listings(args: { search: $search }${island ? `, where: { island: { _eq: "${island}" } }` : ''}) {
        id
        business_name
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

    return [
      null,
      res.data.search_listings
        .map((r: { id: number; business_name: string }) => ({
          id: r.id,
          value: this.collectionMap[r.id]?.page_item_url,
          label: r.business_name,
        }))
        .filter((l) => l.value),
    ]
  }

  async findSuggestions(search: string, island = '', limit = 5): Promise<[Error | null, SearchResultItem[] | null]> {
    const [err, res] = await this.graphqlRequest<{
      data: { fuzzy_search_listings: { id: number; business_name: string }[] }
    }>(
      `query fuzzySearchListings ($search: String!, $limit: Int!){
        fuzzy_search_listings(args: {search: $search}${
          island ? `, where: { island: { _eq: "${island}" } }` : ''
        }, limit: $limit) {
          id
          business_name
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

    return [
      null,
      res.data.fuzzy_search_listings
        .map((r) => ({
          id: r.id,
          value: this.collectionMap[r.id]?.page_item_url,
          label: r.business_name,
        }))
        .filter((l) => l.value),
    ]
  }

  async loadCollection() {
    if (!this.collectionsAPI) {
      if (typeof (window as any).dmAPI === 'undefined') {
        return console.error('no dmAPI object available to bootstrap widget content')
      }

      const collectionsAPI = await (window as any).dmAPI?.loadCollectionsAPI?.()

      if (!collectionsAPI) return console.error('failed to load collections API')

      this.collectionsAPI = collectionsAPI
    }

    let moar = true
    let nextPage = 0
    let pageSize = 100
    while (moar) {
      const results: CollectionResult = await this.collectionsAPI
        .data('Listings')
        .pageSize(pageSize)
        .pageNumber(nextPage)
        .get()
        .catch((err: any) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

      if (results instanceof Error) {
        this.error = results
        this.collection = []
        this.collectionMap = {}
        moar = false
      }

      if (!Array.isArray(results.values)) {
        this.error = new Error('No results fetched')
        this.collection = []
        this.collectionMap = {}
        moar = false
      }

      this.collection = this.collection.concat(results.values)

      nextPage = results.page.pageNumber + 1
      moar = nextPage < results.page.totalPages
    }

    this.collectionMap = this.collection.reduce((map, item) => ({ ...map, [item.data.id]: item }), {})
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
