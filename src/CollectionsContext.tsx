import { createContext } from 'preact'
import { useContext } from 'preact/hooks'

const CollectionsContext = createContext<{ collectionsAPI: any }>({
  collectionsAPI: {},
})

export const CollectionsProvider = CollectionsContext.Provider

export const useCollectionsContext = () => useContext(CollectionsContext)
