import { render } from 'preact'
import { AdPlacement } from './components/AdPlacement'
import { DudaContextValue } from './@types/duda'

let root: any
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
  if (root) {
    root.unmount()
  }
}

if (window.dmAPI) {
  window.dmAPI.registerExternalWidget('adPlacement', { init, clean })
}
