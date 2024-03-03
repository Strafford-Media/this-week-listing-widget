import { ComponentProps } from 'preact'
import { DudaContextValue } from '../@types/duda'
import { VideoPlayer } from './VideoPlayer'

export interface VideoListProps extends ComponentProps<'div'> {
  videos: NonNullable<DudaContextValue['pageData']>['videos']
}

export const VideoList = ({ className = '', videos, ...props }: VideoListProps) => {
  if (!videos.length) return null

  return (
    <div
      className={`${className} tw-flex tw-snap-x tw-snap-mandatory tw-gap-6 tw-overflow-x-auto tw-scroll-smooth`}
      {...props}
    >
      {videos.map((v) => (
        <VideoPlayer key={v.id} video={v} />
      ))}
    </div>
  )
}
