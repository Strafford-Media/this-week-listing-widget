import { ComponentProps } from 'preact'
import { ListingItem } from './ListingItem'
import { SearchEngine } from '../utils/SearchEngine'

export interface ListingListProps extends ComponentProps<'div'> {}

const searchEngine = new SearchEngine()

export const ListingList = ({ className = '', ...props }: ListingListProps) => {
  const collection = searchEngine.collection

  return (
    <div className={`${className}`} {...props}>
      <ul>
        {collection.map((data) => (
          <ListingItem listing={data.data} />
        ))}
      </ul>
    </div>
  )
}
