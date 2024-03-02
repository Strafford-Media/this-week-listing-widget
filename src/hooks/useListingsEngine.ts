import { useEffect, useRef, useState } from 'preact/hooks'
import { ListingsEngine } from '../utils/ListingsEngine'
import { CollectionValue, Listing } from '../@types/duda'

const listingsEngine = new ListingsEngine()

interface UseListingsEngineProps {
  search?: string
  categories?: string[]
  island?: string
}

export const useListingsEngine = ({ search, island, categories }: UseListingsEngineProps = {}) => {
  const [collectionsLoaded, setCollectionsLoaded] = useState(false)
  const loadedRef = useRef(false)
  const [list, setList] = useState<CollectionValue<Listing>[]>([])

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
      listingsEngine.search({ search, island }).then((v) => {
        loadedRef.current = true
        setList(v.matches.concat(v.suggestions))
      })
    } else {
      loadedRef.current = true
      setList(listingsEngine.filterList({ island, categories }))
    }
  }, [search, island, categories, collectionsLoaded])

  return { listingsEngine, list, loaded: loadedRef.current }
}
