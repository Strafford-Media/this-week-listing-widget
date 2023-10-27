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
  pageData: {
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
