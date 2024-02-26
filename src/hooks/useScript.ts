import { useEffect, useRef } from 'preact/hooks'

export const useScript = <T extends HTMLElement = HTMLDivElement>(url: string, usePostscribe = true) => {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (usePostscribe) {
      ;(window as any).postscribe(ref.current || document.body, `<script src="${url}"></script>`)
    } else {
      const script = document.createElement('script')

      script.src = url

      const el = ref.current || document.body

      el.appendChild(script)

      return () => el.removeChild(script)
    }
  }, [url])

  return ref
}
