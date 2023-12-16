export interface PublisherResponse {
  publisher: Publisher
  theme: Theme
  api_key: string
  cache_key: string
}

export interface Publisher {
  id: number
  name: string
  url: string
  logo_url: string
  large_logo_url: string
  location_type: string
  countries: string[]
  eventbrite: ActiveNetwork
  show_publisher_logos: boolean
  show_promoter_logos: boolean
  ticketmaster: ActiveNetwork
  goldstar: ActiveNetwork
  geotix: ActiveNetwork
  active_network: ActiveNetwork
  axs: ActiveNetwork
  enmotive: ActiveNetwork
  bandsintown: ActiveNetwork
  run_sign_up: EventVesta
  ticket_sign_up: EventVesta
  event_vesta: EventVesta
  ticket_fairy: EventVesta
  race_entry: EventVesta
  hotelmap: Hotelmap
  social_feed: Hotelmap
  category_specific: boolean
  categories: Category[]
  root_categories: Category[]
  broadcast_moderation_delay: number
  calendar_active_for_external_referrers: boolean
  social_share_data: SocialShareData
  scope_submission_categories: boolean
  catchments: Array<Array<number[]>>
  evvnt_ticketing_portal_id: null
  evvnt_ticketed_calendar_only: boolean
  has_editors_picks: boolean
  publisher_exclusions: any[]
  seo_page_title: string
  seo_meta_description: string
  demo_banner: DemoBanner
}

export interface ActiveNetwork {
  backfill: boolean
  feature: boolean
  rss: boolean
  affiliate_id?: null | string
}

export interface DemoBanner {
  show: boolean
  banner_text: string
  button_text: string
  button_url: string
}

export interface EventVesta {
  backfill: boolean
  rss: boolean | null
}

export interface Hotelmap {
  enabled: boolean
}

export interface Category {
  id: number
  parent_id: number
  name: string
  extra_event_times: boolean
  name_with_path: string
  market_name: string
  ancestry_depth: number
  pricing_tier_level: number
}

export interface SocialShareData {
  message_template: string
  twitter_name: string
}

export interface Theme {
  plugin_primary_button_color: string
  plugin_primary_button_text_color: string
  plugin_secondary_button_color: string
  plugin_secondary_button_text_color: string
  plugin_powered_by_evvnt: boolean
  plugin_font: null
  plugin_editors_pick_heading_text: string
  plugin_promoted_events_heading_text: string
  plugin_featured_events_heading_text: string
  plugin_other_events_heading_text: string
  plugin_featured_events_badge_text: string
  plugin_editors_pick_badge_text: string
  plugin_buy_tickets_badge_text: string
}

export interface EventsResponse {
  rawEvents: RawEvent[]
  rawFacets: RawFacet[]
  rawFeaturedEvents: RawFeaturedEvent[]
  presentRootCategoryIds: string[]
}

export interface RawEvent {
  summary: null | string
  contact: Contact | null
  description: null | string
  artists: null | string
  start_date: Date
  online_only: boolean
  title: string
  keywords: null | string
  images: Image[] | ImagesClass
  start_time_i: number
  _snippetResult?: SnippetResult
  category_path_ids: number[]
  end_time_i: number
  category_ids: number[]
  source_id_s: string
  editorial_pick_publisher_ids: any[]
  links: Links
  country: RawEventCountry
  editorial_tools_publisher_ids_filter: Array<EditorialToolsPublisherIDSFilterEnum | number>
  _highlightResult: HighlightResult
  root_category_ids: number[]
  sources: Source[]
  prices: Prices | null
  created_time_i: number
  premium: boolean
  hashtag: null | string
  featured_publisher_ids: number[]
  category_names_with_ids: string[]
  editorial_publisher_ids: any[]
  start_time: Date
  end_time: Date
  venue: RawEventVenue
  sub_brand: null
  source_id: number
  event_parent_id: number | null
  objectID: string
  main_category_path: number[]
  'has_evvnt_ticketing?': boolean
  source_broadcast_url: null | string
  original_links: Links
}

export interface HighlightResult {
  title: Artists
  summary?: Artists
  hashtag?: Artists
  artists?: Artists
  keywords?: Artists
  country: HighlightResultCountry
  category_name: Artists
  publishing_times?: { [key: string]: Artists }
  description?: Artists
  city_country: Artists
  venue: HighlightResultVenue
  organiser_name?: Artists
}

export interface Artists {
  value: string
  matchLevel: MatchLevel
  matchedWords: any[]
}

export enum MatchLevel {
  None = 'none',
}

export interface HighlightResultCountry {
  name: Artists
}

export interface HighlightResultVenue {
  name: Artists
  address_1: Artists
  town: Artists
  post_code?: Artists
}

export interface SnippetResult {
  summary?: Description
  description: Description
}

export interface Description {
  value: string
  matchLevel: MatchLevel
}

export interface Contact {
  name: string
  email: string
  tel: string
}

export interface RawEventCountry {
  iso_code: ISOCode
  name: Name
  region: Region
  subregion: Subregion
}

export enum ISOCode {
  Us = 'US',
}

export enum Name {
  UnitedStates = 'United States',
}

export enum Region {
  Americas = 'Americas',
}

export enum Subregion {
  NorthernAmerica = 'Northern America',
}

export enum EditorialToolsPublisherIDSFilterEnum {
  Backfill = 'backfill',
  NonBackfill = 'non_backfill',
}

export interface Image {
  id: number
  original: PurpleOriginal
  featured: FeaturedClass
  list_thumb: FeaturedClass
  hero: FeaturedClass
  featured_webp: FeaturedClass
  list_thumb_webp: FeaturedClass
  hero_webp: FeaturedClass
}

export interface FeaturedClass {
  url: string
}

export interface PurpleOriginal {
  url: string
  width: number
  height: number
}

export interface ImagesClass {
  original: FeaturedClass
}

export interface Links {
  Website?: string
  Tickets?: string
  Virtual?: string
}

export interface Prices {
  'General Admission'?: string
  Registration?: string
  'General Admission Live'?: string
  'Dermoscopy Workshop (Tues-Thurs)'?: string
  'Physicians (MD, DO, MBBS)'?: string
  'RN, NP, PA, Other'?: string
  'Students, Residents, Fellows'?: string
  'Practicing Physician/Industry'?: string
  'Military/Retired/Scientist/VA'?: string
  'PA/Nurse'?: string
  'Resident/Fellow'?: string
  Technologist?: string
  'Kaiser Permanente Physician Fee'?: string
  'Physician Registration Fee'?: string
  'Non-Physician Registration Fee'?: string
  'Military/Retired'?: string
  'PA/NP/Nurse'?: string
  Technologists?: string
  '5K Run / Walk'?: string
  'Half Mile Keiki Dash'?: string
}

export enum Source {
  Bandsintown = 'bandsintown',
  Evvnt = 'evvnt',
  RunSignUp = 'run_sign_up',
}

export interface RawEventVenue {
  name: string
  address_1: string
  address_2: null
  town: string
  country: Name
  post_code: null | string
  latitude: number
  longitude: number
}

export interface RawFacet {
  name: string
  data: { [key: string]: number }
  exhaustive: boolean
  stats?: Stats
}

export interface Stats {
  min: number
  max: number
  avg: number
  sum: number
}

export interface RawFeaturedEvent {
  source_broadcast_url: string
  sub_brand: null
  editorial_pick_publisher_ids: any[]
  category_path_ids: number[]
  start_date: Date
  editorial_tools_publisher_ids_filter: Array<EditorialToolsPublisherIDSFilterEnum | number>
  premium: boolean
  'has_evvnt_ticketing?': boolean
  _snippetResult: SnippetResult
  prices: Prices
  event_parent_id: number
  editorial_publisher_ids: any[]
  root_category_ids: number[]
  end_time_i: number
  category_ids: number[]
  keywords: string
  source_id_s: string
  created_time_i: number
  objectID: string
  online_only: boolean
  source_id: number
  _highlightResult: HighlightResult
  description: string
  category_names_with_ids: string[]
  start_time_i: number
  featured_publisher_ids: number[]
  links: Links
  venue: RawEventVenue
  sources: Source[]
  summary: string
  title: string
  hashtag: string
  artists: string
  images: Image[]
  original_links: Links
  contact: Contact
  country: RawEventCountry
  start_time: Date
  end_time: Date
  main_category_path: number[]
}
