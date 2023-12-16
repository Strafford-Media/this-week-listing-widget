import { isDevSimulation } from './environment'

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
