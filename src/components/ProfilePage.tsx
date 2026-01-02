import React, { ComponentProps } from 'preact'
import { Registration } from './Registration'

export interface ProfilePageProps extends ComponentProps<'div'> {}

export const ProfilePage = ({ className = '', ...props }: ProfilePageProps) => {
  return (
    <div className={`${className}`} {...props}>
      <Registration />
    </div>
  )
}
