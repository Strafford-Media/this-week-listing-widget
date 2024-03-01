import { useMemo, useState } from 'preact/hooks'

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
    const islands = url.searchParams.getAll('island')

    const categoryMap = categories.reduce<Record<string, true>>((map, cat) => ({ ...map, [cat]: true }), {})

    if (category) {
      categoryMap[category] = true
    }

    return { categories, island, islands, category, categoryMap }
  }, [window.location.href])

  const navigate = ({
    add,
    remove,
  }: {
    add?: { [key: string]: string | string[] }
    remove?: { [key: string]: string | string[] }
  }) => {
    const currentUrl = new URL(window.location.href)

    if (add) {
      for (const param of Object.keys(add)) {
        const value = add[param]
        if (Array.isArray(value)) {
          for (const val of value) {
            currentUrl.searchParams.delete(param, val)
            currentUrl.searchParams.append(param, val)
          }
        } else {
          currentUrl.searchParams.set(param, value)
        }
      }
    }

    if (remove) {
      for (const param of Object.keys(remove)) {
        const value = remove[param]
        if (Array.isArray(value)) {
          for (const val of value) {
            currentUrl.searchParams.delete(param, val)
          }
        } else {
          currentUrl.searchParams.delete(param)
        }
      }
    }

    window.history.pushState(null, '', currentUrl.toString())
    fireUpdate((s) => !s)
  }

  return { ...urlStuff, navigate }
}
