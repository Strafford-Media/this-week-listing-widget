import { Ad } from '../@types/thisweek'
import { env, isDevSimulation, isProdSimulation } from './environment'
import { getFunctionsUrl } from './urls'

interface RegisterEventArgs {
  event: 'view' | 'click'
  placement_identifier?: string
  ad: Ad | null
}

const shouldRegister = env === 'live' || isDevSimulation || isProdSimulation

export const registerEvent = async ({ ad, event, placement_identifier }: RegisterEventArgs) => {
  if (!ad || !shouldRegister) return

  // interact with local storage to determine uniqueness
  const uniqueKey = `${ad.id}-${ad.link}-${event}-${placement_identifier}`
  const unique = !localStorage.getItem(uniqueKey)

  if (unique) {
    localStorage.setItem(uniqueKey, '1')
  }

  // send to server
  const functions = getFunctionsUrl()

  fetch(`${functions}/ad-event`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      event_type: event,
      placement_identifier,
      adId: ad.id,
      url: window.location.href,
      cycleId: ad.cycleId,
      unique,
    }),
  }).catch((err) => console.error(err))
}
