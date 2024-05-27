import { useDudaContext } from '../DudaContext'
import { ComponentProps } from 'preact'
import { ListingItem } from './ListingItem'
import { useListingsEngine } from '../hooks/useListingsEngine'

export interface FeaturedListingsProps extends ComponentProps<'div'> {}

export const FeaturedListings = ({ className = '', ...props }: FeaturedListingsProps) => {
  const { siteDetails } = useDudaContext()

  const { max, ids, islands, categories, tiers, heading } = siteDetails.config

  const { lists, loaded } = useListingsEngine()

  return (
    <div className={`${className}`} {...props}>
      {heading && <h3 class="featured-listings-header">{heading}</h3>}
      {loaded && lists.list?.map((l) => <ListingItem listingURL={l.page_item_url} listing={l.data} />)}
    </div>
  )
}
