import React, { ComponentProps } from 'preact'

export interface IslandOriginalBadgeProps extends ComponentProps<'span'> {}

export const IslandOriginalBadge = ({ className = '', ...props }: IslandOriginalBadgeProps) => {
  return (
    <span
      className={`${className} tw-flex tw-items-center tw-justify-center tw-rounded tw-bg-yellow-300 tw-px-6 tw-py-1 tw-text-sm tw-font-bold`}
      {...props}
    >
      ISLAND ORIGINAL
    </span>
  )
}
