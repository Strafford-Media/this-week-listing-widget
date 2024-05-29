import { useEffect, useRef, useState } from 'preact/hooks'
import { ListingsEngine } from '../utils/ListingsEngine'
import { CollectionValue, Listing } from '../@types/duda'

const listingsEngine = new ListingsEngine()

interface UseListingsEngineProps {
  search?: string
  categories?: string[]
  island?: string
  tiers?: string[]
  promotedOnly?: boolean
  ids?: string[]
}

interface Lists {
  list: CollectionValue<Listing>[]
  matches: CollectionValue<Listing>[]
  suggestions: CollectionValue<Listing>[]
}

export const useListingsEngine = ({
  ids,
  search,
  island,
  categories,
  tiers,
  promotedOnly = false,
}: UseListingsEngineProps = {}) => {
  const [collectionsLoaded, setCollectionsLoaded] = useState(false)
  const loadedRef = useRef(false)
  const [lists, setLists] = useState<Lists>(() => ({ list: [], matches: [], suggestions: [] }))

  useEffect(() => {
    if (collectionsLoaded) return

    const listener = () => {
      setCollectionsLoaded(true)
    }

    listingsEngine.addEventListener('collections-loaded', listener)

    return () => listingsEngine.removeEventListener('collections-loaded', listener)
  }, [collectionsLoaded])

  useEffect(() => {
    if (!collectionsLoaded) return

    if (ids?.length) {
      setLists({ list: listingsEngine.listingsFromIdList(ids), matches: [], suggestions: [] })
    } else if (search) {
      listingsEngine.search({ search, island, limit: 20 }).then((v) => {
        loadedRef.current = true

        if (categories?.length || tiers?.length || promotedOnly) {
          const catMap = categories?.reduce<Record<string, 1>>((map, cat) => ({ ...map, [cat]: 1 }), {}) ?? {}

          setLists({
            list: [],
            matches: v.matches.filter(
              (l) =>
                (!categories?.length || l.data.categories?.some((cat) => catMap[cat.label.toLowerCase()])) &&
                (!tiers?.length || tiers.includes(l.data.tier)) &&
                (!promotedOnly || l.data.promoted),
            ),
            suggestions: v.suggestions.filter(
              (l) =>
                (!categories?.length || l.data.categories?.some((cat) => catMap[cat.label.toLowerCase()])) &&
                (!tiers?.length || tiers.includes(l.data.tier)) &&
                (!promotedOnly || l.data.promoted),
            ),
          })
        } else {
          setLists({
            list: [],
            matches: v.matches ?? [],
            suggestions: v.suggestions ?? [],
          })
        }
      })
    } else {
      loadedRef.current = true
      setLists({
        list: listingsEngine.filterList({ island, categories, tiers, promotedOnly }),
        matches: [],
        suggestions: [],
      })
    }
  }, [search, island, categories, collectionsLoaded, tiers, promotedOnly, ids])

  return { listingsEngine, lists, loaded: loadedRef.current }
}
