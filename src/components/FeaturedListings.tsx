import { useDudaContext } from '../DudaContext'
import { ComponentProps } from 'preact'
import { ListingItem } from './ListingItem'
import { useListingsEngine } from '../hooks/useListingsEngine'
import { useMemo } from 'preact/hooks'

export interface FeaturedListingsProps extends ComponentProps<'div'> {}

export const FeaturedListings = ({ className = '', ...props }: FeaturedListingsProps) => {
  const { siteDetails } = useDudaContext()

  const { max, ids, island, categories: rawCategories, basic, premium, promotedOnly } = siteDetails.config

  const numericalMax = isNaN(Number(max)) ? 0 : Number(max)

  const categories = useMemo(() => {
    const parsedCats = (rawCategories?.split(',').map((cat: string) => cat.trim().toLowerCase()) ?? []).filter(Boolean)

    return parsedCats.length ? parsedCats : undefined
  }, [rawCategories])

  const tiers = useMemo(() => {
    const tierList = []

    if (basic) {
      tierList.push('basic')
    }

    if (premium) {
      tierList.push('premium')
    }

    return tierList
  }, [basic, premium])

  const { lists, loaded } = useListingsEngine({ island, categories, tiers, promotedOnly, ids })

  return (
    <div className={`${className}`} {...props}>
      <ul className="tw-grid tw-grid-cols-[repeat(auto-fill,minmax(300px,1fr))] tw-gap-4">
        {loaded &&
          lists.list
            ?.slice(0, numericalMax || lists.list.length)
            .map((l) => <ListingItem listingURL={l.page_item_url} listing={l.data} />)}
      </ul>
    </div>
  )
}
