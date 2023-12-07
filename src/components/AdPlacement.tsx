import { useAd } from '../hooks/useAd'
import { ComponentProps } from 'preact'
import { env } from '../utils/environment'

const isProd = env === 'live'

export interface AdPlacementProps extends Omit<ComponentProps<'div'>, 'size'> {
  size: string
}

export const AdPlacement = ({ className = '', size, ...props }: AdPlacementProps) => {
  const { ad } = useAd(size)

  const [width, height] = size.split('x')

  if (!ad && isProd) return null

  return (
    <div
      className={`${className} tw-m-auto tw-flex tw-items-center tw-justify-center tw-overflow-hidden`}
      style={`width: ${width}px; height: ${height}px; ${isProd ? '' : 'border: 1px solid black;'}`}
      {...props}
    >
      {isProd ? (
        <img src={ad?.image} alt={ad?.name} className="tw-aspect-auto" />
      ) : (
        <p>
          {width} x {height} Ad Placement
        </p>
      )}
    </div>
  )
}
