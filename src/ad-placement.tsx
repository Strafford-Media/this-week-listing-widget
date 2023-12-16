import { render } from 'preact'
import { AdPlacement } from './components/AdPlacement'
import { DudaContextValue } from './@types/duda'

let root
export async function init({ container, props }: { container: Element; props: DudaContextValue }) {
  if (container) {
    const size = props?.siteDetails?.config?.size

    if (!size) return console.error('no size specified')

    render(
      <AdPlacement size={size} placement_identifier={props.siteDetails.config.placement_identifier} />,
      container,
      container.firstChild as Element,
    )
  }
}

export function clean() {
  if (root!) {
    root.unmount()
  }
}

if (process.env.NODE_ENV === 'development') {
  const root = document.getElementById('ad-placement')!

  render(<AdPlacement size="300x250" />, root)
}
