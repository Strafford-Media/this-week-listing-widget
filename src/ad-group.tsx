import { render } from 'preact'
import { DudaContextValue } from './@types/duda'
import { AdMultiPlacement } from 'components/AdMultiPlacement'

let root
export async function init({ container, props }: { container: Element; props: DudaContextValue }) {
  if (container) {
    const size = props?.siteDetails?.config?.size
    const max = Number(props?.siteDetails?.config?.max ?? 0)

    if (!size) return console.error('no size specified')
    if (isNaN(max)) return console.error('max must be a number')

    render(
      <AdMultiPlacement max={max} size={size} placement_identifier={props.siteDetails.config.placement_identifier} />,
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

  render(<AdMultiPlacement max={3} size="300x250" />, root)
}
