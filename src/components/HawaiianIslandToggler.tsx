import { ComponentProps } from 'preact'
import { HawaiianIslands } from './Hawaii'
import { useDudaContext } from '../DudaContext'
import { useRememberedState } from '../hooks/useRememberedState'

export interface HawaiianIslandsTogglerProps extends ComponentProps<'div'> {}

export const HawaiianIslandsToggler = ({ className = '', ...props }: HawaiianIslandsTogglerProps) => {
  const { siteDetails } = useDudaContext()

  const [island, setIsland] = useRememberedState('this-week-hawaiian-island-selection', '')

  const content = getContent(siteDetails.config, island)

  return (
    <div className={`${className} tw-relative`} {...props}>
      <HawaiianIslands
        className="tw-text-lime-600"
        onHawaiiClick={() => setIsland('hawaii')}
        onMauiClick={() => setIsland('maui')}
        onOahuClick={() => setIsland('oahu')}
        onKauaiClick={() => setIsland('kauai')}
        hawaiiClass={island === 'hawaii' ? 'tw-text-red-600' : 'hover:tw-text-red-600 tw-cursor-pointer'}
        mauiClass={island === 'maui' ? 'tw-text-pink-600' : 'hover:tw-text-pink-600 tw-cursor-pointer'}
        oahuClass={island === 'oahu' ? 'tw-text-yellow-300' : 'hover:tw-text-yellow-300 tw-cursor-pointer'}
        kauaiClass={island === 'kauai' ? 'tw-text-fuchsia-500' : 'hover:tw-text-fuchsia-500 tw-cursor-pointer'}
      />
      {content && (
        <>
          <div className="tw-absolute tw-left-0 tw-top-1/3 tw-grid tw-h-2/3 tw-w-1/2 tw-grid-rows-[auto_minmax(0,1fr)] tw-gap-2">
            <div className="tw-rounded-lg tw-bg-white/50 tw-p-2">
              <p className="tw-rounded-md tw-bg-gray-100 tw-p-1 tw-text-sm lg:tw-text-base">{content.content}</p>
            </div>
            <div className="tw-inline-flex tw-min-h-0 tw-w-fit tw-rounded-lg tw-bg-white/50 tw-p-2">
              <img className="tw-max-h-full tw-object-cover" src={content.image} alt="Hawaii (Big Island)" />
            </div>
          </div>
          <div className="tw-right-1/5 tw-top-1/5 tw-absolute">
            <a
              className={`${content.btnClass} tw-cursor-pointer tw-rounded-lg tw-px-6 tw-py-4 tw-text-xl tw-ring-4 tw-ring-white`}
              href={content.link.raw_url}
            >
              {content.btnLabel}
            </a>
          </div>
        </>
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
        btnClass: 'tw-text-white tw-bg-red-600 hover:tw-bg-red-900 focus:tw-bg-red-900',
        btnLabel: 'Explore the Big Island',
      }
    case 'maui':
      return {
        content: config.mauiContent,
        image: config.mauiImage,
        link: config.mauiLink,
        btnClass: 'tw-text-white tw-bg-pink-600 hover:tw-bg-pink-900 focus:tw-bg-pink-900',
        btnLabel: 'Explore Maui',
      }
    case 'oahu':
      return {
        content: config.oahuContent,
        image: config.oahuImage,
        link: config.oahuLink,
        btnClass: 'tw-text-gray-800 tw-bg-yellow-300 hover:tw-bg-yellow-600 focus:tw-bg-yellow-600',
        btnLabel: 'Explore Oahu',
      }
    case 'kauai':
      return {
        content: config.kauaiContent,
        image: config.kauaiImage,
        link: config.kauaiLink,
        btnClass: 'tw-text-white tw-bg-fuchsia-500 hover:tw-bg-fuchsia-900 focus:tw-bg-fuchsia-900',
        btnLabel: 'Explore Kauai',
      }
    default:
      return null
  }
}
