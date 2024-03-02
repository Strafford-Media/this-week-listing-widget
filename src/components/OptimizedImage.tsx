import { useOptimizedImageURL } from 'hooks/useOptimizedImageURL'
import { ComponentProps } from 'preact'

export interface OptimizedImageProps extends ComponentProps<'img'> {
  placeholderImageSrc?: string
  optimizedWidth: number
}

export const OptimizedImage = ({
  className = '',
  placeholderImageSrc = '',
  optimizedWidth,
  src,
  ...props
}: OptimizedImageProps) => {
  const { optimizedImg } = useOptimizedImageURL(src ?? '', optimizedWidth, placeholderImageSrc)

  return <img className={`${className}`} src={optimizedImg} {...props} />
}
