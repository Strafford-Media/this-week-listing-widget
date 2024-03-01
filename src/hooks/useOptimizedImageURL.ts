import { useEffect, useState } from 'preact/hooks'
import { optimizeDudaImg } from '../utils/urls'
import { JSXInternal } from 'preact/src/jsx'

export const useOptimizedImageURL = (
  original: string | JSXInternal.SignalLike<string | undefined>,
  width = 300,
  placeholder = '',
) => {
  const [optimizedImg, setOptimizedImg] = useState(() => optimizeDudaImg(original, width) ?? placeholder)

  useEffect(() => {
    if (optimizedImg !== placeholder) {
      const img = new Image()
      img.onerror = () => setOptimizedImg(optimizedImg !== original ? original : placeholder)
      img.src = optimizedImg
    }
  }, [optimizedImg, original])

  return optimizedImg
}
