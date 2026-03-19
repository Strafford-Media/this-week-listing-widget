import { useEffect, useState } from 'preact/hooks'
import { getNhostClient } from '../utils/nhostClient'

export const useGraphQLResponse = <T = any>({
  query,
  variables,
  skip = false,
}: {
  query: string
  variables?: any
  skip?: boolean
}) => {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [refreshState, setRefreshState] = useState(0)

  useEffect(() => {
    if (skip) {
      setData(null)
      setError(null)
      setLoading(false)
      return
    }

    !(async () => {
      const nhost = getNhostClient()

      if (!nhost) {
        setError('Disconnected from server')
        return
      }

      setLoading(true)
      const res = await nhost.graphql
        .request<T>({
          query,
          variables,
        })
        .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

      setLoading(false)

      if (res instanceof Error) {
        setError(res)
        return console.error('bummer', res)
      }

      if (!res.body?.data) {
        setError('Not found')
        return
      }

      setData(res.body.data)
    })()
  }, [refreshState, skip])

  return { data, error, loading, refresh: () => setRefreshState((r) => r + 1) }
}
