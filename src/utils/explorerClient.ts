import * as Logger from './logger'
import { EXPLORER_BASE_URL } from './config'

const makeRequest = async (url: string, opts: RequestInit) => {
  Logger.breadcrumb(`request: ${opts.method} ${url}`)
  try {
    const route = [`${EXPLORER_BASE_URL}/api`, url].join('/')

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
      Logger.breadcrumb(errorMessage)
      throw new Error(errorMessage)
    }

    const text = await response.text()
    try {
      const json = JSON.parse(text)
      return json.data || json
    } catch (err) {
      return text
    }
  } catch (error) {
    Logger.breadcrumb('fetch failed')
    throw error
  }
}

export const getExplorer = async (url: string) =>
  makeRequest(url, {
    method: 'GET',
  })

export const ensLookup = async (name: string) => getExplorer(`ens/${name}`)
