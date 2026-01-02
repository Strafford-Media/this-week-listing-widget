import { render } from 'preact'
import { DudaContextValue } from './@types/duda'
import { DudaProvider } from './DudaContext'
import { ProfilePage } from './components/ProfilePage'

let root: any
export async function init({ container, props }: { container: Element; props: DudaContextValue }) {
  if (container) {
    root = render(
      <DudaProvider value={props}>
        <ProfilePage />
      </DudaProvider>,
      container,
      container.firstChild as Element,
    )
  }
}

export function clean() {
  if (root) {
    root.unmount?.()
  }
}

if (window.dmAPI) {
  window.dmAPI.registerExternalWidget('profilePage', { init, clean })
}
