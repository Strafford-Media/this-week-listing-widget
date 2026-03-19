import { NhostClient } from '@nhost/nhost-js'
import { CollectionManager } from 'utils/ListingsEngine'

declare global {
  interface Window {
    FH: any
    nhost: NhostClient
    dmAPI: any
    evvnt_require(module: string): any
    postscribe(el: any, s: string): any
    thisWeekCollectionManager: CollectionManager
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
  rich_description: string
  primary_address: string
  lat_lng: string
  primary_email: string
  primary_phone: string
  primary_web_url: string
  tier: 'basic' | 'standard' | 'premium'
  promoted: boolean
  main_image: string
  action_shot1?: string
  logo?: string
  this_week_recommended: boolean
  is_island_original: boolean
  social_media: Record<string, string>
  business_hours: any
  promo_code_count: number
  promo_code_visitor_hook: string
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
  breadcrumbs?: { href: string; label: string }[]
}

export interface Category {
  id: number
  label: string
  is_primary: boolean
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

export interface TextQuestion {
  id: number
  label: string
  question_type: 'text'
  active: boolean
  metadata: TextMetadata
}

export interface NumberQuestion {
  id: number
  label: string
  question_type: 'number'
  active: boolean
  metadata: NumberMetadata
}

export interface CheckboxQuestion {
  id: number
  label: string
  question_type: 'checkbox'
  active: boolean
  metadata: CheckboxMetadata
}

export interface ChoiceQuestion {
  id: number
  label: string
  question_type: 'choice'
  active: boolean
  metadata: ChoiceMetadata
}

export type VisitorQuestion = TextQuestion | NumberQuestion | CheckboxQuestion | ChoiceQuestion

export interface DefaultMetadata {
  required?: boolean
  description?: string
}

export interface TextMetadata extends DefaultMetadata {
  defaultValue?: string
  longform?: boolean
  placeholder?: string
}

export interface NumberMetadata extends DefaultMetadata {
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  placeholder?: string | number
}

export interface ChoiceMetadata extends DefaultMetadata {
  choices: { label: string; defaultChecked?: boolean }[]
  multiple?: boolean
}

export interface CheckboxMetadata extends DefaultMetadata {
  defaultValue?: boolean
}
