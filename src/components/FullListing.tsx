import { ComponentProps, Fragment } from 'preact'
import { useDudaContext } from '../DudaContext'
import { useEffect, useState } from 'preact/hooks'
import { PhotoGallery } from './PhotoGallery'
import { VideoList } from './VideoList'
import { BookingLinks } from './BookingLinks'
import { Listing } from '../@types/duda'
import { BigIsland, HawaiianIslands, Kauai, Maui, Oahu } from './Hawaii'
import { BusinessHours } from './BusinessHours'
import { OptimizedImage } from './OptimizedImage'
import { ListingsEngine } from '../utils/ListingsEngine'
import { islandClasses } from '../utils/islandClasses'
import { CategoryList } from './CategoryList'
import { ensureHttpsUrl, getLinkPrefix } from '../utils/urls'

const listingEngine = new ListingsEngine()

const islandLogos: Record<string, string> = {
  hawaii: 'https://lirp.cdn-website.com/0e650340/dms3rep/multi/opt/Hawaii-200w.png',
  maui: 'https://lirp.cdn-website.com/0e650340/dms3rep/multi/opt/maui-200w.png',
  oahu: 'https://lirp.cdn-website.com/0e650340/dms3rep/multi/opt/OAHU-200w.png',
  kauai: 'https://lirp.cdn-website.com/0e650340/dms3rep/multi/opt/kauai-200w.png',
}

const islandLinks: Record<string, string> = {
  hawaii: `${getLinkPrefix()}/hawaii`,
  maui: `${getLinkPrefix()}/maui`,
  oahu: `${getLinkPrefix()}/oahu`,
  kauai: `${getLinkPrefix()}/kauai`,
}

const aspectRatio: Record<string, string> = {
  hawaii: 'tw-aspect-[200/51] tw-translate-y-px',
  maui: 'tw-aspect-[100/33]',
  oahu: 'tw-aspect-[40/13]',
  kauai: 'tw-aspect-[200/63]',
}

const imageWidths = ['', '', 'tw-max-w-[45%]', 'tw-max-w-[28%]', 'tw-max-w-[21%]']
const imageSpacing = ['', '', 'tw-gap-[10%]', 'tw-gap-[8%]', 'tw-gap-[5.3%]']

const islandsInOrder = ['kauai', 'oahu', 'maui', 'hawaii']

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

    if (typeof (window as any).dmAPI !== 'undefined' && hasAddress && pageData.tier !== 'basic') {
      ;(window as any).dmAPI.drawMap({
        container: '.main-listing-mapbox-map',
        ...getMapAddress(pageData),
        // layout: 'layout2',
      })
    }
  }, [pageData?.primary_address, pageData?.lat_lng, pageData?.tier])

  if (!pageData) return null

  const socialKeys = Object.keys(pageData.social_media).filter((k) => pageData.social_media[k])

  const islands = pageData.island.split('|')

  const { images: imagesMax, videos: videoMax } = mediaMaxes(pageData.tier)

  const breadcrumbs = [
    { href: '/', label: 'Home' },
    ...(pageData.breadcrumbs ?? []),
    { href: '', label: pageData.business_name },
  ]

  return (
    <div className={`${className}`} {...props}>
      <section className="tw-pt-8 md:tw-mx-auto md:tw-max-w-6xl md:tw-p-8">
        <script
          data-auto="schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'http://schema.org/',
              '@type': 'BreadcrumbList',
              itemListElement: breadcrumbs.map(({ href, label }, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                item: { name: label, '@id': href },
              })),
            }),
          }}
        />
        <nav aria-label="Breadcrumbs" class="tw-mb-4 tw-flex tw-flex-wrap tw-items-center tw-gap-2.5 sm:tw-mb-8">
          {breadcrumbs.map(({ href, label }, i, l) => {
            const isLast = i === l.length - 1
            return (
              <>
                {href ? (
                  <a href={href} class="bc-item ![color:--color_1]">
                    <div class="">{label}</div>
                  </a>
                ) : (
                  <div class="" data-auto="bc-unlinkable-item">
                    {label}
                  </div>
                )}
                {!isLast && <Chevron />}
              </>
            )
          })}
        </nav>
        <div
          className={`tw-mb-8 tw-flex ${
            pageData.logo ? 'tw-flex-col' : 'tw-flex-col-reverse'
          } tw-gap-6 md:tw-flex-row lg:tw-gap-12`}
        >
          <div className="tw-flex tw-w-full md:tw-max-w-1/2 md:tw-flex-col">
            {pageData.logo && (
              <OptimizedImage
                optimizedWidth={300}
                className="tw-mb-6 tw-aspect-auto tw-max-w-3/4 tw-shrink tw-self-start md:tw-w-full md:tw-max-w-full"
                src={pageData.logo}
                alt={pageData.business_name}
              />
            )}
            <div
              className={`${
                pageData.logo ? 'tw-hidden' : 'tw-mx-auto tw-flex'
              } tw-shrink tw-flex-col tw-items-center md:tw-flex`}
            >
              {pageData.island === 'oahu' && (
                <a className="tw-self-center" href={islandLinks[pageData.island]}>
                  <Oahu
                    className="tw-w-full tw-max-w-48 tw-scale-[2] tw-text-green-200 [--island-highlight-color:theme(colors.yellow.400)]"
                    strokeWidth={200}
                  />
                </a>
              )}
              {pageData.island === 'maui' && (
                <a className="tw-self-center" href={islandLinks[pageData.island]}>
                  <Maui
                    className="tw-w-full tw-max-w-48 tw-scale-125 tw-text-green-200 [--island-highlight-color:theme(colors.pink.500)]"
                    strokeWidth={200}
                  />
                </a>
              )}
              {pageData.island === 'kauai' && (
                <a className="tw-self-center" href={islandLinks[pageData.island]}>
                  <Kauai
                    className="tw-w-full tw-max-w-48 tw-scale-150 tw-text-green-200 [--island-highlight-color:theme(colors.fuchsia.500)]"
                    strokeWidth={200}
                  />
                </a>
              )}
              {pageData.island === 'hawaii' && (
                <a className="tw-self-center" href={islandLinks[pageData.island]}>
                  <BigIsland
                    className="tw-w-full tw-max-w-48 tw-text-green-200 [--island-highlight-color:theme(colors.red.500)]"
                    strokeWidth={200}
                  />
                </a>
              )}
              {islands.length > 1 && (
                <HawaiianIslands
                  className={`tw-max-w-48 tw-self-center tw-text-green-200 ${islands
                    .map((isle) => islandClasses[isle].islandHighlight)
                    .filter(Boolean)
                    .join(' ')}`}
                  strokeWidth={200}
                />
              )}
              {islands.length > 1 ? (
                <div
                  className={`tw-grid tw-w-full tw-grid-cols-4 ${imageSpacing[islands.length]} ${
                    islands.includes('hawaii') ? '-tw-translate-x-[3%]' : ''
                  }`}
                >
                  {islandsInOrder.map(
                    (isle, _, arr) =>
                      islands.includes(isle) && (
                        <a href={islandLinks[isle]} class={`tw-h-full ${aspectRatio[isle]}`}>
                          <img className={`${aspectRatio[isle]} tw-h-full`} src={islandLogos[isle]} />
                        </a>
                      ),
                  )}
                </div>
              ) : (
                <a href={islandLinks[pageData.island]}>
                  <img className="tw-self-center" src={islandLogos[pageData.island]} />
                </a>
              )}
            </div>
          </div>
          <div className="tw-relative tw-grow tw-pt-2">
            {pageData.this_week_recommended && (
              <div className="tw-absolute -tw-top-10 tw-right-0 tw-flex tw-rotate-12 tw-flex-col tw-items-center tw-text-[9px] tw-font-bold tw-leading-[1] tw-text-red-500">
                <img
                  src="https://lirp.cdn-website.com/0e650340/dms3rep/multi/opt/twhawaii-logo-300w.png"
                  className="tw-w-12"
                />
                Recommended!
              </div>
            )}
            {pageData.rich_description && (
              <p
                className="tw-prose tw-mb-6 [&_a]:tw-underline visited:[&_a]:tw-text-purple-400 hover:[&_a]:tw-text-blue-400 focus:[&_a]:tw-text-blue-400"
                dangerouslySetInnerHTML={{ __html: pageData.rich_description }}
              />
            )}
            {!pageData.rich_description && pageData.description && (
              <p className="tw-mb-6">
                {pageData.description.split('\n').map((text, i) => (
                  <Fragment key={i}>
                    {i !== 0 && <br />}
                    {text}
                  </Fragment>
                ))}
              </p>
            )}
            {pageData.action_shot1 && (
              <OptimizedImage
                optimizedWidth={640}
                className="tw-mx-auto tw-rounded-md"
                src={pageData.action_shot1}
                alt={`${pageData.business_name} Action Shot`}
              />
            )}
          </div>
        </div>
        {!!pageData.booking_links?.length && <BookingLinks links={pageData.booking_links} className="tw-mb-8" />}
        {!!pageData.videos.length && pageData.tier !== 'basic' && (
          <VideoList
            videos={pageData.videos.slice(0, videoMax)}
            className="tw-mx-auto tw-mb-8 tw-w-fit tw-max-w-full"
          />
        )}
        {!!pageData.images?.length && <PhotoGallery images={pageData.images.slice(0, imagesMax)} className="tw-mb-8" />}
        <CategoryList className="tw-mb-8" size="lg" categories={categories} island={islands[0]} />
        <div className="tw-mb-4">
          <BusinessHours className="tw-mb-8" businessHours={pageData.business_hours} />
          <h3>Contact Us</h3>
          {socialKeys.length > 0 && pageData.tier === 'premium' && (
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
                {pageData.tier !== 'basic' ? (
                  <a
                    className="hover:tw-text-blue-400 hover:tw-underline focus:tw-text-blue-400 focus:tw-underline focus:tw-outline-none"
                    href={`mailto:${pageData.primary_email}`}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {pageData.primary_email}
                  </a>
                ) : (
                  pageData.primary_email
                )}
              </em>
            </p>
          )}
          {pageData.primary_phone && (
            <p>
              Phone:{' '}
              <em>
                {pageData.tier !== 'basic' ? (
                  <a
                    className="hover:tw-text-blue-400 hover:tw-underline focus:tw-text-blue-400 focus:tw-underline focus:tw-outline-none"
                    href={`tel:${pageData.primary_phone}`}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {pageData.primary_phone}
                  </a>
                ) : (
                  pageData.primary_phone
                )}
              </em>
            </p>
          )}
          {pageData.primary_web_url && (
            <p>
              Online:{' '}
              <em>
                {pageData.tier !== 'basic' ? (
                  <a
                    className="hover:tw-text-blue-400 hover:tw-underline focus:tw-text-blue-400 focus:tw-underline focus:tw-outline-none"
                    href={ensureHttpsUrl(pageData.primary_web_url)}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {pageData.primary_web_url}
                  </a>
                ) : (
                  pageData.primary_web_url
                )}
              </em>
            </p>
          )}
          {pageData.primary_address && (
            <p>
              In Person: <em>{pageData.primary_address}</em>
            </p>
          )}
        </div>
        {(pageData.primary_address || pageData.lat_lng) && <div className="main-listing-mapbox-map tw-relative"></div>}
      </section>
    </div>
  )
}

const mediaMaxes = (tier: Listing['tier']) => {
  switch (tier) {
    case 'basic':
      return {
        images: 3,
        videos: 0,
      }
    case 'standard':
      return {
        images: 10,
        videos: 1,
      }
    case 'premium':
      return {
        images: Infinity,
        videos: Infinity,
      }
  }
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

const Chevron = () => {
  return (
    <span aria-hidden="true">
      <svg data-auto="arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M5.46967 3.46967C5.76256 3.17678 6.23744 3.17678 6.53033 3.46967L10.5303 7.46967C10.8232 7.76256 10.8232 8.23744 10.5303 8.53033L6.53033 12.5303C6.23744 12.8232 5.76256 12.8232 5.46967 12.5303C5.17678 12.2374 5.17678 11.7626 5.46967 11.4697L8.93934 8L5.46967 4.53033C5.17678 4.23744 5.17678 3.76256 5.46967 3.46967Z"
          fill="currentColor"
        />
      </svg>
    </span>
  )
}
