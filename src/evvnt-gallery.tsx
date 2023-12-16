import { render } from 'preact'
import { EvvntGallery } from './components/EvvntGallery'
import { DudaContextValue } from './@types/duda'

let root
export async function init({ container, props }: { container: Element; props: DudaContextValue }) {
  if (container) {
    const publisherId = props?.siteDetails?.config?.publisherId

    if (!publisherId) return console.error('no partnerId specified')

    render(<EvvntGallery publisherId={publisherId} />, container, container.firstChild as Element)
  }
}

export function clean() {
  if (root!) {
    root.unmount()
  }
}

if (process.env.NODE_ENV === 'development') {
  const root = document.getElementById('evvnt-gallery')!

  render(<EvvntGallery publisherId="7675" />, root)
}
