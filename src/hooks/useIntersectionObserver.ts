import { useEffect, useRef, useState } from 'preact/hooks'

export const useIntersectionObserver = <T extends HTMLElement = HTMLDivElement>(
  cb: (isIntersecting: boolean, entry: IntersectionObserverEntry) => void,
  {
    root: rootSelector = null,
    threshold = 0.5,
    rootMargin,
  }: Omit<IntersectionObserverInit, 'root'> & { root?: string | null } = {},
) => {
  const [domNode, setDomNode] = useState<T | null>(null)
  const cbRef = useRef(cb)
  cbRef.current = cb

  useEffect(() => {
    const root = (rootSelector && document.querySelector(rootSelector)) || null

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          cbRef.current(entry.isIntersecting, entry)
        }
      },
      { root, threshold, rootMargin },
    )

    if (domNode) intersectionObserver.observe(domNode)

    return () => {
      intersectionObserver.disconnect()
    }
  }, [rootSelector, domNode])

  return [domNode, setDomNode] as const
}
