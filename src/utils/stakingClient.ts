import Config from 'react-native-config'
import * as Logger from './logger'

export type Maker = {
  id: number
  name: string
  address: string
  locationNonceLimit: number
  createdAt: string
  updatedAt: string
}

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

export const getMakers = async (): Promise<Maker[]> => {
  return makeRequest('makers')
}

export const getMakerName = (accountAddress: string, makers?: Maker[]) => {
  if (!makers) return ''
  const makerMatchIndex = makers.findIndex(
    (m: { address: string }) => m.address === accountAddress,
  )
  return makerMatchIndex !== -1 ? makers[makerMatchIndex].name : ''
}

export const getMakerSupportEmail = (makerId?: number): string => {
  switch (makerId) {
    default:
    case 1:
    case 2:
    case 3:
      return 'support@helium.com'
    case 4:
      return 'support@nebra.com'
    case 5:
      return 'support@syncrob.it'
    case 6:
      return 'support@bobcatminer.com'
    case 7:
      return 'support@longap.com'
  }
}
