import { createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { DudaContextValue } from './@types/duda'

const DudaContext = createContext<DudaContextValue>({
  siteDetails: {
    device: 'desktop',
    page: 'home',
    inEditor: true,
    accountId: '',
    siteId: '',
    widgetId: '',
    widgetVersion: '-1',
    elementId: '',
    config: {},
    locale: 'en',
  },
  pageData: {
    business_name: '',
    slug: '',
    slogan: '',
    island: 'hawaii',
    created_at: '',
    updated_at: '',
    id: 0,
    description: '',
    primary_address: '',
    primary_email: '',
    primary_phone: '',
    primary_web_url: '',
    tier: 'basic',
    lat_lng: '',
    social_media: {},
    business_hours: [],
    main_image: '',
    logo: '',
    this_week_recommended: true,
    images: [],
    videos: [],
    booking_links: [],
  },
})

export const DudaProvider = DudaContext.Provider

export const useDudaContext = () => useContext(DudaContext)
