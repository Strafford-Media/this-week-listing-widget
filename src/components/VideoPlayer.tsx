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
  const id = video.url.split('/').pop()
  const src = `${sources[video.type]}${id}`

  if (!sources[video.type] || !id) {
    console.error('bad video data:', video)
    return null
  }

  return (
    <div className={`${className}`} {...props}>
      <iframe src={src} frameBorder={0} allowFullScreen />
    </div>
  )
}
