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
    const text = await response.text()
    try {
      const json = JSON.parse(text)
      return json.data || json
    } catch (err) {
      return text
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getStaking = async (url: string) => makeRequest(url)

export const postStaking = async (url: string, data: unknown) =>
  makeRequest(url, { method: 'POST', body: data ? JSON.stringify(data) : null })
