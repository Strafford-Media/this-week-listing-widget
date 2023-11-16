import { useEffect, useRef, useState } from 'preact/hooks'
import { useRememberedState } from '../hooks/useRememberedState'
import { ComponentProps } from 'preact'
import { HawaiianIslands } from './Hawaii'
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react-dom'
import { useDebouncedCallback } from '../hooks/useDebouncedCallback'
import { IslandValue, SearchEngine, SearchParams, SearchResult } from '../utils/SearchEngine'

const islands: { value: IslandValue; label: string; peerClass: string }[] = [
  {
    value: 'kauai',
    label: 'Kauai',
    peerClass: 'tw-peer/kauai',
  },
  {
    value: 'oahu',
    label: 'Oahu',
    peerClass: 'tw-peer/oahu',
  },
  {
    value: 'maui',
    label: 'Maui',
    peerClass: 'tw-peer/maui',
  },
  {
    value: 'hawaii',
    label: 'Hawaii',
    peerClass: 'tw-peer/big-island',
  },
  { value: '', label: 'Any Island', peerClass: 'tw-peer/any-island' },
]

const emptySearchResult: SearchResult = {
  matches: [],
  suggestions: [],
  notEnough: true,
  emptySearch: true,
}

const searchEngine = new SearchEngine()

export interface SearchBarProps extends Omit<ComponentProps<'div'>, 'size'> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export const SearchBar = ({ className = '', size = 'sm', ...props }: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [island, setIsland] = useRememberedState('this-week-search-island-value', islands[0])
  const [openDropdown, setOpenDropdown] = useState(false)
  const [dropDownType, setDropdownType] = useState<'island' | 'results'>('island')
  const [search, setSearch] = useRememberedState('this-week-search-value', '')
  const [searchResults, setResultList] = useState<SearchResult>(emptySearchResult)

  const sizeClass = getSizeClass(size)

  const { refs, floatingStyles } = useFloating({
    strategy: 'fixed',
    placement: 'bottom-start',
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  })

  const go = async (params: SearchParams) => {
    const newList = await searchEngine.search(params)

    console.log(newList)
    setResultList(newList)
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
      style={floatingStyles}
      className="tw-bg-gray-50 tw-rounded-lg tw-overflow-clip tw-shadow-lg"
    >
      {dropDownType === 'island' && (
        <ul className="tw-relative tw-max-w-sm tw-w-screen">
          {islands.map((isle) => (
            <li className={isle.peerClass}>
              <button
                className="tw-p-3 tw-flex tw-w-full tw-items-center focus:tw-outline-none focus:tw-bg-blue-100 hover:tw-bg-blue-100"
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
          <HawaiianIslands
            className={`tw-text-lime-200 tw-w-2/3 tw-inset-y-0 tw-my-auto tw-origin-center tw-absolute tw-right-0 tw-rotate-12 peer-hover/kauai:[--kauai-highlight-color:theme(colors.lime.600)] peer-focus-within/kauai:[--kauai-highlight-color:theme(colors.lime.600)] peer-hover/oahu:[--oahu-highlight-color:theme(colors.lime.600)] peer-focus-within/oahu:[--oahu-highlight-color:theme(colors.lime.600)] peer-hover/maui:[--maui-highlight-color:theme(colors.lime.600)] peer-focus-within/maui:[--maui-highlight-color:theme(colors.lime.600)] peer-hover/big-island:[--big-island-highlight-color:theme(colors.lime.600)] peer-focus-within/big-island:[--big-island-highlight-color:theme(colors.lime.600)] peer-hover/any-island:tw-text-lime-600 peer-focus-within/any-island:tw-text-lime-600`}
          />
        </ul>
      )}
      {dropDownType === 'results' && (
        <>
          {!searchResults.matches.length ? (
            <p>Unfortunately, nothing matched your search terms.</p>
          ) : (
            <ul>
              <p className="tw-text-sm tw-text-gray-600 tw-border-b tw-border-b-gray-200">Matches</p>
              {searchResults.matches.map((isle) => (
                <li>
                  <a href={getListingHref(isle.value)} className="tw-py-1 tw-px-3 tw-inline-block">
                    {isle.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
          {searchResults.notEnough && <p>Type more for better results...</p>}
          {!!searchResults.suggestions.length && (
            <ul>
              <p className="tw-text-sm tw-text-gray-600">Suggestions</p>
              {searchResults.suggestions.map((isle) => (
                <li>
                  <a href={getListingHref(isle.value)} className="tw-py-1 tw-px-3 tw-inline-block">
                    {isle.label}
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
    <div ref={refs.setReference} className="tw-relative tw-z-10 tw-animate-fade-down">
      <div className={`${className} tw-w-full tw-flex tw-items-stretch tw-text-black`} {...props}>
        <button
          type="button"
          className={`tw-group tw-px-3 tw-min-h-10 tw-relative tw-rounded-l-lg focus:tw-border-red-600 tw-border-2 tw-border-transparent tw-bg-yellow-300 tw-flex tw-items-center focus:tw-outline-none`}
          onClick={() => {
            if (dropDownType !== 'island') {
              setOpenDropdown(true)
              setDropdownType('island')
            } else {
              setOpenDropdown((o) => !o)
            }
          }}
        >
          <div
            className={`tw-absolute -tw-inset-0.5 group-focus:tw-inset-0 tw-rounded-l-lg tw-z-10 tw-bg-gradient-to-b tw-to-transparent tw-from-white/50`}
          ></div>
          <span className={`tw-flex tw-flex-nowrap tw-whitespace-nowrap tw-items-center ${sizeClass.text}`}>
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
          className={`tw-flex tw-h-full tw-items-center tw-px-2 tw-py-2 focus:tw-outline-none tw-border-transparent tw-border-2 focus:tw-border-red-600 focus:tw-z-20 tw-m-0 tw-bg-white ${sizeClass.text}`}
          type="text"
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
          }}
        />
        {dropDownType === 'results' && dropDownComponent}
        <button
          type="button"
          className="tw-px-2 tw-min-h-8 tw-bg-gradient-to-b tw-from-gray-200 tw-to-gray-400 tw-flex tw-rounded-r-lg tw-items-center focus:tw-outline-none focus:tw-border-red-600 focus:tw-border-2 tw-border-x-2 tw-border-x-transparent"
          onClick={async (e) => {
            e.stopPropagation()

            go({ island: island.value, search })
            setDropdownType('results')
            setOpenDropdown(true)
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
    case 'md':
      return { text: 'tw-text-lg', icon: 'tw-h-7 tw-w-7', caret: 'tw-h-5 tw-w-5' }
    case 'lg':
      return { text: 'tw-text-xl', icon: 'tw-h-8 tw-w-8', caret: 'tw-h-6 tw-w-6' }
    case 'xl':
      return { text: 'tw-text-3xl', icon: 'tw-h-10 tw-w-10', caret: 'tw-h-8 tw-w-8' }
    case 'sm':
    default:
      return { text: 'tw-text-base', icon: 'tw-h-6 tw-w-6', caret: 'tw-h-5 tw-w-5' }
  }
}

const env = (window as any).dmAPI.getCurrentEnvironment()
const siteID = (window as any).dmAPI.getSiteName()
const deviceType = (window as any).dmAPI.getCurrentDeviceType()

function getListingHref(listingUrl: string) {
  switch (env) {
    case 'preview':
      return `/site/${siteID}/listings/${listingUrl}?preview=true&insitepreview=true&dm_device=${deviceType}`
    case 'editor':
      return `/site/${siteID}/listings/${listingUrl}?preview=true&nee=true&showOriginal=true&dm_checkSync=1&dm_try_mode=true&dm_device=${deviceType}`
    case 'live':
    default:
      return `/listings/${listingUrl}`
  }
}
