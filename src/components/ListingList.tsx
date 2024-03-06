import { ComponentProps } from 'preact'
import { useEffect, useMemo, useState } from 'preact/hooks'
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react-dom'
import { ListingItem } from './ListingItem'
import { useListingsEngine } from '../hooks/useListingsEngine'
import { useURLParams } from '../hooks/useURLParams'
import { useRememberedState } from '../hooks/useRememberedState'
import { CategorySearchResult } from '../utils/ListingsEngine'
import { useDebouncedCallback } from 'hooks/useDebouncedCallback'
import { deviceType } from '../utils/environment'
import { islandClasses } from '../utils/islandClasses'

export interface ListingListProps extends ComponentProps<'div'> {}

export const ListingList = ({ className = '', ...props }: ListingListProps) => {
  const { categories, categoryMap, island: islandFromPath, category, islands, navigate } = useURLParams()

  const allCategories = useMemo(() => (category ? [category] : []).concat(categories), [category, categories])

  const island = islandFromPath || islands[0] || ''

  const [liveSearchValue, setLiveSearchValue] = useRememberedState('this-week-listing-list-search-value', '')
  const [search, setSearch] = useState(liveSearchValue)

  const debouncedSearch = useDebouncedCallback((s) => setSearch(s), deviceType === 'mobile' ? 1000 : 500)

  const { lists, loaded, listingsEngine } = useListingsEngine({
    island,
    categories: allCategories,
    search,
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

  const islandSelection = (isle: string) => {
    if (islands[0] === isle) {
      navigate({ remove: { island: isle } })
    } else if (islandFromPath === isle) {
      navigate({ path: window.location.pathname.replace(`/${islandFromPath}/`, '/') })
    } else if (islandFromPath) {
      navigate({ add: { island: isle }, path: window.location.pathname.replace(`/${islandFromPath}/`, '/') })
    } else {
      navigate({ add: { island: isle } })
    }
  }

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
      <h2 className={`${search ? 'tw-mb-0' : 'tw-mb-8'} tw-mt-8 tw-text-center md:tw-mt-0`}>
        Activities{island && ` on ${island}`}
      </h2>
      {search && (
        <p className="tw-mb-2 tw-text-center tw-text-gray-600 ">
          <em>related to</em> "{search}"
        </p>
      )}
      <div className="filtering-grid tw-mb-8 tw-grid tw-gap-x-4 tw-px-2">
        <div className="categories-area tw-flex tw-w-full tw-flex-wrap tw-items-center tw-gap-2 tw-pb-2">
          {!allCategories.length ? (
            <span className={`tw-rounded-full tw-bg-gray-500 tw-px-2 tw-py-0.5 tw-text-sm tw-capitalize tw-text-white`}>
              Showing All Categories
            </span>
          ) : (
            <span className="tw-text-sm">In Categories:</span>
          )}
          {allCategories.map((cat) => (
            <button
              type="button"
              className={`tw-relative tw-bottom-0 tw-rounded-full tw-px-2 tw-py-0.5 tw-text-sm tw-capitalize before:tw-absolute before:tw-inset-0 before:tw-z-10 before:tw-rounded-full before:tw-bg-gray-700 before:tw-opacity-0 after:tw-absolute after:tw-inset-0 after:tw-z-20 after:tw-py-0.5 after:tw-font-bold after:tw-opacity-0 after:tw-content-x hover:before:tw-opacity-50 hover:after:tw-opacity-100 focus:tw-outline-none focus:tw-ring-2 focus:before:tw-opacity-50 focus:after:tw-opacity-100 ${islandClasses[island]?.coloredBg}`}
              onClick={() => {
                if (cat === category) {
                  navigate({ path: window.location.pathname.replace(`/${encodeURIComponent(category)}`, '') })
                } else {
                  navigate({ remove: { category: [cat] } })
                }
              }}
            >
              {cat}
            </button>
          ))}
        </div>
        <input
          ref={refs.setReference}
          type="text"
          className={`cat-filter-area tw-max-w-64 tw-justify-self-end tw-rounded-md tw-border-2 tw-border-gray-300 tw-bg-white tw-px-2 tw-py-2 focus:tw-border-sky-400 focus:tw-outline-none md:tw-justify-self-start lg:tw-block`}
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
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()

              refs.floating.current?.children?.[0]?.focus?.()
            }
          }}
        />
        {openDropdown && (
          <ul
            ref={refs.setFloating}
            style={floatingStyles}
            className="tw-z-10 tw-max-h-[40vh] tw-min-w-48 tw-max-w-[95vw] tw-overflow-y-auto tw-rounded-lg tw-bg-white tw-shadow-2xl"
          >
            {categoryResults
              .filter((cr) => !categoryMap[cr.value.label])
              .map((cr, i) => (
                <li
                  key={`${i}-${cr.value.label}`}
                  className="tw-cursor-pointer tw-px-2 tw-py-1 tw-text-left tw-text-sm tw-capitalize tw-text-gray-600 hover:tw-bg-gray-50 focus:tw-bg-gray-100 focus:tw-outline-none"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    navigate({ add: { category: [cr.value.label] } })
                  }}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    e.preventDefault()

                    switch (e.key) {
                      case 'ArrowDown':
                        return (e.currentTarget.nextElementSibling as any)?.focus?.()
                      case 'ArrowUp':
                        if (i === 0) {
                          return refs.reference.current?.focus?.()
                        }
                        return (e.currentTarget.previousElementSibling as any)?.focus?.()
                    }
                  }}
                >
                  {cr.segments.map((seg, i) => (
                    <span key={i} className={`${seg.match ? 'tw-font-bold' : ''}`}>
                      {seg.substring}
                    </span>
                  ))}
                </li>
              ))}
          </ul>
        )}
        <input
          type="text"
          className={`search-area tw-max-w-64 tw-justify-self-center tw-rounded-md tw-border-2 tw-border-gray-300 tw-bg-white tw-px-2 tw-py-2 focus:tw-border-sky-400 focus:tw-outline-none lg:tw-block`}
          value={liveSearchValue}
          placeholder="Search Content"
          onInput={(e) => {
            setLiveSearchValue((e as any).target.value)
            debouncedSearch((e as any).target.value)
          }}
        />
        <div className="islands-area tw-mt-2 tw-flex tw-shrink-0 tw-flex-nowrap tw-justify-self-center tw-overflow-clip tw-rounded-md tw-bg-white md:tw-mt-0 md:tw-justify-self-end">
          <button
            type="button"
            className={`tw-rounded-l-md tw-border-y tw-border-l tw-border-red-500 tw-px-4 tw-py-1 ${
              !island || island === 'hawaii' ? 'tw-bg-red-500 tw-text-red-100' : 'tw-text-red-500'
            }`}
            onClick={() => islandSelection('hawaii')}
          >
            Hawaii
          </button>
          <button
            type="button"
            className={`tw-border-y tw-border-pink-500 tw-px-4 tw-py-1 ${
              !island || island === 'maui' ? 'tw-bg-pink-500 tw-text-pink-100' : 'tw-text-pink-500'
            }`}
            onClick={() => islandSelection('maui')}
          >
            Maui
          </button>
          <button
            type="button"
            className={`tw-border-y tw-border-yellow-500 tw-px-4 tw-py-1 ${
              !island || island === 'oahu' ? 'tw-bg-yellow-500 tw-text-yellow-100' : 'tw-text-yellow-500'
            }`}
            onClick={() => islandSelection('oahu')}
          >
            Oahu
          </button>
          <button
            type="button"
            className={`tw-rounded-r-md tw-border-y tw-border-r tw-border-fuchsia-500 tw-px-4 tw-py-1 ${
              !island || island === 'kauai' ? 'tw-bg-fuchsia-500 tw-text-fuchsia-100' : 'tw-text-fuchsia-500'
            }`}
            onClick={() => islandSelection('kauai')}
          >
            Kauai
          </button>
        </div>
      </div>
      {!loaded && (
        <div className="tw-flex-center tw-min-h-96 tw-w-full tw-animate-pulse">
          <div className="tw-flex-center tw-flex-col">
            <img
              src="https://lirp.cdn-website.com/0e650340/dms3rep/multi/opt/twhawaii-logo-300w.png"
              alt="loading activities from around Hawaii..."
            />
            <span className="tw-text-xl tw-font-bold">Sailing around the Islands...</span>
          </div>
        </div>
      )}
      {!!(lists.suggestions.length || lists.matches.length) && loaded && (
        <div className="tw-px-2 tw-pb-8">
          <h3>Search Results</h3>
          {!lists.matches.length && (
            <p className="tw-w-full tw-px-4 tw-text-center">No activities matched your search</p>
          )}
          <ul className="tw-grid tw-grid-cols-[repeat(auto-fill,minmax(300px,1fr))] tw-gap-4">
            {lists.matches.map((data) => (
              <ListingItem key={data.page_item_url} listing={data.data} listingURL={data.page_item_url} />
            ))}
          </ul>
          {!!lists.suggestions.length && (
            <>
              <h3>Suggestions</h3>
              <ul className="tw-grid tw-grid-cols-[repeat(auto-fill,minmax(300px,1fr))] tw-gap-4">
                {lists.suggestions.map((data) => (
                  <ListingItem key={data.page_item_url} listing={data.data} listingURL={data.page_item_url} />
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}
