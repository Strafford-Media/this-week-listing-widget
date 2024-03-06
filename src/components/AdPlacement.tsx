import { useAd } from '../hooks/useAd'
import { ComponentProps } from 'preact'
import { env, isDevSimulation, isProdSimulation } from '../utils/environment'
import { useRef } from 'preact/hooks'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import { registerEvent } from '../utils/ad_events'

interface AdEventsCatchAll {
  successfulLoad?: boolean
  recordedViewEvent?: boolean
  recordedClickEvent?: boolean
  visibilityTimeout?: number
}

export interface AdPlacementProps extends Omit<ComponentProps<'div'>, 'size'> {
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
  const adEvents = useRef<AdEventsCatchAll>({})

  const { ad, loading } = useAd(size)

  const [width, height] = size.split('x')

  const [, setDomnode] = useIntersectionObserver(
    (isVisible) => {
      if (isVisible) {
        adEvents.current.visibilityTimeout = window.setTimeout(() => {
          if (!adEvents.current.recordedViewEvent && adEvents.current.successfulLoad) {
            registerEvent({ event: 'view', ad, placement_identifier })
            adEvents.current.recordedViewEvent = true
          }
        }, 1000)
      } else {
        window.clearTimeout(adEvents.current.visibilityTimeout)
      }
    },
    { threshold: 0.5 },
  )

  if (!ad && !loading && isLive) return null

  return (
    <div
      ref={setDomnode}
      className={`${className} tw-m-auto tw-flex tw-cursor-pointer tw-items-center tw-justify-center tw-overflow-hidden`}
      style={`${style};width:${width}px;height:${height}px;${isLive ? '' : 'border:1px solid black;'}`}
      onClick={(e) => {
        if (!adEvents.current.recordedClickEvent) {
          registerEvent({ event: 'click', ad, placement_identifier })
          adEvents.current.recordedClickEvent = true

          if (!adEvents.current.recordedViewEvent) {
            adEvents.current.recordedViewEvent = true
            registerEvent({ event: 'view', ad, placement_identifier })
          }
        }

        if (ad?.link) {
          window.open(ad.link, '_blank', 'noreferrer,noopener')
        }

        onClick?.(e)
      }}
      {...props}
    >
      {isLive ? (
        loading ? null : (
          <img
            src={ad?.image}
            alt={ad?.name}
            className="tw-aspect-auto"
            onLoad={() => (adEvents.current.successfulLoad = true)}
            onError={() => (adEvents.current.successfulLoad = false)}
          />
        )
      ) : (
        <p>
          {width} x {height} Ad Placement
        </p>
      )}
    </div>
  )
}
