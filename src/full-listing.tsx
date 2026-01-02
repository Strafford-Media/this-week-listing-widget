import { render } from 'preact'
import { DudaContextValue } from './@types/duda'
import { FullListing } from './components/FullListing'
import { DudaProvider } from './DudaContext'

let root: any
export async function init({ container, props }: { container: Element; props: DudaContextValue }) {
  if (container) {
    if (typeof window.dmAPI === 'undefined') {
      return console.error('no dmAPI object available to bootstrap widget content')
    }

    const dp = window.dmAPI.dynamicPageApi()

    if (!dp.isDynamicPage()) return console.error('not on a dynamic page')

    props.pageData = await dp.pageData()

    render(
      <DudaProvider value={props}>
        <FullListing />
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
  window.dmAPI.registerExternalWidget('fullListing', { init, clean })
}
