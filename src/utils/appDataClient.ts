import Client from '@helium/http'
import { getString } from './account'

const client = new Client()

export const fetchHotspots = async () => {
  const address = await getString('address')
  if (!address) return []

  const newHotspotList = await client.account(address).hotspots.list()
  return newHotspotList.takeJSON(1000)
}

export default client
