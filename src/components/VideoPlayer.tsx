import { DudaContextValue } from '../@types/duda'
import React, { ComponentProps } from 'preact'

const sources = {
  youtube: 'https://youtube.com/embed/',
  vimeo: 'https://player.vimeo.com/video/',
  dailymotion: 'https://www.dailymotion.com/embed/video/',
}

export interface VideoPlayerProps extends ComponentProps<'div'> {
  video: NonNullable<DudaContextValue['pageData']>['videos'][number]
}

export const VideoPlayer = ({ className = '', video, ...props }: VideoPlayerProps) => {
  const { id, type } = video

  if (!sources[video.type] || !id) {
    console.error('bad video data:', video)
    return null
  }

  return (
    <div className={`${className} tw-flex tw-justify-center`} {...props}>
      <iframe
        key={id}
        width="560"
        height="315"
        src={`${sources[type]}${id}`}
        title={`${type} video player`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  )
}
