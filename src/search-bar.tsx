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

    render(
      <DudaProvider value={props}>
        <SearchBar className="tw-mx-auto" style={{ maxWidth }} size={props.siteDetails.config.size || 'md'} />
      </DudaProvider>,
      container
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
      <SearchBar />
    </DudaProvider>,
    root
  )
}
