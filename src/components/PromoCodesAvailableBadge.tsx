import React, { ComponentProps } from 'preact'

export interface PromoCodesAvailableBadgeProps extends ComponentProps<'span'> {}

export const PromoCodesAvailableBadge = ({ className = '', ...props }: PromoCodesAvailableBadgeProps) => {
  return (
    <span
      className={`${className} tw-flex tw-w-44 tw-items-center tw-justify-center tw-rounded tw-bg-red-500 tw-py-1 tw-text-sm tw-font-bold tw-text-white`}
      {...props}
    >
      SAVINGS AVAILABLE
    </span>
  )
}
