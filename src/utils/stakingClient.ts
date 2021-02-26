import Config from 'react-native-config'
import * as Logger from './logger'

const makeRequest = async (url: string, opts: RequestInit = {}) => {
  try {
    const route = [Config.STAKING_API_BASE_URL, url].join('/')

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
      const json = JSON.parse(text)
      return json.data || json
    } catch (err) {
      throw new Error(text)
    }
  } catch (error) {
    Logger.breadcrumb(error)
    throw error
  }
}

export const getStaking = async (url: string) => makeRequest(url)

export const postStaking = async (url: string, data: unknown) =>
  makeRequest(url, { method: 'POST', body: data ? JSON.stringify(data) : null })
