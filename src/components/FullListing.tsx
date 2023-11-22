import { ComponentProps } from 'preact'
import { useDudaContext } from '../DudaContext'
import { useEffect } from 'preact/hooks'
import { PhotoGallery } from './PhotoGallery'

export interface FullListingProps extends ComponentProps<'div'> {}

export const FullListing = ({ className = '', ...props }: FullListingProps) => {
  const { pageData } = useDudaContext()

  useEffect(() => {
    if (typeof (window as any).dmAPI !== 'undefined' && pageData) {
      ;(window as any).dmAPI.drawMap({
        container: '.main-listing-mapbox-map',
        addressQuery: pageData.primary_address,
        // layout: 'layout2',
      })
    }
  }, [pageData?.primary_address])

  if (!pageData) return null

  return (
    <div className={`${className}`} {...props}>
      <section className="tw-relative md:tw-mx-auto md:tw-max-w-6xl md:tw-p-8">
        {!pageData.this_week_recommended && (
          <div className="tw-absolute tw-right-0 tw-top-0 tw-flex tw-rotate-12 tw-flex-col tw-items-center tw-text-[9px] tw-font-bold tw-leading-[1] tw-text-red-500">
            <img
              src="https://lirp.cdn-website.com/0e650340/dms3rep/multi/opt/twhawaii-logo-1920w.png"
              className="tw-w-12"
            />
            Recommended!
          </div>
        )}
        <div className="tw-flex tw-gap-6 lg:tw-gap-12">
          {pageData.logo && <img className="tw-max-w-1/2" src={pageData.logo} alt={pageData.business_name} />}
          <p className="tw-grow tw-pt-2">{pageData.description}</p>
        </div>
        <div className="tw-flex tw-items-center tw-gap-6">
          {pageData.action_shot1 && (
            <img className="tw-max-w-1/2" src={pageData.action_shot1} alt={`${pageData.business_name} Action Shot`} />
          )}
          <div className="tw-mx-auto">
            <button>
              <span className="text">Book Now</span>
            </button>
          </div>
        </div>
        <div>{pageData.island}</div>
        <div>{pageData.primary_email}</div>
        <div>{pageData.primary_phone}</div>
        <a href={pageData.primary_web_url} target="_blank" rel="noreferrer noopener">
          {pageData.primary_web_url}
        </a>
        <div>{pageData.primary_address}</div>
        <div className="main-listing-mapbox-map"></div>
        <p>{pageData.description}</p>
        {!!pageData.images?.length && <PhotoGallery images={pageData.images} />}
      </section>
    </div>
  )
}
