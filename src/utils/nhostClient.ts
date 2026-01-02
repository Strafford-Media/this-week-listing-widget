import { createClient, NhostClientOptions } from '@nhost/nhost-js'
// import { CookieStorage } from '@nhost/nhost-js/session'

const authOptions: NhostClientOptions =
  process.env.NODE_ENV === 'development'
    ? {
        subdomain: 'local',
        region: 'local',
        // storage: new CookieStorage(),
      }
    : {
        subdomain: 'hboobcwwuscftftwhuse',
        region: 'us-east-1',
        // storage: new CookieStorage(),
      }

export const getNhostClient = () => {
  if (!window.nhost) {
    window.nhost = createClient(authOptions)
  }

  return window.nhost
}
