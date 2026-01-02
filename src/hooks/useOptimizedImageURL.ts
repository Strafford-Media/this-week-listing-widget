import { useEffect, useState } from 'preact/hooks'
import { optimizeDudaImg } from '../utils/urls'
import { Signalish } from 'preact'

export const useOptimizedImageURL = (
  original: string | Signalish<string | undefined>,
  width = 300,
  placeholder = '',
) => {
  const [optimizedImg, setOptimizedImg] = useState(() => optimizeDudaImg(original, width) ?? placeholder)

  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (optimizedImg !== placeholder) {
      const img = new Image()
      img.onerror = () => setOptimizedImg(optimizedImg !== original ? original : placeholder)
      img.onload = () => setLoaded(true)
      img.src = optimizedImg
    }
  }, [optimizedImg, original])

  return { optimizedImg, loaded }
}
