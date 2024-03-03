import { ComponentProps, Fragment } from 'preact'
import { useDudaContext } from '../DudaContext'
import { useEffect, useState } from 'preact/hooks'
import { PhotoGallery } from './PhotoGallery'
import { VideoPlayer } from './VideoPlayer'
import { BookingLinks } from './BookingLinks'
import { Listing } from '../@types/duda'
import { BigIsland, HawaiianIslands, Kauai, Maui, Oahu } from './Hawaii'
import { BusinessHours } from './BusinessHours'
import { OptimizedImage } from './OptimizedImage'
import { ListingsEngine } from '../utils/ListingsEngine'
import { islandClasses } from '../utils/islandClasses'

const listingEngine = new ListingsEngine()

const islandLogos: Record<string, string> = {
  hawaii: 'https://lirp.cdn-website.com/0e650340/dms3rep/multi/opt/Hawaii-200w.png',
  maui: 'https://lirp.cdn-website.com/0e650340/dms3rep/multi/opt/maui-200w.png',
  oahu: 'https://lirp.cdn-website.com/0e650340/dms3rep/multi/opt/OAHU-200w.png',
  kauai: 'https://lirp.cdn-website.com/0e650340/dms3rep/multi/opt/kauai-200w.png',
}

const aspectRatio: Record<string, string> = {
  hawaii: 'tw-aspect-[200/51] tw-translate-y-px',
  maui: 'tw-aspect-[100/33]',
  oahu: 'tw-aspect-[40/13]',
  kauai: 'tw-aspect-[200/63]',
}

const imageWidths = ['', '', 'tw-max-w-1/2', 'tw-max-w-1/3', 'tw-max-w-1/4']

const socialPrefixes: Record<string, string> = {
  twitter: 'https://twitter.com/',
  facebook: 'https://facebook.com/',
  instagram: 'https://instagram.com/',
  youtube: 'https://youtube.com/',
  linkedin: 'https://www.linkedin.com/',
  google_my_business: 'https://google.com/maps/place/',
  pinterest: 'https://pinterest.com/',
  snapchat: 'https://www.snapchat.com/',
  tiktok: 'https://tiktok.com/@',
  vimeo: 'https://vimeo.com/',
  reddit: 'https://www.reddit.com/',
  whatsapp: 'https://wa.me/',
  foursquare: 'https://foursquare.com/',
  yelp: 'http://www.yelp.com/biz/',
  tripadvisor: 'https://www.tripadvisor.com/',
  rss: '',
}

export interface FullListingProps extends ComponentProps<'div'> {}

export const FullListing = ({ className = '', ...props }: FullListingProps) => {
  const { pageData } = useDudaContext()

  const allIslands = pageData?.island.split('|') ?? []

  const [categories, setCategories] = useState(pageData?.categories)

  useEffect(() => {
    const listener = () => {
      setCategories(listingEngine.collectionManager.listingsMap[pageData?.id!]?.data?.categories)
    }

    listingEngine.addEventListener('collections-loaded', listener)

    return () => listingEngine.removeEventListener('collections-loaded', listener)
  })

  useEffect(() => {
    const hasAddress = pageData?.primary_address || pageData?.lat_lng

    if (typeof (window as any).dmAPI !== 'undefined' && hasAddress) {
      ;(window as any).dmAPI.drawMap({
        container: '.main-listing-mapbox-map',
        ...getMapAddress(pageData),
        // layout: 'layout2',
      })
    }
  }, [pageData?.primary_address])

  if (!pageData) return null

  const socialKeys = Object.keys(pageData.social_media).filter((k) => pageData.social_media[k])

  return (
    <div className={`${className}`} {...props}>
      <section className="tw-relative tw-pt-8 md:tw-mx-auto md:tw-max-w-6xl md:tw-p-8">
        {pageData.this_week_recommended && (
          <div className="tw-absolute tw-right-0 tw-top-0 tw-flex tw-rotate-12 tw-flex-col tw-items-center tw-text-[9px] tw-font-bold tw-leading-[1] tw-text-red-500">
            <img
              src="https://lirp.cdn-website.com/0e650340/dms3rep/multi/opt/twhawaii-logo-300w.png"
              className="tw-w-12"
            />
            Recommended!
          </div>
        )}
        <div className="tw-mb-8 tw-flex tw-gap-6 lg:tw-gap-12">
          <div className="tw-flex tw-w-full tw-max-w-1/2 tw-flex-col">
            {pageData.logo && (
              <OptimizedImage
                optimizedWidth={300}
                className="tw-mb-6"
                src={pageData.logo}
                alt={pageData.business_name}
              />
            )}
            {pageData.island === 'oahu' && (
              <Oahu
                className="tw-max-w-48 tw-scale-[2] tw-self-center tw-text-green-200 [--island-highlight-color:theme(colors.yellow.400)]"
                strokeWidth={200}
              />
            )}
            {pageData.island === 'maui' && (
              <Maui
                className="tw-max-w-48 tw-scale-125 tw-self-center tw-text-green-200 [--island-highlight-color:theme(colors.pink.500)]"
                strokeWidth={200}
              />
            )}
            {pageData.island === 'kauai' && (
              <Kauai
                className="tw-max-w-48 tw-scale-150 tw-self-center tw-text-green-200 [--island-highlight-color:theme(colors.fuchsia.500)]"
                strokeWidth={200}
              />
            )}
            {pageData.island === 'hawaii' && (
              <BigIsland
                className="tw-max-w-48 tw-self-center tw-text-green-200 [--island-highlight-color:theme(colors.red.500)]"
                strokeWidth={200}
              />
            )}
            {pageData.island.includes('|') && (
              <HawaiianIslands
                className={`tw-max-w-48 tw-self-center tw-text-green-200 ${allIslands
                  .map((isle) => islandClasses[isle].islandHighlight)
                  .filter(Boolean)
                  .join(' ')}`}
                strokeWidth={200}
              />
            )}
            {pageData.island.includes('|') ? (
              <div className="tw-flex tw-w-full tw-flex-nowrap tw-gap-2">
                {pageData.island
                  .split('|')
                  .reverse()
                  .map((isle, _, arr) => (
                    <img
                      className={`${imageWidths[arr.length]} tw-shrink ${aspectRatio[isle]}`}
                      src={islandLogos[isle]}
                    />
                  ))}
              </div>
            ) : (
              <img className="tw-self-center" src={islandLogos[pageData.island]} />
            )}
          </div>
          <div className="tw-grow tw-pt-2">
            <p className="tw-mb-6">
              {pageData.description.split('\n').map((text, i) => (
                <Fragment key={i}>
                  {i !== 0 && <br />}
                  {text}
                </Fragment>
              ))}
            </p>
            {pageData.action_shot1 && (
              <OptimizedImage
                optimizedWidth={640}
                className="tw-ml-auto tw-rounded"
                src={pageData.action_shot1}
                alt={`${pageData.business_name} Action Shot`}
              />
            )}
          </div>
        </div>
        {!!pageData.booking_links?.length && <BookingLinks links={pageData.booking_links} className="tw-mb-8" />}
        {!!pageData.videos.length && <VideoPlayer video={pageData.videos[0]} className="tw-mb-8" />}
        {!!pageData.images?.length && <PhotoGallery images={pageData.images} className="tw-mb-8" />}
        {categories?.map((cat) => cat.label)}
        <div className="tw-mb-4">
          <BusinessHours className="tw-mb-8" businessHours={pageData.business_hours} />
          <h3>Contact Us</h3>
          {socialKeys.length > 0 && (
            <p>
              Social Media:{' '}
              <ul className="tw-inline-flex tw-gap-4">
                {socialKeys.map((sk) => (
                  <li key={sk}>
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      href={`${socialPrefixes[sk]}${pageData.social_media[sk]}`}
                    >
                      <svg className="tw-h-6 tw-w-6 tw-text-red-500">
                        <use xlinkHref={`#svg_icon_${sk}`}></use>
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </p>
          )}
          {pageData.primary_email && (
            <p>
              Email:{' '}
              <em>
                <a
                  className="hover:tw-text-blue-400 hover:tw-underline focus:tw-text-blue-400 focus:tw-underline focus:tw-outline-none"
                  href={`mailto:${pageData.primary_email}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {pageData.primary_email}
                </a>
              </em>
            </p>
          )}
          {pageData.primary_phone && (
            <p>
              Phone:{' '}
              <em>
                <a
                  className="hover:tw-text-blue-400 hover:tw-underline focus:tw-text-blue-400 focus:tw-underline focus:tw-outline-none"
                  href={`tel:${pageData.primary_phone}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {pageData.primary_phone}
                </a>
              </em>
            </p>
          )}
          {pageData.primary_web_url && (
            <p>
              Online:{' '}
              <em>
                <a
                  className="hover:tw-text-blue-400 hover:tw-underline focus:tw-text-blue-400 focus:tw-underline focus:tw-outline-none"
                  href={pageData.primary_web_url}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {pageData.primary_web_url}
                </a>
              </em>
            </p>
          )}
          {pageData.primary_address && (
            <p>
              In Person: <em>{pageData.primary_address}</em>
            </p>
          )}
        </div>
        {(pageData.primary_address || pageData.lat_lng) && <div className="main-listing-mapbox-map"></div>}
      </section>
    </div>
  )
}

const getMapAddress = (pageData: Listing) => {
  if (pageData.lat_lng) {
    const [lat, lng] = pageData.lat_lng
      .replace(/[()]/g, '')
      .split(',')
      .map((t) => t.trim())

    return {
      lat,
      lng,
    }
  }

  if (pageData.primary_address) {
    return { addressQuery: pageData.primary_address }
  }

  return {}
}
