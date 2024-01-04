import { ComponentProps } from 'preact'
import { HawaiianIslands } from './Hawaii'
import { useDudaContext } from '../DudaContext'
import { useRememberedState } from '../hooks/useRememberedState'
import { useMemo } from 'preact/hooks'

export interface HawaiianIslandsTogglerProps extends ComponentProps<'div'> {}

export const HawaiianIslandsToggler = ({ className = '', ...props }: HawaiianIslandsTogglerProps) => {
  const { siteDetails } = useDudaContext()

  const [island, setIsland] = useRememberedState('this-week-hawaiian-island-selection', '')

  const islandContents = useMemo(() => {
    return ['hawaii', 'maui', 'oahu', 'kauai'].map((i) => getContent(siteDetails.config, i))
  }, [siteDetails])

  const goToIsland = (island: string) => {
    const url = getContent(siteDetails.config, island)?.link?.raw_url

    if (url) {
      window.open(url, '_self')
    }
  }

  return (
    <div className={`${className} tw-relative tw-flex tw-w-full tw-animate-fade-in`} {...props}>
      <HawaiianIslands
        className="tw-absolute tw-left-0 tw-right-0 tw-top-0 tw-mx-auto tw-w-full tw-max-w-3xl tw-text-[#ecd9c7] tw-drop-shadow-[-4px_2px_4px_black]"
        onIslandHover={setIsland}
        onIslandClick={goToIsland}
        hawaiiClass={island === 'hawaii' ? 'tw-cursor-pointer tw-text-red-600' : 'hover:tw-text-red-600'}
        mauiClass={island === 'maui' ? 'tw-cursor-pointer tw-text-pink-600' : 'hover:tw-text-pink-600'}
        oahuClass={island === 'oahu' ? 'tw-cursor-pointer tw-text-yellow-300' : 'hover:tw-text-yellow-300'}
        kauaiClass={island === 'kauai' ? 'tw-cursor-pointer tw-text-fuchsia-500' : 'hover:tw-text-fuchsia-500'}
      />
      <div className="tw-mt-[284px] tw-grid tw-w-2/3 tw-grid-cols-[repeat(1,minmax(0,auto))] tw-grid-rows-[repeat(1,minmax(0,auto))] tw-items-stretch lg:tw-mt-[200px] lg:tw-w-1/2">
        {islandContents.map((isle) => (
          <div
            className={`tw-col-start-1 tw-row-start-1 tw-overflow-hidden tw-bg-gradient-to-b tw-from-20% tw-transition-opacity tw-duration-300 ${
              isle.bgClass
            } ${island === isle.island ? 'tw-opacity-100' : 'tw-opacity-0'}`}
          >
            <img className="tw-w-full" src={isle.bannerImage} alt={`scenic view of ${isle.island}`} />
            <div>
              <div className="tw-z-10 tw-flex">
                <img
                  className="tw-z-10 -tw-mt-4 tw-ml-2 tw-max-h-16 lg:-tw-mt-8 lg:tw-max-h-20 xl:tw-max-h-24"
                  src={isle.logo}
                  alt={isle.island}
                />
                <h4
                  className={`tw-m-auto tw-py-2 tw-text-center tw-text-3xl tw-font-normal tw-tracking-wide tw-drop-shadow xl:tw-py-4 xl:tw-text-4xl 2xl:tw-text-5xl ${isle.tagLineClass}`}
                  style={{ fontFamily: "'Bobaland.ttf'" }}
                >
                  {isle.tagLine}
                </h4>
              </div>
              <div className="tw-relative tw-flex tw-px-4">
                <img
                  className="tw-absolute tw-left-0 tw-top-0 tw-max-w-48 tw-origin-top-left -tw-rotate-12 tw-self-start"
                  src={isle.magImage}
                  alt={`Magazine Cover from This Week Hawaii for ${isle.islandName}`}
                />
                <p className="tw-z-10 tw-mb-4 tw-ml-48 tw-rounded-md tw-bg-white tw-p-3 tw-text-gray-800 lg:tw-text-xl xl:tw-text-2xl">
                  {isle.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const getContent = (config: any, island: string) => {
  switch (island) {
    case 'hawaii':
      return {
        island: 'hawaii',
        content: config.hawaiiContent,
        bannerImage: config.hawaiiImage,
        magImage: config.hawaiiMagImage,
        logo: config.hawaiiLogo,
        link: config.hawaiiLink,
        bgClass: 'tw-from-red-500',
        tagLine: config.hawaiiTagline,
        tagLineClass: 'tw-text-white',
        islandName: 'Hawaii (Big Island)',
      }
    case 'maui':
      return {
        island: 'maui',
        content: config.mauiContent,
        bannerImage: config.mauiImage,
        magImage: config.mauiMagImage,
        logo: config.mauiLogo,
        link: config.mauiLink,
        bgClass: 'tw-from-pink-500',
        tagLine: config.mauiTagline,
        tagLineClass: 'tw-text-yellow-400',
        islandName: 'Maui',
      }
    case 'kauai':
      return {
        island: 'kauai',
        content: config.kauaiContent,
        bannerImage: config.kauaiImage,
        magImage: config.kauaiMagImage,
        logo: config.kauaiLogo,
        link: config.kauaiLink,
        bgClass: 'tw-from-fuchsia-500',
        tagLine: config.kauaiTagline,
        tagLineClass: 'tw-text-yellow-300',
        islandName: 'Kauai',
      }
    case 'oahu':
    default:
      return {
        island: 'oahu',
        content: config.oahuContent,
        bannerImage: config.oahuImage,
        magImage: config.oahuMagImage,
        logo: config.oahuLogo,
        link: config.oahuLink,
        bgClass: 'tw-from-yellow-300',
        tagLine: config.oahuTagline,
        tagLineClass: 'tw-text-red-600 ',
        islandName: 'Oahu',
      }
  }
}
