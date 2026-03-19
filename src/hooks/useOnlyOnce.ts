import { useEffect, useRef } from 'preact/hooks'

export const useOnlyOnce = (callback: () => any, condition = true) => {
  const hasRunOnce = useRef(false)
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (!hasRunOnce.current && condition) {
      callbackRef.current?.()
      hasRunOnce.current = true
    }
  }, [condition])
}
