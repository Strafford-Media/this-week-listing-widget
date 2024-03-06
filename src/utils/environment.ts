export const env = (window as any).dmAPI?.getCurrentEnvironment?.() ?? 'preview'
export const isDevSimulation = localStorage.getItem('this-week-local-dev') === 'yes'
export const isProdSimulation = localStorage.getItem('this-week-local-prod-sim') === 'yes'

export const siteID = (window as any).dmAPI?.getSiteName?.()
export const deviceType = (window as any).dmAPI?.getCurrentDeviceType?.()
