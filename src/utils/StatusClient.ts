import * as Logger from './logger'

export const HELIUM_STATUS_URL = 'http://status.helium.com'
const STATUS_API_BASE_URL = 'https://0m1ljfvm0g6j.statuspage.io/api/v2'

const makeRequest = async (url: string, opts: RequestInit = {}) => {
  try {
    const route = [STATUS_API_BASE_URL, url].join('/')
    const response = await fetch(route, {
      ...opts,
      headers: {
        ...opts.headers,
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
      },
    })
    const text = await response.text()
    try {
      return JSON.parse(text)
    } catch (err) {
      throw new Error(text)
    }
  } catch (error) {
    Logger.breadcrumb(error)
    throw error
  }
}

export const getStatus = async () => makeRequest('status.json')

export const getIncidents = async () => makeRequest('incidents/unresolved.json')
