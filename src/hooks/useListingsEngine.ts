import { useEffect, useState } from 'preact/hooks'
import { ListingsEngine } from '../utils/ListingsEngine'
import { CollectionValue, Listing } from '../@types/duda'

const listingsEngine = new ListingsEngine(['Listings', 'All Categories'])

interface UseListingsEngineProps {
  search?: string
  categories?: string[]
  island?: string
}

export const useListingsEngine = ({ search, island, categories }: UseListingsEngineProps = {}) => {
  const [loaded, setLoaded] = useState(false)
  const [list, setList] = useState<CollectionValue<Listing>[]>([])

  useEffect(() => {
    if (loaded) return

    const listener = () => {
      setLoaded(true)
    }

    listingsEngine.addEventListener('collections-loaded', listener)

    return () => listingsEngine.removeEventListener('collections-loaded', listener)
  }, [loaded])

  useEffect(() => {
    if (!loaded) return

    if (search) {
      listingsEngine.search({ search, island }).then((v) => setList(v.matches.concat(v.suggestions)))
    } else {
      setList(listingsEngine.filterList({ island, categories }))
    }
  }, [search, island, categories, loaded])

  return { listingsEngine, list, loaded }
}
