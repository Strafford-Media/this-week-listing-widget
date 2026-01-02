import { render } from 'preact'
import { EvvntGallery } from './components/EvvntGallery'
import { DudaContextValue } from './@types/duda'
import { DudaProvider } from './DudaContext'

let root: any
export async function init({ container, props }: { container: Element; props: DudaContextValue }) {
  if (container) {
    render(
      <DudaProvider value={props}>
        <EvvntGallery />
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
  window.dmAPI.registerExternalWidget('evvntGallery', { init, clean })
}
