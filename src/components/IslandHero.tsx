import { ComponentProps } from 'preact'
import { HawaiianIslands } from './Hawaii'

export interface IslandHeroProps extends ComponentProps<'div'> {
  heroBGImage: string
}

export const IslandHero = ({ className = '', heroBGImage, ...props }: IslandHeroProps) => {
  return (
    <div className={`${className}`} style={`background-image: url(${heroBGImage});${props.style}`} {...props}>
      <HawaiianIslands />
    </div>
  )
}
