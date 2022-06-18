import Config from 'react-native-config'
import qs from 'qs'
import { Platform } from 'react-native'
import { getVersion } from 'react-native-device-info'
import { getWalletApiToken } from './secureAccount'
import * as Logger from './logger'

const breadcrumbOpts = { type: 'HTTP Request', category: 'walletClient' }

const userAgent = `helium-hotspot-app-${getVersion()}-${
  Platform.OS
}-wallet-client`
const network = 'helium'

const makeRequest = async (
  url: string,
  opts: RequestInit & { showCursor?: boolean },
) => {
  Logger.breadcrumb(`httpRequest ${opts.method} ${url}`, breadcrumbOpts)
  try {
    const token = await getWalletApiToken()
    if (!token) {
      Logger.breadcrumb('no token', breadcrumbOpts)
      throw new Error('no token')
    }

    const baseUrl = Config.WALLET_API_BASE_URL
    const route = [baseUrl, url].join('/')

    const response = await fetch(route, {
      ...opts,
      headers: {
        ...opts.headers,
        network,
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        Authorization: token,
        'User-Agent': userAgent,
      },
    })

    if (!response.ok) {
      const errorMessage = `Bad response, status:${response.status} message:${response.statusText} ${opts.method} url:${route}`
      Logger.breadcrumb(errorMessage, breadcrumbOpts)
      throw new Error(errorMessage)
    }

    const text = await response.text()
    try {
      const json = JSON.parse(text)
      const responseData = json.data || json
      const data = opts.showCursor ? json : responseData
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      data.serverDate = response.headers.map?.date
      return data
    } catch (err) {
      return text
    }
  } catch (error) {
    Logger.breadcrumb('fetch failed', breadcrumbOpts)
    throw error
  }
}

type WalletOpts = {
  camelCase?: boolean
  showCursor?: boolean
}
export const getWallet = async (
  url: string,
  params?: unknown,
  { camelCase, showCursor } = {
    camelCase: false,
    showCursor: false,
  } as WalletOpts,
) => {
  let fullUrl = url
  if (params) {
    fullUrl += '?'
    fullUrl += qs.stringify(params)
  }
  const opts = {
    method: 'GET',
    showCursor,
  } as RequestInit
  if (camelCase) {
    opts.headers = { Accent: 'camel' }
  }
  return makeRequest(fullUrl, opts)
}

export const postWallet = async (
  url: string,
  data?: unknown,
  { camelCase } = { camelCase: false },
) => {
  const opts = {
    method: 'POST',
    body: data ? JSON.stringify(data) : null,
  } as RequestInit
  if (camelCase) {
    opts.headers = { Accent: 'camel' }
  }

  return makeRequest(url, opts)
}

export const deleteWallet = async (
  url: string,
  data?: unknown,
  { camelCase } = { camelCase: false },
) => {
  const opts = {
    method: 'DELETE',
    body: data ? JSON.stringify(data) : null,
  } as RequestInit
  if (camelCase) {
    opts.headers = { Accent: 'camel' }
  }

  return makeRequest(url, opts)
}

export const getWalletExt = async (url: string) => {
  Logger.breadcrumb(`httpRequest GET ${url}`, breadcrumbOpts)
  try {
    const baseUrl = Config.WALLET_API_BASE_URL.replace('/api', '/ext/api')
    const route = [baseUrl, url].join('/')

    const response = await fetch(route, {
      method: 'GET',
      headers: {
        network,
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        'User-Agent': userAgent,
      },
    })

    if (!response.ok) {
      const errorMessage = `Bad response, status:${response.status} message:${response.statusText} GET url:${route}`
      Logger.breadcrumb(errorMessage, breadcrumbOpts)
      throw new Error(errorMessage)
    }

    const text = await response.text()
    try {
      const json = JSON.parse(text)
      const responseData = json.data || json
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      responseData.serverDate = response.headers.map?.date
      return responseData
    } catch (err) {
      return text
    }
  } catch (error) {
    Logger.breadcrumb('fetch failed', breadcrumbOpts)
    throw error
  }
}
