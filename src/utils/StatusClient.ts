import * as Logger from './logger'

export const HELIUM_STATUS_URL = 'http://status.helium.com'
const STATUS_API_BASE_URL = 'https://0m1ljfvm0g6j.statuspage.io/api/v2'

const breadcrumbOpts = { type: 'HTTP Request', category: 'statusClient' }

const makeRequest = async (url: string, opts: RequestInit = {}) => {
  Logger.breadcrumb(`httpRequest ${opts.method} ${url}`, breadcrumbOpts)
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

    if (!response.ok) {
      const errorMessage = `Bad response, status:${response.status} message:${response.statusText}`
      Logger.breadcrumb(errorMessage, breadcrumbOpts)
      throw new Error(errorMessage)
    }

    const text = await response.text()
    try {
      return JSON.parse(text)
    } catch (err) {
      throw new Error(text)
    }
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Logger.breadcrumb(error)
    throw error
  }
}

export const getIncidents = async () => makeRequest('incidents/unresolved.json')
