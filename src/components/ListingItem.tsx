import { getListingHref } from 'utils/urls'
import { Listing } from '../@types/duda'
import { ComponentProps } from 'preact'

export interface ListingItemProps extends ComponentProps<'li'> {
  listing: Listing
  listingURL: string
}

const islandClasses = {
  hawaii: {
    pill: 'tw-bg-red-500 tw-text-white',
    icon: 'tw-text-red-500',
  },
  maui: {
    pill: 'tw-bg-pink-500 tw-text-white',
    icon: 'tw-text-pink-500',
  },
  oahu: {
    pill: 'tw-bg-yellow-500 tw-text-white',
    icon: 'tw-text-yellow-500',
  },
  kauai: {
    pill: 'tw-bg-fuchsia-500 tw-text-white',
    icon: 'tw-text-fuchsia-500',
  },
}

export const ListingItem = ({ className = '', listing, listingURL, ...props }: ListingItemProps) => {
  const oneIsland = listing.island.split('|')[0] as keyof typeof islandClasses
  const pillBgClass = islandClasses[oneIsland]?.pill
  const iconClass = islandClasses[oneIsland]?.icon

  return (
    <li
      className={`${className} tw-flex tw-flex-col tw-overflow-clip tw-rounded-md tw-bg-white tw-shadow-md`}
      {...props}
    >
      <a className="tw-flex tw-grow tw-flex-col" href={getListingHref(listingURL)}>
        <div
          className={`tw-aspect-video tw-w-full ${
            listing.main_image ? 'tw-bg-cover' : 'tw-bg-contain tw-bg-no-repeat tw-opacity-50'
          } tw-bg-center`}
          style={{
            backgroundImage: `url(${
              listing.main_image || 'https://lirp.cdn-website.com/0e650340/dms3rep/multi/opt/twhawaii-logo-640w.png'
            })`,
          }}
        ></div>
        <div className="tw-relative tw-flex tw-h-[180px] tw-grow tw-flex-col tw-p-2 tw-text-justify">
          <h5 className="mb-2 tw-text-base">{listing.business_name}</h5>
          <p className="tw-grow tw-overflow-y-hidden tw-text-sm">{listing.description}</p>
          <div className="no-scrollbar tw-absolute tw-inset-x-0 tw-bottom-0 tw-flex tw-flex-nowrap tw-items-end tw-gap-2 tw-overflow-x-auto tw-bg-gradient-to-t tw-from-white tw-from-60% tw-px-2 tw-pb-2 tw-pt-6">
            {listing.categories?.map((category) => (
              <span
                className={`tw-whitespace-nowrap tw-rounded-full tw-px-2 tw-py-0.5 tw-text-xs tw-capitalize ${pillBgClass}`}
              >
                {category.label}
              </span>
            ))}
          </div>
        </div>
        <div className="tw-mt-auto tw-flex tw-grow-0 tw-items-center tw-border-t tw-border-t-gray-200 tw-p-2 tw-text-xs tw-capitalize tw-text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`tw-mr-1 tw-h-4 tw-w-4 ${iconClass}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
            />
          </svg>
          {listing.island.split('|').join(' | ')}
        </div>
      </a>
    </li>
  )
}
