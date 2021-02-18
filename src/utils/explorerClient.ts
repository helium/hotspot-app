/* eslint-disable import/prefer-default-export */
import * as Logger from './logger'

const makeRequest = async (url: string, opts: RequestInit) => {
  Logger.breadcrumb(`request: ${opts.method} ${url}`)
  try {
    const route = ['https://explorer.helium.com/api', url].join('/')

    const response = await fetch(route, {
      ...opts,
      headers: {
        ...opts.headers,
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = new Error(
        `Bad response, status:${response.status} message:${response.statusText}`,
      )
      Logger.error(error)
      throw error
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
    Logger.error(error)
    throw error
  }
}

export const getExplorer = async (url: string) =>
  makeRequest(url, {
    method: 'GET',
  })

export const ensLookup = async (name: string) => getExplorer(`ens/${name}`)
