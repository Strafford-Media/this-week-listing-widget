import { ComponentProps } from 'preact'
import { ListingItem } from './ListingItem'
import { useListingsEngine } from '../hooks/useListingsEngine'
import { useURLParams } from '../hooks/useURLParams'

export interface ListingListProps extends ComponentProps<'div'> {}

export const ListingList = ({ className = '', ...props }: ListingListProps) => {
  const { categories, island, category, islands } = useURLParams()

  const { list, loaded } = useListingsEngine({ island, categories: category ? [category] : categories, search: '' })

  return (
    <div className={`${className}`} {...props}>
      <h2 className="tw-mb-8 tw-text-center">Activities{island && ` on ${island}`}</h2>
      <ul className="tw-grid tw-grid-cols-[repeat(auto-fill,minmax(300px,1fr))] tw-gap-4 tw-px-2">
        {list.map((data) => (
          <ListingItem listing={data.data} />
        ))}
        {loaded && !list.length && <p>No activities matched your search, unfortunately.</p>}
      </ul>
    </div>
  )
}
