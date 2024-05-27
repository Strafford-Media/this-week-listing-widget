import { getListingHref } from '../utils/urls'
import { Listing } from '../@types/duda'
import { ComponentProps } from 'preact'
import { useOptimizedImageURL } from 'hooks/useOptimizedImageURL'
import { SimpleHawaii } from './SimpleHawaii'
import { deviceType } from '../utils/environment'
import { CategoryList } from './CategoryList'
import { islandClasses } from '../utils/islandClasses'

export interface ListingItemProps extends ComponentProps<'li'> {
  listing: Listing
  listingURL: string
}

const placeholderImg = 'https://lirp.cdn-website.com/0e650340/dms3rep/multi/opt/twhawaii-logo-300w.png'

export const ListingItem = ({ className = '', listing, listingURL, ...props }: ListingItemProps) => {
  const oneIsland = listing.island.split('|')[0]

  const { optimizedImg, loaded } = useOptimizedImageURL(
    listing.main_image,
    deviceType === 'mobile' ? 100 : 300,
    placeholderImg,
  )

  return (
    <li className={`${className} tw-overflow-clip tw-rounded-md tw-bg-white tw-shadow-md`} {...props}>
      <a className="tw-relative tw-flex tw-flex-wrap sm:tw-flex-col" href={getListingHref(listingURL)}>
        <div
          className={`tw-relative tw-aspect-square tw-h-16 tw-w-16 tw-shrink-0 sm:tw-aspect-video sm:tw-h-auto sm:tw-w-full`}
        >
          <SimpleHawaii
            className={`tw-absolute tw-inset-0 tw-m-auto tw-max-h-full tw-shrink tw-text-gray-200 tw-duration-500 ${
              loaded ? 'tw-opacity-0' : 'tw-opacity-100'
            }`}
          />
          <div
            className={`tw-aspect-square tw-h-full tw-bg-center tw-duration-500 sm:tw-aspect-video sm:tw-w-full ${
              optimizedImg !== placeholderImg ? 'tw-bg-cover' : 'tw-bg-contain tw-bg-no-repeat tw-opacity-50'
            } ${loaded ? 'tw-opacity-100' : 'tw-opacity-0'}`}
            style={{
              backgroundImage: `url(${optimizedImg})`,
            }}
          ></div>
        </div>
        <div className="tw-relative tw-flex tw-h-16 tw-w-[calc(100%-4rem)] tw-shrink tw-flex-col tw-px-2 tw-text-justify tw-shadow-[inset_0_-7px_9px_-7px_rgba(0,0,0,0.4)] sm:tw-h-[180px] sm:tw-w-full sm:tw-shrink-0 sm:tw-pt-2">
          <h5 className="tw-my-0 tw-shrink-0 tw-truncate tw-text-sm sm:tw-text-clip sm:tw-text-base">
            {listing.business_name}
          </h5>
          <p className="tw-grow tw-overflow-y-hidden tw-text-xs sm:tw-text-sm">{listing.description}</p>
          <CategoryList
            categories={listing.categories}
            island={oneIsland}
            className="tw-hidden tw-bg-gradient-to-t tw-from-white tw-from-60% tw-px-2 sm:tw-absolute sm:tw-inset-x-0 sm:tw-bottom-0 sm:tw-flex sm:tw-pb-2 sm:tw-pt-6"
          />
        </div>
        <div className="tw-mt-auto tw-flex tw-w-full tw-items-center tw-gap-1 tw-border-t tw-border-t-gray-200 tw-py-1 tw-pl-2 tw-pr-0 tw-text-xs tw-text-gray-500 sm:tw-grow-0 sm:tw-py-2">
          <span className="tw-flex-center tw-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`tw-mr-1 tw-h-4 tw-w-4 ${islandClasses[oneIsland].text}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              />
            </svg>
            {listing.island
              .split('|')
              .map((isle) => islandClasses[isle].label)
              .join(' | ')}
          </span>
          <CategoryList categories={listing.categories} island={oneIsland} className="tw-px-2 sm:tw-hidden" />
        </div>
      </a>
    </li>
  )
}
