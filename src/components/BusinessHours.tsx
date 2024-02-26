import { ComponentProps } from 'preact'

interface BusinessHour {
  day: string
  open: string
  close: string
  inactive?: boolean
}

export interface BusinessHoursProps extends ComponentProps<'div'> {
  businessHours: BusinessHour[]
}

export const BusinessHours = ({ className = '', businessHours, ...props }: BusinessHoursProps) => {
  const activeBusinessHours = (Array.isArray(businessHours) ? businessHours : []).filter((bh) => !bh.inactive)

  if (!activeBusinessHours.length) return null

  return (
    <div className={`${className} tw-w-full`} {...props}>
      <h3 className="tw-w-full">Business Hours</h3>
      <ul className="tw-flex tw-w-full tw-flex-wrap tw-gap-4">
        {activeBusinessHours.map((bh) => (
          <li className="tw-flex tw-flex-col tw-justify-center">
            <span className="tw-text-gray-800">{bh.day}</span>
            <hr className="tw-mb-2" />
            <span className="tw-text-sm tw-text-gray-700">
              Open: <span className="tw-font-bold">{bh.open}</span>
            </span>
            <span className="tw-text-sm tw-text-gray-700">
              Close: <span className="tw-font-bold">{bh.close}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
