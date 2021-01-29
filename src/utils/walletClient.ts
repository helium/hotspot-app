import Config from 'react-native-config'
import { getWalletApiToken } from './secureAccount'
import * as Logger from './logger'

const makeRequest = async (url: string, opts: RequestInit) => {
  try {
    const token = await getWalletApiToken()
    if (!token) {
      Logger.breadcrumb('no token')
      throw new Error('no token')
    }

    const route = [Config.WALLET_API_BASE_URL, url].join('/')

    const response = await fetch(route, {
      ...opts,
      headers: {
        ...opts.headers,
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        Authorization: token,
      },
    })
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

export const getWallet = async (url: string) =>
  makeRequest(url, {
    method: 'GET',
  })

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
