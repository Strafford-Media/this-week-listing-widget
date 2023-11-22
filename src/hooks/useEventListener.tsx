import { useEffect, useRef } from 'preact/hooks'

export const useEventListener = <EventType extends keyof WindowEventMap>(
  event: EventType,
  callback: (e: WindowEventMap[EventType]) => void,
) => {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    const listener = (e: WindowEventMap[EventType]) => callbackRef.current(e)

    window.addEventListener(event, listener)

    return () => {
      window.removeEventListener(event, listener)
    }
  }, [event])
}
