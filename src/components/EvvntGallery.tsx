import { useEvvnts } from 'hooks/useEvvnts'
import { ComponentProps } from 'preact'

export interface EvvntGalleryProps extends ComponentProps<'div'> {
  publisherId: number | string
}

export const EvvntGallery = ({ className = '', publisherId, ...props }: EvvntGalleryProps) => {
  const { data, error } = useEvvnts(publisherId)

  console.log(data, error)
  return (
    <div className={`${className}`} {...props}>
      Evvnts
    </div>
  )
}
