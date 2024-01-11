import { useEffect, useRef, useState } from 'preact/hooks'
import { useRememberedState } from '../hooks/useRememberedState'
import { ComponentProps } from 'preact'
import { HawaiianIslands } from './Hawaii'
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react-dom'
import { useDebouncedCallback } from '../hooks/useDebouncedCallback'
import { IslandValue, ListingsEngine, SearchParams, SearchResult } from '../utils/ListingsEngine'
import { deviceType, env, siteID } from '../utils/environment'

const islandHoverAndFocusClasses =
  `tw-absolute tw-inset-y-0 tw-right-0 -tw-z-10 tw-my-auto tw-w-2/3 tw-origin-center tw-rotate-12
  tw-text-[#ecd9c7]
  peer-focus-within/big-island:[--big-island-highlight-color:theme(colors.red.600)] peer-hover/big-island:[--big-island-highlight-color:theme(colors.red.600)]
  peer-focus-within/kauai:[--kauai-highlight-color:theme(colors.fuchsia.500)] peer-hover/kauai:[--kauai-highlight-color:theme(colors.fuchsia.500)]
  peer-focus-within/maui:[--maui-highlight-color:theme(colors.pink.600)] peer-hover/maui:[--maui-highlight-color:theme(colors.pink.600)]
  peer-focus-within/oahu:[--oahu-highlight-color:theme(colors.yellow.300)] peer-hover/oahu:[--oahu-highlight-color:theme(colors.yellow.300)]
  peer-focus-within/any-island:[--big-island-highlight-color:theme(colors.red.600)] peer-focus-within/any-island:[--kauai-highlight-color:theme(colors.fuchsia.500)] peer-focus-within/any-island:[--oahu-highlight-color:theme(colors.yellow.400)] peer-focus-within/any-island:[--maui-highlight-color:theme(colors.pink.600)]
  peer-hover/any-island:[--big-island-highlight-color:theme(colors.red.600)] peer-hover/any-island:[--kauai-highlight-color:theme(colors.fuchsia.500)] peer-hover/any-island:[--oahu-highlight-color:theme(colors.yellow.400)] peer-hover/any-island:[--maui-highlight-color:theme(colors.pink.600)]`.replace(
    /\s+/g,
    ' ',
  )

const islands: { value: IslandValue; label: string; peerClass: string; buttonClass: string }[] = [
  {
    value: 'kauai',
    label: 'Kauai',
    peerClass: 'tw-peer/kauai',
    buttonClass: 'tw-bg-fuchsia-500 tw-text-white focus:tw-bg-fuchsia-900 hover:tw-bg-fuchsia-900',
  },
  {
    value: 'oahu',
    label: 'Oahu',
    peerClass: 'tw-peer/oahu',
    buttonClass: 'tw-bg-yellow-300 tw-text-gray-800 focus:tw-bg-yellow-600 hover:tw-bg-yellow-600',
  },
  {
    value: 'maui',
    label: 'Maui',
    peerClass: 'tw-peer/maui',
    buttonClass: 'tw-bg-pink-600 tw-text-white focus:tw-bg-pink-900 hover:tw-bg-pink-900',
  },
  {
    value: 'hawaii',
    label: 'Hawaii',
    peerClass: 'tw-peer/big-island',
    buttonClass: 'tw-bg-red-600 tw-text-white focus:tw-bg-red-900 hover:tw-bg-red-900',
  },
  {
    value: '',
    label: 'Any Island',
    peerClass: 'tw-peer/any-island',
    buttonClass: 'tw-bg-red-600 tw-text-white focus:tw-bg-red-900 hover:tw-bg-red-900',
  },
]

const emptySearchResult: SearchResult = {
  matches: [],
  suggestions: [],
  categoryTags: [],
  notEnough: false,
  emptySearch: true,
}

const listingsEngine = new ListingsEngine()

export interface SearchBarProps extends Omit<ComponentProps<'div'>, 'size'> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  dropdownBGImage: string
  closeable?: boolean
}

export const SearchBar = ({
  className = '',
  size = 'sm',
  dropdownBGImage,
  closeable = false,
  ...props
}: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [island, setIsland] = useRememberedState('this-week-search-island-value', islands[1])

  const [searchClosed, setSearchClosed] = useState(closeable)

  const [openDropdown, setOpenDropdown] = useState(false)
  const [dropDownType, setDropdownType] = useState<'island' | 'results'>('island')
  const [search, setSearch] = useRememberedState('this-week-search-value', 'none')
  const [searchResults, setResultList] = useState<SearchResult>(emptySearchResult)

  const sizeClass = getSizeClass(size)

  const { refs, floatingStyles } = useFloating({
    strategy: 'fixed',
    placement: 'bottom-start',
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  })

  const go = async (params: SearchParams) => {
    const newResults = await listingsEngine.search({ ...params, includeCategories: true })

    setResultList(newResults)

    if (newResults.emptySearch) {
      setOpenDropdown(false)
    } else {
      setOpenDropdown(true)
    }
  }

  const debouncedGo = useDebouncedCallback(go, 500)

  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (openDropdown && refs.reference?.current && !refs.reference.current.contains(e.target as any)) {
        setOpenDropdown(false)
      }
    }
    window.addEventListener('click', listener)

    return () => window.removeEventListener('click', listener)
  }, [openDropdown])

  const dropDownComponent = openDropdown && (
    <div
      ref={refs.setFloating}
      style={{
        ...floatingStyles,
        backgroundPosition: 'bottom left',
        backgroundImage: dropDownType === 'island' ? `url(${dropdownBGImage})` : undefined,
      }}
      className={`${
        dropDownType === 'island' ? '' : 'tw-bg-gray-50'
      } tw-min-w-80 tw-max-w-[95vw] tw-overflow-clip tw-rounded-lg tw-shadow-2xl tw-shadow-black`}
    >
      {dropDownType === 'island' && (
        <ul className="tw-relative tw-w-screen tw-max-w-sm">
          {islands.map((isle) => (
            <li className={isle.peerClass}>
              <button
                className="tw-flex tw-w-full tw-items-center tw-p-3 tw-font-bold tw-text-white tw-drop-shadow-md hover:tw-bg-white/10 focus:tw-bg-white/10 focus:tw-outline-none"
                type="button"
                role="listitem"
                onClick={(e) => {
                  e.stopPropagation()

                  setIsland(isle)

                  if (!search) {
                    setOpenDropdown(false)
                  }

                  inputRef.current?.focus()

                  go({ island: isle.value, search })
                }}
              >
                {isle.label}
              </button>
            </li>
          ))}
          <HawaiianIslands className={islandHoverAndFocusClasses} />
        </ul>
      )}
      {dropDownType === 'results' && (
        <>
          {!searchResults.matches.length && !searchResults.suggestions.length && (
            <em className="tw-px-3 tw-py-1 tw-text-gray-500">
              {searchResults.notEnough ? 'Type more for better results...' : 'None'}
            </em>
          )}
          {!!(searchResults.matches.length || searchResults.suggestions.length) && (
            <ul>
              {searchResults.matches.map((listing) => (
                <li>
                  <a
                    href={getListingHref(listing.page_item_url)}
                    className="tw-block tw-w-full tw-px-3 tw-py-1 tw-font-bold hover:tw-bg-sky-100 focus:tw-bg-sky-100 focus:tw-outline-none"
                  >
                    {listing.data.business_name}
                  </a>
                </li>
              ))}
              {searchResults.suggestions.map((listing) => (
                <li>
                  <a
                    href={getListingHref(listing.page_item_url)}
                    className="tw-block tw-w-full tw-px-3 tw-py-1 tw-text-gray-600 hover:tw-bg-sky-100 focus:tw-bg-sky-100 focus:tw-outline-none"
                  >
                    {listing.data.business_name}
                  </a>
                </li>
              ))}
            </ul>
          )}
          {!!searchResults.categoryTags.length && (
            <ul>
              <p className="tw-mt-4 tw-border-b tw-border-b-gray-200 tw-px-2 tw-py-1 tw-text-sm tw-font-semibold tw-text-gray-800">
                Relevant Categories
              </p>
              {searchResults.categoryTags.map((tag) => (
                <li>
                  <a
                    href={getCategoryHref(tag.label, island.value)}
                    className="tw-block tw-w-full tw-px-3 tw-py-1 tw-capitalize hover:tw-bg-sky-100 focus:tw-bg-sky-100 focus:tw-outline-none"
                  >
                    {tag.label} <span className="tw-text-sm tw-text-gray-500">({tag.listings_count})</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )

  return (
    <div
      ref={refs.setReference}
      className={`${className} tw-relative tw-animate-fade-down ${
        !openDropdown ? 'tw-overflow-hidden' : ''
      } tw-rounded-r-lg`}
      {...props}
    >
      <div className={`tw-flex tw-w-full tw-items-stretch tw-text-black`}>
        <div
          className={`tw-z-10 tw-flex tw-grow tw-items-stretch tw-transition-transform tw-duration-300 ${
            searchClosed ? 'tw-translate-x-full' : 'tw-translate-x-0'
          }`}
        >
          <button
            type="button"
            className={`tw-group tw-relative tw-flex tw-min-h-10 tw-items-center tw-rounded-l-lg tw-border-2 tw-border-transparent tw-px-3 focus:tw-outline-none ${island.buttonClass}`}
            onClick={() => {
              if (dropDownType !== 'island') {
                setOpenDropdown(true)
                setDropdownType('island')
              } else {
                setOpenDropdown((o) => !o)
              }
            }}
          >
            <span className={`tw-flex tw-flex-nowrap tw-items-center tw-whitespace-nowrap ${sizeClass.text}`}>
              {island.label}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class={`${sizeClass.caret} tw-ml-2 ${
                  dropDownType === 'island' && openDropdown ? 'tw-rotate-180' : 'tw-rotate-0'
                } tw-transition-transform`}
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
          </button>
          {dropDownType === 'island' && dropDownComponent}
          <input
            ref={inputRef}
            className={`tw-m-0 tw-flex tw-h-full tw-items-center tw-border-2 tw-border-transparent tw-bg-white tw-px-2 tw-py-2 focus:tw-z-20 focus:tw-border-sky-400 focus:tw-outline-none ${sizeClass.text}`}
            type="text"
            name="search"
            value={search}
            onInput={(e) => {
              const newVal = (e as any).target.value
              setSearch(newVal)
              debouncedGo({ island: island.value, search: newVal })
            }}
            placeholder={`Explore ${island.label}`}
            onFocus={() => {
              if (dropDownType !== 'results') {
                setDropdownType('results')
              }

              if (!searchResults.matches.length && search) {
                go({ search, island: island.value })
                setOpenDropdown(true)
              }
            }}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return

              go({ search, island: island.value })
            }}
            autoComplete="off"
          />
          {dropDownType === 'results' && dropDownComponent}
        </div>
        <button
          type="button"
          className={`tw-z-10 tw-flex tw-min-h-8 tw-items-center tw-rounded-r-lg tw-border-x-2 tw-border-x-transparent tw-bg-gray-200 tw-px-2 focus:tw-border-2 focus:tw-border-sky-400 focus:tw-outline-none ${
            searchClosed ? 'tw-rounded-l-lg' : ''
          }`}
          onClick={async (e) => {
            e.stopPropagation()

            if (closeable && searchClosed) {
              setSearchClosed(false)
            } else if (!search) {
              if (openDropdown) {
                setOpenDropdown(false)
              }
              setSearchClosed(closeable)
            } else {
              go({ island: island.value, search })
              setDropdownType('results')
              setOpenDropdown(true)
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class={sizeClass.icon}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

function getSizeClass(size: 'sm' | 'md' | 'lg' | 'xl') {
  switch (size) {
    case 'xl':
      return { text: 'tw-text-3xl', icon: 'tw-h-8 tw-w-8', caret: 'tw-h-8 tw-w-8' }
    case 'lg':
      return { text: 'tw-text-xl', icon: 'tw-h-7 tw-w-7', caret: 'tw-h-6 tw-w-6' }
    case 'md':
      return { text: 'tw-text-lg', icon: 'tw-h-6 tw-w-6', caret: 'tw-h-5 tw-w-5' }
    case 'sm':
    default:
      return { text: 'tw-text-base', icon: 'tw-h-6 tw-w-6', caret: 'tw-h-5 tw-w-5' }
  }
}

function getListingHref(listingUrl: string) {
  switch (env) {
    case 'preview':
      return `/site/${siteID}/listing/${listingUrl}?preview=true&insitepreview=true&dm_device=${deviceType}`
    case 'editor':
      return `/site/${siteID}/listing/${listingUrl}?preview=true&nee=true&showOriginal=true&dm_checkSync=1&dm_try_mode=true&dm_device=${deviceType}`
    case 'live':
    default:
      return `/listing/${listingUrl}`
  }
}

function getCategoryHref(category: string, island: string) {
  switch (env) {
    case 'preview':
      return `/site/${siteID}/${
        island ? `${island}/` : ''
      }explore?category=${category}&preview=true&insitepreview=true&dm_device=${deviceType}`
    case 'editor':
      return `/site/${siteID}/${
        island ? `${island}/` : ''
      }explore?category=${category}&preview=true&nee=true&showOriginal=true&dm_checkSync=1&dm_try_mode=true&dm_device=${deviceType}`
    case 'live':
    default:
      return `/${island ? `${island}/` : ''}explore?category=${category}`
  }
}
