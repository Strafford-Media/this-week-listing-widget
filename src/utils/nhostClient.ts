import { createClient, NhostClientOptions } from '@nhost/nhost-js'
import { CookieStorage } from '@nhost/nhost-js/session'
import { isDevSimulation, isProdSimulation } from './environment'

const authOptions: NhostClientOptions =
  isDevSimulation && !isProdSimulation
    ? {
        subdomain: 'local',
        region: 'local',
        storage: new CookieStorage(),
      }
    : {
        authUrl: 'https://identity.thisweekhawaii.com/v1',
        storageUrl: 'https://hboobcwwuscftftwhuse.storage.us-east-1.nhost.run/v1',
        graphqlUrl: 'https://graphql.thisweekhawaii.com/v1/graphql',
        functionsUrl: 'https://functions.thisweekhawaii.com/v1',
        storage: new CookieStorage(),
      }

export const getNhostClient = () => {
  if (!window.nhost) {
    window.nhost = createClient(authOptions)

    const url = new URL(window.location.href)
    const refreshToken = url.searchParams.get('refreshToken')

    if (url.searchParams.get('type') === 'passwordReset' && typeof refreshToken === 'string') {
      window.nhost.auth.refreshToken({ refreshToken })

      url.searchParams.delete('refreshToken')
      url.searchParams.delete('type')

      window.history.pushState(null, '', url.toString())
    }
  }

  return window.nhost
}
