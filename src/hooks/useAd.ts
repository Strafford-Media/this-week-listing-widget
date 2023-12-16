import { useEffect, useState } from 'preact/hooks'
import { getFunctionsUrl } from '../utils/urls'
import { env, isDevSimulation } from '../utils/environment'
import { Ad } from '../@types/thisweek'

const shouldLoad = env === 'live' || isDevSimulation

export const useAd = (size: string) => {
  const [ad, setAd] = useState<Ad | null>(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!shouldLoad) return

    setLoading(true)

    const functionsUrl = getFunctionsUrl()

    fetch(`${functionsUrl}/ad?size=${size}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.success) {
          setAd(j.ad)
        } else {
          setError(j.message)
        }
        setLoading(false)
      })
      .catch((e) => {
        setError(e?.message ?? e ?? 'Ad not found')
        setLoading(false)
      })
  }, [size])

  return { ad, error, loading }
}
