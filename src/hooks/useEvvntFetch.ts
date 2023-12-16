import { useEffect, useState } from 'preact/hooks'

export const useEvvntFetch = <Data = any>(url: string) => {
  const [data, setData] = useState<Data | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetch(url, {
      method: 'GET',
      mode: 'cors',
    })
      .then((r) => r.json())
      .then((d) => {
        setData(d)
        setError(null)
      })
      .catch((e) => {
        setData(null)
        setError(e)
      })
  }, [])

  return { data, error }
}
