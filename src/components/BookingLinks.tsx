import { useScript } from 'hooks/useScript'
import { ComponentProps, Fragment } from 'preact'
import { useMemo } from 'preact/hooks'

interface BookingLink {
  type: 'fareharbor-item' | 'fareharbor-grid' | 'external'
  label: string
  imageUrl?: string
  description: string
  title: string
  shortname: string
  item: string
  sheet: string
  asn: string
  'asn-ref': string
  'full-item': boolean
  flow: string
  branding: boolean
  'bookable-only': boolean
  href: string
  script: string
}

export interface BookingLinksProps extends ComponentProps<'div'> {
  links: BookingLink[]
}

export const BookingLinks = ({ className = '', links, ...props }: BookingLinksProps) => {
  return (
    <>
      {links
        .filter((link) => link.type === 'fareharbor-grid')
        .map((link) => (
          <FareharborGrid link={link} />
        ))}
      <div className={`${className} tw-flex tw-flex-wrap tw-justify-center tw-gap-4`} {...props}>
        {links
          .filter((link) => link.type !== 'fareharbor-grid')
          .map((link) => (
            <div className="tw-flex tw-w-full tw-max-w-80 tw-flex-col tw-items-center tw-gap-4 tw-rounded-md tw-border tw-border-gray-300 tw-p-2 tw-shadow-md">
              {link.title && <h4 className="tw-text-center">{link.title}</h4>}
              {link.imageUrl && <img src={link.imageUrl} alt={link.title} />}
              {link.description && (
                <div className="tw-text-justify tw-text-sm">
                  {link.description.split('\n').map((text, i) => (
                    <Fragment key={i}>
                      {i !== 0 && <br />}
                      {text}
                    </Fragment>
                  ))}
                </div>
              )}
              {link.type === 'fareharbor-item' && <FareHarborItemLink className="tw-mt-auto" link={link} />}
              {link.type === 'external' && <ExternalBookingLink className="tw-mt-auto" link={link} />}
            </div>
          ))}
      </div>
    </>
  )
}

interface BookingLinkProps {
  link: BookingLink
  className?: string
}

export const FareharborGrid = ({ link, className = '' }: BookingLinkProps) => {
  const scriptValue = useMemo(() => getScriptSrc(link.script), [link])
  const ref = useScript(scriptValue, true)

  return <div className={`${className} tw-mb-8 tw-w-full`} ref={ref}></div>
}

export const ExternalBookingLink = ({ link, className = '' }: BookingLinkProps) => {
  if (!link.href) return null

  return (
    <a
      className={`${className} tw-flex tw-items-center tw-justify-center tw-rounded-md tw-bg-red-500 tw-px-6 tw-py-2 tw-text-base tw-font-bold tw-text-white`}
      href={link.href}
      target="_blank"
      rel="noreferrer noopener"
    >
      {link.label}
    </a>
  )
}

export const FareHarborItemLink = ({ link, className = '' }: BookingLinkProps) => {
  return (
    <button
      className={`${className} tw-flex tw-items-center tw-justify-center tw-rounded-md tw-bg-red-500 tw-px-6 tw-py-2 tw-text-base tw-font-bold tw-text-white`}
      onClick={() => {
        if (window.FH) {
          window.FH.open({
            shortname: link.shortname,
            sheet: link.sheet || undefined,
            fallback: 'simple',
            fullItems: link['full-item'] ? 'yes' : 'no',
            flow: link.flow || 'no',
            view: { item: link.item },
            branding: link.branding ? 'yes' : 'no',
            asn: link.asn,
            asnRef: link['asn-ref'] || undefined,
            'bookable-only': link['bookable-only'] ? 'yes' : 'no',
          })
        } else {
          window.open(
            `https://fareharbor.com/embeds/book/${link.shortname}/items/${link.item}/?fallback=simple&full-items=${
              link['full-item'] ? 'yes' : 'no'
            }&flow=${link.flow || 'no'}&branding=${link.branding ? 'yes' : 'no'}&asn=${link.asn}${
              link['asn-ref'] ? `&asn-ref=${link['asn-ref']}` : ''
            }&bookable-only=${link['bookable-only'] ? 'yes' : 'no'}${link.sheet ? `&sheet=${link.sheet}` : ''}`,
            '_blank',
            'noreferrer,noopener',
          )
        }
      }}
    >
      {link.label}
    </button>
  )
}

const scriptSrcRegex = /<script[^<]+src="([^<]+)"/
const getScriptSrc = (script: string) => {
  if (script.includes('<script ')) {
    const matches = script.match(scriptSrcRegex)

    if (!matches) {
      return script
    }

    return matches[1]
  } else {
    return script
  }
}
