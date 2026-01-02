import React, { ComponentProps } from 'preact'

export interface PromoCodesProps extends ComponentProps<'div'> {
  visitorHook?: string
}

export const PromoCodes = ({ className = '', visitorHook = '', ...props }: PromoCodesProps) => {
  return (
    <div
      className={`${className} tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-1 tw-rounded tw-border-2 tw-border-red-500 tw-p-2 md:tw-flex-row md:tw-justify-start`}
      {...props}
    >
      <div class="tw-text-center md:tw-text-left">
        <p class="tw-mb-0.5 tw-flex tw-min-w-0 tw-flex-wrap tw-justify-center tw-gap-x-2 tw-text-lg/5 tw-font-bold md:tw-justify-start md:tw-text-2xl/7">
          Special Subscriber Savings{visitorHook && ': '}
          <span class="tw-text-red-500">{visitorHook}</span>
          <span className="h-0 basis-full"></span>
        </p>
        <p class="tw-text-[11px]/none tw-text-gray-600">Subscribe for FREE to receive these special savings.</p>
      </div>
      <button class="tw-flex tw-shrink-0 tw-items-center tw-justify-center tw-whitespace-nowrap tw-rounded tw-bg-red-500 tw-px-2 tw-py-2 tw-text-sm tw-font-bold tw-text-white md:tw-ml-auto">
        LOGIN / SUBSCRIBE
      </button>
    </div>
  )
}
