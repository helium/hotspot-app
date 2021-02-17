import Config from 'react-native-config'
import qs from 'qs'
import { getWalletApiToken } from './secureAccount'
import * as Logger from './logger'

const makeRequest = async (url: string, opts: RequestInit) => {
  Logger.breadcrumb(`request: ${opts.method} ${url}`)
  try {
    const token = await getWalletApiToken()
    if (!token) {
      Logger.breadcrumb('no token')
      throw new Error('no token')
    }

    const route = [Config.WALLET_API_BASE_URL, url].join('/')
    // const route = ['http://localhost:4000/api', url].join('/')

    const response = await fetch(route, {
      ...opts,
      headers: {
        ...opts.headers,
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        Authorization: token,
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

export const getWallet = async (url: string, params?: unknown) => {
  let fullUrl = url
  if (params) {
    fullUrl += '?'
    fullUrl += qs.stringify(params)
  }
  return makeRequest(fullUrl, {
    method: 'GET',
  })
}

export const postWallet = async (url: string, data?: unknown) =>
  makeRequest(url, {
    method: 'POST',
    body: data ? JSON.stringify(data) : null,
  })

export const deleteWallet = async (url: string, data?: unknown) =>
  makeRequest(url, {
    method: 'DELETE',
    body: data ? JSON.stringify(data) : null,
  })
