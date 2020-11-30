import Client from '@helium/http'
import { getString } from './account'

const client = new Client()

export const fetchHotspots = async () => {
  const address = await getString('address')
  if (!address) return

  const newHotspotList = await client.account(address).hotspots.listJson()
  const hotspots = await newHotspotList.take(1000)
  return hotspots
}

export default client
