import Config from 'react-native-config'
import { getWalletApiToken } from './secureAccount'

const makeRequest = async (url: string, opts: RequestInit) => {
  try {
    const token = await getWalletApiToken()
    if (!token) {
      console.log('no token')
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
    const json = await response.json()
    return json.data || json
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getWallet = async (url: string) =>
  makeRequest(url, {
    method: 'GET',
  })

export const postWallet = async (url: string, data: unknown) =>
  makeRequest(url, {
    method: 'POST',
    body: JSON.stringify(data),
  })
