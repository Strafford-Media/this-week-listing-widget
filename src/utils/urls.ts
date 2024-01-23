import { isDevSimulation, env, siteID, deviceType } from './environment'

let functionsUrl = ''
let hasuraUrl = ''

export const setUrls = () => {
  if (isDevSimulation) {
    hasuraUrl = 'https://local.hasura.nhost.run/v1/graphql'
    functionsUrl = 'https://local.functions.nhost.run/v1'
  } else {
    hasuraUrl = 'https://hboobcwwuscftftwhuse.hasura.us-east-1.nhost.run/v1/graphql'
    functionsUrl = 'https://hboobcwwuscftftwhuse.functions.us-east-1.nhost.run/v1'
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

export const getCategoryHref = (category: string, island: string) => {
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
