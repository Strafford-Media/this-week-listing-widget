import { ComponentProps } from 'preact'
import { HawaiianIslands } from './Hawaii'

export interface HawaiianIslandsTogglerProps extends ComponentProps<'div'> {}

export const HawaiianIslandsToggler = ({ className = '', ...props }: HawaiianIslandsTogglerProps) => {
  return (
    <div className={`${className}`} {...props}>
      <HawaiianIslands />
    </div>
  )
}
