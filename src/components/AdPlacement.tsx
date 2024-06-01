import { useAd } from '../hooks/useAd'
import { ComponentProps } from 'preact'
import { env, isDevSimulation, isProdSimulation } from '../utils/environment'
import { AdDisplay } from './AdDisplay'

export interface AdPlacementProps extends Omit<ComponentProps<'div'>, 'size' | 'loading'> {
  size: string
  placement_identifier?: string
}

const isLive = env === 'live' || (env !== 'editor' && (isDevSimulation || isProdSimulation))

export const AdPlacement = ({
  className = '',
  style = '',
  placement_identifier,
  size,
  onClick,
  ...props
}: AdPlacementProps) => {
  const { ad, loading } = useAd(size)

  if (!ad && !loading && isLive) return null

  return <AdDisplay ad={ad} size={size} placement_identifier={placement_identifier} {...props} />
}
