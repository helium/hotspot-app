import Client from '@helium/http'
import { getSecureItem } from './secureAccount'

const client = new Client()

export const getHotspots = async () => {
  const address = await getSecureItem('address')
  if (!address) return []

  const newHotspotList = await client.account(address).hotspots.list()
  return newHotspotList.takeJSON(1000)
}

export const getHotspotDetails = async (address: string) => {
  const { data } = await client.hotspots.get(address)
  return data
}

export const getHotspotRewards = async (
  address: string,
  minTime: Date,
  maxTime: Date,
) => {
  const { data } = await client
    .hotspot(address)
    .rewards.getSum(minTime, maxTime)
  return data
}

export const getAccount = async () => {
  const address = await getSecureItem('address')
  if (!address) return

  const { data } = await client.accounts.get(address)
  return data
}

export const submitTransaction = async (serializedTxn: string) =>
  client.transactions.submit(serializedTxn)

export const getCurrentOraclePrice = async () => client.oracle.getCurrentPrice()

export const getPendingTxnList = async () => {
  const address = await getSecureItem('address')
  if (!address) return []
  const list = await client.account(address).pendingTransactions.list()
  return list.takeJSON(1000)
}

export const getAccountActivityList = async () => {
  const address = await getSecureItem('address')
  if (!address) return []
  const list = await client.account(address).activity.list()
  return list.takeJSON(1000)
}

export default client
