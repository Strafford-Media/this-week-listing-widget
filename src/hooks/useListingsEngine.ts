import { useEffect, useRef, useState } from 'preact/hooks'
import { ListingsEngine } from '../utils/ListingsEngine'
import { CollectionValue, Listing } from '../@types/duda'

const listingsEngine = new ListingsEngine()

interface UseListingsEngineProps {
  search?: string
  categories?: string[]
  island?: string
}

interface Lists {
  list: CollectionValue<Listing>[]
  matches: CollectionValue<Listing>[]
  suggestions: CollectionValue<Listing>[]
}

export const useListingsEngine = ({ search, island, categories }: UseListingsEngineProps = {}) => {
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

    if (search) {
      listingsEngine.search({ search, island, limit: 20 }).then((v) => {
        loadedRef.current = true

        if (categories?.length) {
          const catMap = categories.reduce<Record<string, 1>>((map, cat) => ({ ...map, [cat]: 1 }), {})
          setLists({
            list: [],
            matches: v.matches.filter((l) => l.data.categories?.some((cat) => catMap[cat.label])),
            suggestions: v.suggestions.filter((l) => l.data.categories?.some((cat) => catMap[cat.label])),
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
      setLists({ list: listingsEngine.filterList({ island, categories }), matches: [], suggestions: [] })
    }
  }, [search, island, categories, collectionsLoaded])

  return { listingsEngine, lists, loaded: loadedRef.current }
}
