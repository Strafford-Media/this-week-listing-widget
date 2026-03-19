import React, { ComponentProps } from 'preact'

const variants = {
  cta: 'tw-border-red-500 tw-bg-red-500 tw-text-white tw-ring-red-300 hover:tw-opacity-90',
  subdued: 'tw-border-red-500 tw-bg-white tw-text-red-500 tw-ring-red-300 hover:tw-bg-red-50',
} as const

export interface ButtonProps extends ComponentProps<'button'> {
  variant?: keyof typeof variants
}

export const Button = ({ className = '', variant = 'cta', ...props }: ButtonProps) => {
  return (
    <button
      className={`${className} ${variants[variant]} tw-flex-center tw-min-h-10 tw-rounded tw-border tw-px-2 tw-ring-0 focus:tw-outline-none focus:tw-ring disabled:tw-opacity-60`}
      {...props}
    />
  )
}
