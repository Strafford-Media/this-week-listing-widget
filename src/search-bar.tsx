import { render } from 'preact'
import { DudaProvider } from './DudaContext'
import { DudaContextValue } from './@types/duda'
import { SearchBar } from './components/SearchBar'

let root: any
export async function init({ container, props }: { container: Element; props: DudaContextValue }) {
  if (container) {
    const maxWidth =
      props.siteDetails.config.setMaxWidth && props.siteDetails.config.maxWidth
        ? `${props.siteDetails.config.maxWidth}px`
        : undefined

    const bgImage =
      !props.siteDetails.config?.dropdownBGImage || props.siteDetails.config.dropdownBGImage === '&quot;&quot;'
        ? 'https://lirp.cdn-website.com/0e650340/dms3rep/multi/opt/aerial_water_3-640w.jpeg'
        : props.siteDetails.config.dropdownBGImage

    render(
      <DudaProvider value={props}>
        <SearchBar
          className="tw-relative tw-z-10 tw-mx-auto"
          style={{ maxWidth }}
          size={props.siteDetails.config.size || 'md'}
          dropdownBGImage={bgImage}
          closeable={props.siteDetails.config.closeable}
        />
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
  window.dmAPI.registerExternalWidget('searchBar', { init, clean })
}
