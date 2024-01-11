import { useMemo, useState } from 'preact/hooks'

const urlRegex = /\/(.+)\/explore?\/?(.+)?\//

const islandSwitcher: { [key: string]: string } = {
  hawaii: 'hawaii',
  oahu: 'oahu',
  maui: 'maui',
  kauai: 'kauai',
}

export const useURLParams = () => {
  const fireUpdate = useState(false)[1]

  const urlStuff = useMemo(() => {
    const url = new URL(window.location.href)

    const segments = url.pathname.split('/').filter(Boolean)
    const exploreIndex = segments.findIndex((s) => s === 'explore')

    const island = islandSwitcher[segments[exploreIndex - 1]]
    const category = segments[exploreIndex + 1]

    const categories = url.searchParams.getAll('category')
    const islands = url.searchParams.get('island') ?? ''

    return { categories, island, islands, category }
  }, [window.location.href])

  const navigate = (url: string) => {
    window.history.pushState(null, '', url)
    fireUpdate((s) => !s)
  }

  return { ...urlStuff, navigate }
}
