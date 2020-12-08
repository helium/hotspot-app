import Config from 'react-native-config'

export const getStaking = async (url: string) => {
  try {
    const endpoint = [Config.STAKING_ENDPOINT, url].join('/')
    const response = await fetch(endpoint, {
      headers: {
        Authorization: Config.STAKING_TOKEN,
      },
    })

    const json = await response.json()
    return json.data
  } catch (error) {
    return null
  }
}

export const postStaking = async (url: string, data: unknown) => {
  try {
    const endpoint = Config.STAKING_ENDPOINT
    const response = await fetch([endpoint, url].join('/'), {
      method: 'POST',
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        Authorization: Config.STAKING_TOKEN,
      },
      body: JSON.stringify(data),
    })
    const json = await response.json()
    return json.data
  } catch (error) {
    return null
  }
}
