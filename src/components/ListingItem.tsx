import { Listing } from '../@types/duda'
import { ComponentProps } from 'preact'

export interface ListingItemProps extends ComponentProps<'div'> {
  listing: Listing
}

export const ListingItem = ({ className = '', listing, ...props }: ListingItemProps) => {
  return (
    <div className={`${className} tw-overflow-clip tw-rounded-md tw-bg-white tw-shadow-md`} {...props}>
      <div
        className="tw-aspect-video tw-w-full tw-bg-cover tw-bg-center"
        style={{ backgroundImage: `url(${listing.main_image})` }}
      ></div>
      <div className="tw-p-2">
        <h5>{listing.business_name}</h5>
        <p>{listing.description}</p>
      </div>
      <div className="tw-border-t-gray-300 tw-p-2 tw-text-xs tw-capitalize tw-text-gray-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
          />
        </svg>
        {listing.island}
      </div>
    </div>
  )
}
