import { render } from 'preact'
import { DudaProvider } from './DudaContext'
import { DudaContextValue } from './@types/duda'
import { FeaturedListings } from './components/FeaturedListings'

let root: any
export async function init({ container, props }: { container: Element; props: DudaContextValue }) {
  root = container
  if (container) {
    render(
      <DudaProvider value={props}>
        <FeaturedListings />
      </DudaProvider>,
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
  window.dmAPI.registerExternalWidget('featuredListings', { init, clean })
}
