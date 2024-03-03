import { useRef } from 'preact/hooks'

export const useDebouncedCallback = <T extends (...args: any[]) => any>(callback: T, ms: number) => {
  const timerRef = useRef<number>()
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  if (!ms) return

  return (...args: Parameters<T>) => {
    window.clearTimeout(timerRef.current)

    timerRef.current = window.setTimeout(() => callbackRef.current?.(...args), ms)
  }
}
