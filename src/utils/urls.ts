import { Signalish } from 'preact'
import { isDevSimulation, env, siteID, deviceType, isProdSimulation } from './environment'

let functionsUrl = ''
let hasuraUrl = ''

export const setUrls = () => {
  if (isDevSimulation && !isProdSimulation) {
    hasuraUrl = 'https://local.hasura.nhost.run/v1/graphql'
    functionsUrl = 'https://local.functions.nhost.run/v1'
  } else {
    hasuraUrl = 'https://graphql.thisweekhawaii.com/v1/graphql'
    functionsUrl = 'https://functions.thisweekhawaii.com/v1'
  }
}

setUrls()

export const getHasuraUrl = () => hasuraUrl

export const getFunctionsUrl = () => functionsUrl

export const getListingHref = (listingUrl: string) => {
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

export const getCategoryHref = (category: string, island: string, isPrimary?: boolean) => {
  switch (env) {
    case 'preview':
      return `/site/${siteID}/explore${isPrimary ? `/${encodeURIComponent(category)}` : `?category=${category}`}${
        island ? `${isPrimary ? '?' : '&'}island=${island}` : ''
      }&preview=true&insitepreview=true&dm_device=${deviceType}`
    case 'editor':
      return `/site/${siteID}/explore${isPrimary ? `/${encodeURIComponent(category)}` : `?category=${category}`}${
        island ? `${isPrimary ? '?' : '&'}island=${island}` : ''
      }&preview=true&nee=true&showOriginal=true&dm_checkSync=1&dm_try_mode=true&dm_device=${deviceType}`
    case 'live':
    default:
      return `/explore${isPrimary ? `/${encodeURIComponent(category)}` : `?category=${category}`}${
        island ? `${isPrimary ? '?' : '&'}island=${island}` : ''
      }`
  }
}

export const getLinkPrefix = () => {
  switch (env) {
    case 'preview':
    case 'editor':
      return `/site/${siteID}`
    case 'live':
    default:
      return ''
  }
}

const imageEndPathRegex = /-[\d]{1,5}(w\.[a-z]{2,7})$/

export const optimizeDudaImg = (src: string | Signalish<string | undefined>, width?: number) => {
  if (!src || typeof src !== 'string') {
    return src
  }

  if (src.startsWith('https://irp.cdn-website.com')) {
    return window.dmAPI?.getOptimizedImageURL(src, width)
  }

  if (src.startsWith('https://lirp.cdn-website.com')) {
    return src.trim().replace(imageEndPathRegex, `-${width ?? 300}$1`)
  }

  return src
}

export const ensureHttpsUrl = (url: string) => {
  if (url.startsWith('http')) return url

  return `https://${url}`
}
