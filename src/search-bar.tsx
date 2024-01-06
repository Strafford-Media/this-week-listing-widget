import { render } from 'preact'
import { DudaProvider } from './DudaContext'
import { DudaContextValue } from './@types/duda'
import { SearchBar } from './components/SearchBar'

let root
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
          className="tw-mx-auto"
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
  if (root!) {
    root.unmount()
  }
}

if (process.env.NODE_ENV === 'development') {
  const root = document.getElementById('search-bar')!

  render(
    <DudaProvider
      value={{
        siteDetails: {
          device: 'desktop',
          page: 'home',
          inEditor: true,
          accountId: '29a2c5ba8b6949a0bf32212853cc4ac5',
          siteId: '948efe8a',
          widgetId: 'a9486149096146debe5387df3e73b6f8',
          widgetVersion: '-1',
          elementId: '1789939675',
          config: {},
          locale: 'en',
        },
      }}
    >
      <SearchBar dropdownBGImage="https://irp.cdn-website.com/0e650340/dms3rep/multi/water-bg.png" />
    </DudaProvider>,
    root,
  )
}
