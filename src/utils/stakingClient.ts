import Config from 'react-native-config'

const makeRequest = async (url: string, opts: RequestInit = {}) => {
  try {
    const route = [Config.STAKING_API_BASE_URL, url].join('/')

    const response = await fetch(route, {
      ...opts,
      headers: {
        ...opts.headers,
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        Authorization: Config.STAKING_TOKEN,
      },
    })
    const json = await response.json()
    return json.data || json
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getStaking = async (url: string) => makeRequest(url)

export const postStaking = async (url: string, data: unknown) =>
  makeRequest(url, { method: 'POST', body: JSON.stringify(data) })
