import { useEffect, useState } from 'preact/hooks'
import { getNhostClient } from '../utils/nhostClient'
import type { User } from '@nhost/nhost-js/auth'

export const useIsLoggedIn = () => {
  const nhost = getNhostClient()
  const [user, setUser] = useState<User | null>(nhost.sessionStorage.get()?.user ?? null)
  const [loggedIn, setLoggedIn] = useState(!!user)

  const refreshUser = async () => nhost.refreshSession(0)

  useEffect(() => {
    const unsub = nhost.sessionStorage.onChange((e) => {
      if (e?.user) {
        setLoggedIn(true)
        setUser(e.user)
      } else {
        setLoggedIn(false)
        setUser(null)
      }
    })

    return () => unsub()
  }, [nhost])

  return { loggedIn, user, refreshUser }
}
