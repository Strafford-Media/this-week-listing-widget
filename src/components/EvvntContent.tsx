import { useDudaContext } from '../DudaContext'
import React, { ComponentProps } from 'preact'
import { useEffect } from 'preact/hooks'

const publishers: Record<string, { apiKey: string; id: number }> = {
  hawaii: {
    apiKey: 'THISWEEKHAWAIIDJ',
    id: 7674,
  },
  maui: {
    apiKey: 'THISWEEKHAWAIID',
    id: 7673,
  },
  oahu: {
    apiKey: 'THISWEEKHAWAIIN',
    id: 7672,
  },
  kauai: {
    apiKey: 'THISWEEKHAWAIIB',
    id: 7675,
  },
}

export interface EvvntContentProps extends ComponentProps<'div'> {
  island: string
}

export const EvvntContent = ({ className = '', island, ...props }: EvvntContentProps) => {
  const { siteDetails } = useDudaContext()

  const isMobile = siteDetails.device === 'mobile'

  useEffect(() => {
    const intervalRef = window.setInterval(() => {
      if (typeof (window as any).evvnt_require === 'function') {
        window.clearInterval(intervalRef)
        ;(window as any).evvnt_require('evvnt/discovery_plugin').init({
          api_key: publishers[island]?.apiKey,
          publisher_id: publishers[island]?.id,
          discovery: {
            element: `#this-week-evvnt-content-island-${island}`,
            detail_page_enabled: true,
            widget: true,
            virtual: false,
            map: true,
            category_id: null,
            backfill_events_have_images: false,
            orientation: isMobile ? 'portrait' : 'landscape',
            number: isMobile ? 5 : 9,
          },
        })
      }
    }, 50)
  }, [])

  return (
    <div
      id={`this-week-evvnt-content-island-${island}`}
      className={`${className} tw-h-full tw-w-full tw-rounded-xl tw-bg-white tw-p-2`}
      {...props}
    ></div>
  )
}
