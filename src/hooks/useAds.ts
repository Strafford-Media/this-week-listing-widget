import { useEffect, useState } from 'preact/hooks'
import { getFunctionsUrl } from '../utils/urls'
import { env, isDevSimulation, isProdSimulation } from '../utils/environment'
import { Ad } from '../@types/thisweek'

const shouldLoad = env === 'live' || isDevSimulation || isProdSimulation

export const useAds = (size: string, max: number) => {
  const [ads, setAds] = useState<Ad[]>([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!shouldLoad) return

    setLoading(true)

    const functionsUrl = getFunctionsUrl()

    fetch(`${functionsUrl}/ads?size=${size}&max=${max}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.success) {
          setAds(j.ads)
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

  return { ads, error, loading }
}
