import { useEffect, useRef } from 'preact/hooks'

// Thanks, Dan Abramov. https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export function useInterval(callback: () => any, delay: number) {
  const savedCallback = useRef(callback)
  savedCallback.current = callback

  useEffect(() => {
    function tick() {
      savedCallback.current()
    }

    if (delay) {
      const id = setInterval(tick, delay)

      return () => clearInterval(id)
    }
  }, [delay])
}
