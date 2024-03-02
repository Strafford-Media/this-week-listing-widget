declare global {
  interface Window {
    FH: any
  }
}

export interface Listing {
  business_name: string
  slug: string
  slogan: string
  island: string
  created_at: string
  updated_at: string
  id: number
  description: string
  primary_address: string
  lat_lng: string
  primary_email: string
  primary_phone: string
  primary_web_url: string
  tier: 'basic' | 'standard' | 'premium'
  main_image: string
  action_shot1?: string
  logo?: string
  this_week_recommended: boolean
  social_media: Record<string, string>
  business_hours: any
  images: {
    url: string
    status: 'UPLOADED'
    original_url: string
  }[]
  videos: {
    url: string
    type: 'youtube' | 'vimeo' | 'dailymotion'
    id: string
  }[]
  booking_links: []
  categories?: Category[]
}

export interface Category {
  id: number
  label: string
  listings_count?: number
  listing_category_tags: {
    id: number
    listing_id: number
  }[]
  island?: {
    hawaii: boolean
    maui: boolean
    oahu: boolean
    kauai: boolean
    [key: string]: boolean
  }
}

export interface CollectionValue<T> {
  data: T
  page_item_url: string
}

export interface DudaContextValue {
  siteDetails: {
    device: 'desktop' | 'tablet' | 'mobile'
    page: string
    inEditor: boolean
    accountId: string
    siteId: string
    widgetId: string
    widgetVersion: string
    elementId: string
    config: any
    locale: string
  }
  pageData?: Listing
}

export interface CollectionResult<T extends { id: number }> {
  name: string
  page: {
    pageSize: number
    pageNumber: number
    totalPages: number
    totalItems: number
  }
  filters: [
    {
      field: string
      value: string
      operator: string
    },
  ]
  sortBy: string | null
  search: string | null
  fields: string[] | null
  language: string | null
  values: CollectionValue<T>[]
}
