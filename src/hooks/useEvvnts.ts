import { useMemo } from 'preact/hooks'
import { EventsResponse, PublisherResponse } from '../@types/evvnt'
import { useEvvntFetch } from './useEvvntFetch'

export const useEvvnts = (publisherId: number | string) => {
  const { data: publisherData, error: publisherError } = useEvvntFetch<PublisherResponse>(
    `https://discoverevvnt.com/api/publisher/${publisherId}/publisher_settings`,
  )
  const { data: eventsData, error: eventsError } = useEvvntFetch<EventsResponse>(
    `https://discoverevvnt.com/api/publisher/${publisherId}/home_page_events?hitsPerPage=30&multipleEventInstances=true&page=0&publisher_id=${publisherId}`,
  )

  const { data } = useMemo(() => {
    const eventMap = publisherData?.publisher.categories.reduce((map, item) => ({ ...map, [item.id]: item }), {})

    return { data: {} }
  }, [publisherData, eventsData])

  return { data: [publisherData, eventsData], error: publisherError || eventsError }
}
