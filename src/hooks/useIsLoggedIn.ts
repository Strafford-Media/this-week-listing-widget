import { getNhostClient } from '../utils/nhostClient'

const nhost = getNhostClient()

export const useIsLoggedIn = () => {
  console.log(nhost.auth)

  return { isLoading: false, loggedIn: false }
}
