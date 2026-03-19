import { useIsLoggedIn } from '../hooks/useIsLoggedIn'
import { useGraphQLResponse } from '../hooks/useGraphQLResponse'
import React, { ComponentProps } from 'preact'
import { LoginButton } from './LoginButton'
import { Button } from './Button'
import { copyText } from '../utils/general'
import { useEffect, useState } from 'preact/hooks'

export interface PromoCodesProps extends ComponentProps<'div'> {
  visitorHook?: string
  listingId: number
}

export const PromoCodes = ({ className = '', visitorHook = '', listingId, ...props }: PromoCodesProps) => {
  const [copiedId, setCopiedId] = useState(0)

  const { loggedIn } = useIsLoggedIn()

  const { data } = useGraphQLResponse<{
    promo_code: { id: number; label: string; code: string; expiration: string | null }[]
  }>({
    query: `query promoCodesForListing ($listingId: Int!) {
      promo_code (where: { listing_id: { _eq: $listingId } }) {
        id
        label
        code
        expiration
      }
    }`,
    variables: { listingId },
    skip: !loggedIn || !listingId,
  })

  console.log(data)
  if (!loggedIn) {
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
        <LoginButton label="LOGIN / SUBSCRIBE" className="tw-shrink-0 tw-whitespace-nowrap md:tw-ml-auto" />
      </div>
    )
  }

  const promoCodes = data?.promo_code ?? []

  if (!promoCodes.length) return null

  return (
    <div class={`${className} tw-flex tw-flex-col`}>
      {promoCodes.map((p) => (
        <div
          className={`${className} tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-1 tw-rounded tw-border-2 tw-border-red-500 tw-p-2 md:tw-flex-row md:tw-justify-start`}
        >
          <div className=" tw-flex tw-min-w-0 tw-shrink tw-flex-wrap tw-justify-center tw-gap-x-2 tw-text-center tw-text-lg/5 tw-font-bold md:tw-justify-start md:tw-text-left md:tw-text-2xl/7">
            <span className="tw-whitespace-nowrap">Special Subscriber Savings:</span>
            <span className="tw-text-red-500">{p.label ?? ''}</span>
            <span className="tw-h-0 tw-basis-full"></span>
          </div>
          <Button
            className="tw-relative tw-whitespace-nowrap md:tw-ml-auto md:tw-text-xl"
            onClick={async () => {
              try {
                setCopiedId(0)
                await copyText(p.code)
                setCopiedId(p.id)
              } catch (error) {}
            }}
          >
            <span
              class={`tw-flex-center tw-absolute tw-inset-0 tw-text-sm tw-font-bold tw-text-green-500 tw-transition-all tw-ease-out ${
                copiedId === p.id
                  ? `tw-visible -tw-translate-y-16 tw-opacity-0 tw-duration-[4s]`
                  : 'tw-invisible tw-translate-y-0 tw-opacity-100 tw-duration-0'
              }`}
              style="text-shadow:0 0 2px #f0fdf4,0 0 4px #f0fdf4;"
            >
              Copied to clipboard!
            </span>
            <span>
              Promo Code: <span className="tw-select-text tw-font-bold">{p.code}</span>
            </span>
          </Button>
        </div>
      ))}
    </div>
  )
}
