export const env = window.dmAPI?.getCurrentEnvironment?.() ?? 'preview'
export const isDevSimulation = localStorage.getItem('this-week-local-dev') === 'yes'
export const isProdSimulation = localStorage.getItem('this-week-local-prod-sim') === 'yes'

export const siteID = window.dmAPI?.getSiteName?.()
export const deviceType = window.dmAPI?.getCurrentDeviceType?.()
