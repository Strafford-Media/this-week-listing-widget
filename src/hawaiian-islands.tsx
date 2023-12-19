import { render } from 'preact'
import { HawaiianIslandsToggler } from './components/HawaiianIslandToggler'
import { DudaContextValue } from './@types/duda'

let root
export async function init({ container, props }: { container: Element; props: DudaContextValue }) {
  if (container) {
    render(<HawaiianIslandsToggler />, container, container.firstChild as Element)
  }
}

export function clean() {
  if (root!) {
    root.unmount()
  }
}

if (process.env.NODE_ENV === 'development') {
  const root = document.getElementById('island-hero')!

  render(<HawaiianIslandsToggler />, root)
}
