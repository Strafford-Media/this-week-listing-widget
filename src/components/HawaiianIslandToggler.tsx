import { ComponentProps } from 'preact'
import { HawaiianIslands } from './Hawaii'
import { useDudaContext } from '../DudaContext'
import { useState } from 'preact/hooks'

export interface HawaiianIslandsTogglerProps extends ComponentProps<'div'> {}

export const HawaiianIslandsToggler = ({ className = '', ...props }: HawaiianIslandsTogglerProps) => {
  const { siteDetails } = useDudaContext()

  const [island, setIsland] = useState('')

  const content = getContent(siteDetails.config, island)

  return (
    <div className={`${className} tw-relative`} {...props}>
      <HawaiianIslands
        className="tw-text-lime-600"
        onHawaiiClick={() => setIsland('hawaii')}
        onMauiClick={() => setIsland('maui')}
        onOahuClick={() => setIsland('oahu')}
        onKauaiClick={() => setIsland('kauai')}
      />
      {content && (
        <div className="tw-absolute tw-left-0 tw-top-1/3 tw-grid tw-h-2/3 tw-w-1/2 tw-grid-rows-[auto_minmax(0,1fr)] tw-gap-2">
          <div className="tw-rounded-lg tw-bg-white/50 tw-p-2">
            <p className="tw-rounded-md tw-bg-gray-100 tw-p-1 tw-text-sm lg:tw-text-base">{content.content}</p>
          </div>
          <div className="tw-inline-flex tw-min-h-0 tw-w-fit tw-rounded-lg tw-bg-white/50 tw-p-2">
            <img className="tw-max-h-full tw-object-cover" src={content.image} alt="Hawaii (Big Island)" />
          </div>
        </div>
      )}
    </div>
  )
}

const getContent = (config: any, island: string) => {
  switch (island) {
    case 'hawaii':
      return {
        content: config.hawaiiContent,
        image: config.hawaiiImage,
        link: config.hawaiiLink,
      }
    case 'maui':
      return {
        content: config.mauiContent,
        image: config.mauiImage,
        link: config.mauiLink,
      }
    case 'oahu':
      return {
        content: config.oahuContent,
        image: config.oahuImage,
        link: config.oahuLink,
      }
    case 'kauai':
      return {
        content: config.kauaiContent,
        image: config.kauaiImage,
        link: config.kauaiLink,
      }
    default:
      return null
  }
}
