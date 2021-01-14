import Client, {
  AnyTransaction,
  PendingTransaction,
  ResourceList,
} from '@helium/http'
import {
  HotspotActivityFilters,
  HotspotActivityType,
} from '../features/hotspots/root/hotspotTypes'
import {
  FilterType,
  Filters,
  FilterKeys,
} from '../features/wallet/root/walletTypes'
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

export const getBlockHeight = () => client.blocks.getHeight()

export const submitTransaction = async (serializedTxn: string) =>
  client.transactions.submit(serializedTxn)

export const getCurrentOraclePrice = async () => client.oracle.getCurrentPrice()

export const getAccountTxnsList = async (filterType: FilterType) => {
  const address = await getSecureItem('address')
  if (!address) return

  if (filterType === 'pending') {
    return client.account(address).pendingTransactions.list()
  }

  const params = { filterTypes: Filters[filterType] }
  return client.account(address).activity.list(params)
}

export const getHotspotActivityList = async (
  gateway: string,
  filterType: HotspotActivityType,
) => {
  const address = await getSecureItem('address')
  if (!address) return

  const params = { filterTypes: HotspotActivityFilters[filterType] }
  return client.hotspot(gateway).activity.list(params)
}

export const txnFetchers = {} as Record<
  FilterType,
  ResourceList<AnyTransaction | PendingTransaction>
>

export const initFetchers = async () => {
  const lists = await Promise.all(
    FilterKeys.map((key) => getAccountTxnsList(key)),
  )
  FilterKeys.forEach((key, index) => {
    const fetcher = lists[index]
    if (!fetcher) return
    txnFetchers[key] = fetcher
  })
}

export default client
