import { useRememberedState } from '../hooks/useRememberedState'
import { ComponentProps } from 'preact'
import { EvvntContent } from './EvvntContent'
import { islandClasses } from '../utils/islandClasses'

export interface EvvntGalleryProps extends ComponentProps<'div'> {
  config?: any
}

const islands = ['kauai', 'oahu', 'maui', 'hawaii']

export const EvvntGallery = ({ className = '', ...props }: EvvntGalleryProps) => {
  const [tab, setTab] = useRememberedState('this-week-evvnt-tab-island', 'oahu')

  return (
    <div className={`${className} -tw-mt-12 sm:-tw-mt-16`} {...props}>
      <div className="tw-grid tw-h-12 tw-grid-cols-4 tw-items-end tw-gap-2 tw-px-2 sm:tw-h-16">
        {islands.map((island) => (
          <div
            className={getTabClasses(island, tab)}
            role="tab"
            onKeyDown={(e) => e.key === 'Enter' && setTab(island)}
            onClick={() => setTab(island)}
            tabIndex={0}
          >
            {island}
          </div>
        ))}
      </div>
      <div className="tw-grid tw-min-h-96 tw-grid-cols-1 tw-pt-4">
        {islands.map((island) => (
          <EvvntContent style={`grid-area: 1/1/1/1;${tab === island ? 'z-index:100;' : ''}`} island={island} />
        ))}
      </div>
    </div>
  )
}

function getTabClasses(island: string, tab: string) {
  const selectionClasses =
    island === tab
      ? 'tw-h-12 sm:tw-h-16'
      : 'tw-h-6 sm:tw-h-10 hover:tw-h-8 sm:hover:tw-h-12 focus:tw-h-8 sm:focus:tw-h-12'

  return `tw-transition-all tw-cursor-pointer focus:tw-outline-none sm:focus:tw-ring-4 focus:tw-ring-2 tw-rounded-t-lg tw-flex tw-justify-center tw-items-center tw-text-sm tw-capitalize sm:tw-text-xl tw-font-bold ${
    islandClasses[island].coloredBg ?? ''
  } ${islandClasses[island].ring}  ${selectionClasses}`
}
