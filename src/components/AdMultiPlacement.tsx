import { useAds } from '../hooks/useAds'
import { ComponentProps } from 'preact'
import { env, isDevSimulation, isProdSimulation } from '../utils/environment'
import { AdDisplay } from './AdDisplay'

export interface AdMultiPlacementProps extends Omit<ComponentProps<'div'>, 'size' | 'loading'> {
  size: string
  placement_identifier?: string
  max: number
}

const isLive = env === 'live' || (env !== 'editor' && (isDevSimulation || isProdSimulation))

export const AdMultiPlacement = ({
  className = '',
  style = '',
  placement_identifier,
  size,
  onClick,
  max,
  ...props
}: AdMultiPlacementProps) => {
  const { ads, loading } = useAds(size, max)

  if (!ads?.length && !loading && isLive) return null

  return (
    <div
      className={`tw-flex tw-items-center ${
        ads.length > 2 ? 'tw-justify-between' : ads.length === 1 ? 'tw-justify-evenly' : 'tw-justify-center'
      }`}
    >
      {ads.map((ad, index) => (
        <AdDisplay ad={ad} size={size} placement_identifier={`${placement_identifier}-${index}`} {...props} />
      ))}
    </div>
  )
}
