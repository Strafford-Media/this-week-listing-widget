import { ComponentProps } from 'preact'
import { ListingItem } from './ListingItem'
import { useListingsEngine } from '../hooks/useListingsEngine'
import { useURLParams } from '../hooks/useURLParams'

export interface ListingListProps extends ComponentProps<'div'> {}

export const ListingList = ({ className = '', ...props }: ListingListProps) => {
  const { categories, island: islandFromPath, category, islands, navigate } = useURLParams()

  const island = islandFromPath || islands[0] || ''

  const { list, loaded } = useListingsEngine({ island, categories: category ? [category] : categories, search: '' })

  return (
    <div className={`${className}`} {...props}>
      <h2 className="tw-mb-8 tw-text-center">Activities{islandFromPath && ` on ${island}`}</h2>
      <div className="tw-mb-8 tw-flex tw-flex-col tw-justify-evenly md:tw-flex-row">
        {!islandFromPath && (
          <div className="tw-flex tw-flex-nowrap tw-overflow-clip tw-rounded-md tw-bg-white">
            <button
              className={`tw-rounded-l-md tw-border-y tw-border-l tw-border-red-500 tw-px-4 tw-py-1 ${
                !islands[0] || islands[0] === 'hawaii' ? 'tw-bg-red-500 tw-text-red-100' : 'tw-text-red-500'
              }`}
              onClick={() => {
                if (islands[0] === 'hawaii') {
                  navigate({ remove: { island: 'hawaii' } })
                } else {
                  navigate({ add: { island: 'hawaii' } })
                }
              }}
            >
              Hawaii
            </button>
            <button
              className={`tw-border-y tw-border-pink-500 tw-px-4 tw-py-1 ${
                !islands[0] || islands[0] === 'maui' ? 'tw-bg-pink-500 tw-text-pink-100 ' : 'tw-text-pink-500'
              }`}
              onClick={() => {
                if (islands[0] === 'maui') {
                  navigate({ remove: { island: 'maui' } })
                } else {
                  navigate({ add: { island: 'maui' } })
                }
              }}
            >
              Maui
            </button>
            <button
              className={`tw-border-y tw-border-yellow-500 tw-px-4 tw-py-1 ${
                !islands[0] || islands[0] === 'oahu' ? 'tw-bg-yellow-500 tw-text-yellow-100 ' : 'tw-text-yellow-500'
              }`}
              onClick={() => {
                if (islands[0] === 'oahu') {
                  navigate({ remove: { island: 'oahu' } })
                } else {
                  navigate({ add: { island: 'oahu' } })
                }
              }}
            >
              Oahu
            </button>
            <button
              className={`tw-rounded-r-md tw-border-y tw-border-r tw-border-fuchsia-500 tw-px-4 tw-py-1 ${
                !islands[0] || islands[0] === 'kauai' ? 'tw-bg-fuchsia-500 tw-text-fuchsia-100 ' : 'tw-text-fuchsia-500'
              }`}
              onClick={() => {
                if (islands[0] === 'kauai') {
                  navigate({ remove: { island: 'kauai' } })
                } else {
                  navigate({ add: { island: 'kauai' } })
                }
              }}
            >
              Kauai
            </button>
          </div>
        )}
        <div>
          <div></div>
        </div>
      </div>
      {loaded && !list.length && (
        <p className="tw-w-full tw-text-center">No activities matched your search, unfortunately.</p>
      )}
      <ul className="tw-grid tw-grid-cols-[repeat(auto-fill,minmax(300px,1fr))] tw-gap-4 tw-px-2">
        {list.map((data) => (
          <ListingItem listing={data.data} />
        ))}
      </ul>
    </div>
  )
}
