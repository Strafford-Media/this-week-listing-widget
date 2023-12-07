import { useEffect, useState } from 'preact/hooks'
import { getFunctionsUrl } from '../utils/urls'
import { env } from '../utils/environment'

const isProd = env === 'live'

export const useAd = (size: string) => {
  const [ad, setAd] = useState<{ id: number; image: string; link: string; name: string } | null>(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isProd) return

    const functionsUrl = getFunctionsUrl()

    fetch(`${functionsUrl}/ad?size=${size}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.success) {
          setAd(j.ad)
        } else {
          setError(j.message)
        }
      })
      .catch((e) => {
        setError(e?.message ?? e ?? 'Ad not found')
      })
  }, [size])

  return { ad, error }
}
