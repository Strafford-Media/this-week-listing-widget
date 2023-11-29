import { useEventListener } from 'hooks/useEventListener'
import React, { ComponentProps } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'

export interface PhotoGalleryProps extends ComponentProps<'div'> {
  images: { url: string }[]
}

const enHance = true
const justPRINTthedamnthing = false

export const PhotoGallery = ({ className = '', images, ...props }: PhotoGalleryProps) => {
  const listRef = useRef<HTMLUListElement>(null)
  const [enhance, enhanceEnhance] = useState(justPRINTthedamnthing)

  useEventListener('keydown', (e) => {
    if (enhance && listRef.current) {
      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault()
          return (listRef.current.scrollLeft += window.innerWidth)
        case 'ArrowLeft':
          e.preventDefault()
          return (listRef.current.scrollLeft -= window.innerWidth)
        case 'Escape':
          return enhanceEnhance(justPRINTthedamnthing)
        default:
          return
      }
    }

    if (!enhance && listRef.current === document.activeElement && e.key === 'Enter') {
      enhanceEnhance(enHance)
    }
  })

  return (
    <div className={`${className} tw-max-h-[60vh]`} {...props}>
      <h3 className="tw-mb-4">Photo Gallery</h3>
      <ul
        ref={listRef}
        tabIndex={0}
        className={`${
          enhance
            ? 'tw-fixed tw-inset-0 tw-z-[999999] tw-bg-gray-600/80'
            : 'tw-relative tw-gap-6 tw-rounded-lg tw-p-4 tw-shadow-inner'
        } tw-flex tw-w-full tw-snap-x tw-snap-mandatory tw-overflow-x-auto tw-scroll-smooth focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-400`}
        onClick={() => enhanceEnhance(!enhance || justPRINTthedamnthing)}
      >
        {images.map((image, index) => (
          <li
            className={`${
              enhance ? 'm-4 tw-h-full tw-w-full' : 'tw-h-40 tw-max-w-[90vw]'
            } tw-flex tw-shrink-0 tw-snap-center`}
            key={image.url}
            onClick={(e) => {
              e.stopPropagation()

              enhanceEnhance(!enhance)

              if (!enhance) {
                setTimeout(() => {
                  if (listRef.current) listRef.current.scrollLeft = index * window.innerWidth
                }, 0)
              }
            }}
            role="button"
          >
            <img
              className="tw-m-auto tw-max-h-full tw-max-w-full tw-shrink-0 tw-rounded-lg tw-bg-white tw-shadow-xl"
              src={image.url}
              onClick={(e) => enhance && e.stopPropagation()}
            />
          </li>
        ))}
        {enhance && (
          <>
            <button
              role="button"
              className="tw-fixed tw-inset-y-0 tw-left-0 tw-hidden tw-w-12 tw-items-center tw-bg-white/5 tw-px-2 tw-text-gray-200 hover:tw-bg-white/20 focus:tw-bg-white/20 focus:tw-outline-none sm:tw-flex"
              onClick={(e) => {
                e.stopPropagation()

                if (listRef.current) listRef.current.scrollLeft -= window.innerWidth
              }}
            >
              <ArrowLeft className="" />
            </button>
            <button
              role="button"
              className="tw-fixed tw-inset-y-0 tw-right-0 tw-hidden tw-w-12 tw-items-center tw-bg-white/5 tw-px-2 tw-text-gray-200 hover:tw-bg-white/20 focus:tw-bg-white/20 focus:tw-outline-none sm:tw-flex"
              onClick={(e) => {
                e.stopPropagation()

                if (listRef.current) listRef.current.scrollLeft += window.innerWidth
              }}
            >
              <ArrowLeft className="tw-rotate-180" />
            </button>
          </>
        )}
      </ul>
    </div>
  )
}

const ArrowLeft = ({ ...props }: ComponentProps<'svg'>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    {...props}
  >
    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
  </svg>
)
