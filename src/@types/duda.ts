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
  pageData?: {
    business_name: string
    slogan: string
    island: 'hawaii' | 'oahu' | 'maui' | 'kauai'
    created_at: string
    updated_at: string
    id: number
    description: string
    primary_address: string
    primary_email: string
    primary_phone: string
    primary_web_url: string
    tier: 'basic' | 'standard' | 'premium'
    main_image: string
    logo: string
    this_week_recommended: boolean
    images: {
      url: string
      status: 'UPLOADED'
      original_url: string
    }[]
    videos: {
      url: string
    }[]
    booking_links: []
  }
}

export interface CollectionResult {
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
    }
  ]
  sortBy: string | null
  search: string | null
  fields: string[] | null
  language: string | null
  values: {
    data: {
      business_name: string
      images: {
        url: string
        status: string
        original_url: string
      }[]
      action_shot1: string
      island: string
      main_image: string
      primary_address: string
      created_at: string | null
      description: string
      videos: {
        url: string
      }[]
      booking_links: any[]
      primary_phone: string
      updated_at: string | null
      tier: 'basic' | 'standard' | 'premium'
      this_week_recommended: boolean
      logo: string
      primary_email: string
      id: number
      slogan: string
      primary_web_url: string
    }
    page_item_url: string
  }[]
}
