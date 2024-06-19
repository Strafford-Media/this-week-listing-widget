import { useDudaContext } from '../DudaContext'
import { ComponentProps } from 'preact'
import { ListingItem } from './ListingItem'
import { useListingsEngine } from '../hooks/useListingsEngine'
import { useEffect, useMemo, useRef, useState } from 'preact/hooks'

export interface FeaturedListingsProps extends ComponentProps<'div'> {}

export const FeaturedListings = ({ className = '', ...props }: FeaturedListingsProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const { siteDetails } = useDudaContext()

  const {
    max,
    ids: idsString = '',
    island,
    categories: rawCategories,
    basic,
    premium,
    promotedOnly,
  } = siteDetails.config

  const numericalMax = isNaN(Number(max)) ? 0 : Number(max)

  const categories = useMemo(() => {
    const parsedCats = (rawCategories?.split(',').map((cat: string) => cat.trim().toLowerCase()) ?? []).filter(Boolean)

    return parsedCats.length ? parsedCats : undefined
  }, [rawCategories])

  const ids = useMemo(
    () =>
      idsString
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean),
    [idsString],
  )

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

  const limit = ids.length ? lists.list.length : numericalMax || lists.list.length

  const truncatedList = lists.list?.slice(0, limit)
  const maxWidth = maxWidthCalculator(truncatedList?.length)

  return (
    <div ref={ref} className={`${className} tw-flex tw-justify-center`} {...props}>
      <ul
        style={{ maxWidth }}
        className="tw-grid tw-w-full tw-grid-cols-[repeat(auto-fill,minmax(300px,1fr))] tw-gap-4"
      >
        {loaded && truncatedList.map((l) => <ListingItem listingURL={l.page_item_url} listing={l.data} />)}
      </ul>
    </div>
  )
}

const maxWidthCalculator = (count = 6) => {
  if (count > 5) {
    return '100%'
  }

  switch (count) {
    case 1:
      return '350px'
    case 2:
      return '700px'
    case 3:
      return '1050px'
    case 4:
      return '1400px'
    case 5:
      return '1750px'
    default:
      return '100%'
  }
}
