import { ComponentProps } from 'preact'
import { ListingItem } from './ListingItem'
import { useListingsEngine } from '../hooks/useListingsEngine'
import { useURLParams } from '../hooks/useURLParams'
import { useEffect, useState } from 'preact/hooks'
import { CategorySearchResult } from 'utils/ListingsEngine'
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react-dom'

export interface ListingListProps extends ComponentProps<'div'> {}

const islandClasses: Record<string, { pill: string }> = {
  hawaii: {
    pill: 'tw-bg-red-500 tw-text-white',
  },
  maui: {
    pill: 'tw-bg-pink-500 tw-text-white',
  },
  oahu: {
    pill: 'tw-bg-yellow-500 tw-text-white',
  },
  kauai: {
    pill: 'tw-bg-fuchsia-500 tw-text-white',
  },
  '': {
    pill: 'tw-bg-red-500 tw-text-white',
  },
}

export const ListingList = ({ className = '', ...props }: ListingListProps) => {
  const { categories, categoryMap, island: islandFromPath, category, islands, navigate } = useURLParams()

  const island = islandFromPath || islands[0] || ''

  const { list, loaded, listingsEngine } = useListingsEngine({
    island,
    categories: category ? [category] : categories,
    search: '',
  })

  const [categorySearch, setCategorySearch] = useState('')
  const [categoryResults, setCategoryResults] = useState<CategorySearchResult[]>([])

  const { refs, floatingStyles } = useFloating({
    strategy: 'fixed',
    placement: 'bottom-start',
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  })

  const [openDropdown, setOpenDropdown] = useState(false)

  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (
        openDropdown &&
        refs.reference?.current &&
        !refs.reference.current.contains(e.target as any) &&
        refs.floating?.current &&
        !refs.floating.current.contains(e.target as any)
      ) {
        setOpenDropdown(false)
      }
    }
    window.addEventListener('click', listener)

    return () => window.removeEventListener('click', listener)
  }, [openDropdown])

  return (
    <div className={`${className}`} {...props}>
      <h2 className="tw-mb-8 tw-mt-8 tw-text-center md:tw-mt-0">Activities{islandFromPath && ` on ${island}`}</h2>
      <div className="tw-mb-8 tw-flex tw-flex-col tw-items-center tw-justify-between tw-gap-4 lg:tw-flex-row lg:tw-items-end lg:tw-px-2">
        <div className="tw-grow">
          <div className="tw-flex tw-w-full tw-flex-wrap tw-justify-center tw-gap-2 tw-pb-2 lg:tw-justify-start">
            {!categories.length && (
              <span
                className={`tw-rounded-full tw-px-2 tw-py-0.5 tw-text-sm tw-capitalize ${islandClasses[island]?.pill}`}
              >
                Showing All Categories
              </span>
            )}
            {categories.map((cat) => (
              <button
                type="button"
                className={`tw-rounded-full tw-px-2 tw-py-0.5 tw-text-sm tw-capitalize ${islandClasses[island]?.pill}`}
                onClick={() => navigate({ remove: { category: [cat] } })}
              >
                {cat}
              </button>
            ))}
          </div>
          <input
            ref={refs.setReference}
            type="text"
            className={`tw-max-w-64 tw-rounded-md tw-border-2 tw-border-gray-300 tw-bg-white tw-px-2 tw-py-2 focus:tw-border-sky-400 focus:tw-outline-none lg:tw-block`}
            value={categorySearch}
            placeholder="Filter by Category"
            onFocus={() => {
              setCategoryResults(listingsEngine.searchCategories(categorySearch, island))
              setOpenDropdown(true)
            }}
            onInput={(e) => {
              const newVal = (e as any).target.value
              setCategorySearch(newVal)
              setCategoryResults(listingsEngine.searchCategories(newVal, island))
              setOpenDropdown(true)
            }}
          />
          {openDropdown && (
            <ul
              ref={refs.setFloating}
              style={floatingStyles}
              className="tw-z-10 tw-min-w-48 tw-max-w-[95vw] tw-rounded-lg tw-bg-white tw-shadow-2xl"
            >
              {categoryResults.map(
                (cr) =>
                  !categoryMap[cr.value.label] && (
                    <li
                      key={cr.value.label}
                      className="tw-cursor-pointer tw-px-2 tw-py-1 tw-text-left tw-text-sm tw-capitalize tw-text-gray-600 hover:tw-bg-gray-50 focus:tw-bg-gray-100 focus:tw-outline-none"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        navigate({ add: { category: [cr.value.label] } })
                      }}
                      tabIndex={0}
                    >
                      {cr.segments.map((seg, i) => (
                        <span key={i} className={`${seg.match ? 'tw-font-bold' : ''}`}>
                          {seg.substring}
                        </span>
                      ))}
                    </li>
                  ),
              )}
            </ul>
          )}
        </div>
        {!islandFromPath && (
          <div className="tw-flex tw-flex-nowrap tw-justify-end tw-overflow-clip tw-rounded-md tw-bg-white">
            <button
              type="button"
              className={`tw-rounded-l-md tw-border-y tw-border-l tw-border-red-500 tw-px-4 tw-py-1 ${
                !islands[0] || islands[0] === 'hawaii' ? 'tw-bg-red-500 tw-text-red-100' : 'tw-text-red-500'
              }`}
              onClick={() => {
                if (islands[0] === 'hawaii') {
                  navigate({ remove: { island: 'hawaii' } })
                } else {
                  navigate({ add: { island: 'hawaii' } })
                }
              }}
            >
              Hawaii
            </button>
            <button
              type="button"
              className={`tw-border-y tw-border-pink-500 tw-px-4 tw-py-1 ${
                !islands[0] || islands[0] === 'maui' ? 'tw-bg-pink-500 tw-text-pink-100' : 'tw-text-pink-500'
              }`}
              onClick={() => {
                if (islands[0] === 'maui') {
                  navigate({ remove: { island: 'maui' } })
                } else {
                  navigate({ add: { island: 'maui' } })
                }
              }}
            >
              Maui
            </button>
            <button
              type="button"
              className={`tw-border-y tw-border-yellow-500 tw-px-4 tw-py-1 ${
                !islands[0] || islands[0] === 'oahu' ? 'tw-bg-yellow-500 tw-text-yellow-100' : 'tw-text-yellow-500'
              }`}
              onClick={() => {
                if (islands[0] === 'oahu') {
                  navigate({ remove: { island: 'oahu' } })
                } else {
                  navigate({ add: { island: 'oahu' } })
                }
              }}
            >
              Oahu
            </button>
            <button
              type="button"
              className={`tw-rounded-r-md tw-border-y tw-border-r tw-border-fuchsia-500 tw-px-4 tw-py-1 ${
                !islands[0] || islands[0] === 'kauai' ? 'tw-bg-fuchsia-500 tw-text-fuchsia-100' : 'tw-text-fuchsia-500'
              }`}
              onClick={() => {
                if (islands[0] === 'kauai') {
                  navigate({ remove: { island: 'kauai' } })
                } else {
                  navigate({ add: { island: 'kauai' } })
                }
              }}
            >
              Kauai
            </button>
          </div>
        )}
      </div>
      {loaded && !list.length && (
        <p className="tw-w-full tw-text-center">No activities matched your search, unfortunately.</p>
      )}
      <ul className="tw-grid tw-grid-cols-[repeat(auto-fill,minmax(300px,1fr))] tw-gap-4 tw-px-2 tw-pb-8">
        {list.map((data) => (
          <ListingItem listing={data.data} listingURL={data.page_item_url} />
        ))}
      </ul>
    </div>
  )
}
