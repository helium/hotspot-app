import Client, {
  AnyTransaction,
  Hotspot,
  PendingTransaction,
  ResourceList,
  Bucket,
  NaturalDate,
} from '@helium/http'
import { Transaction } from '@helium/transactions'
import {
  HotspotActivityFilters,
  HotspotActivityType,
} from '../features/hotspots/root/hotspotTypes'
import {
  FilterKeys,
  Filters,
  FilterType,
} from '../features/wallet/root/walletTypes'
import { getSecureItem } from './secureAccount'

const MAX = 100000
const client = new Client()

export const configChainVars = async () => {
  const vars = await client.vars.get()
  Transaction.config(vars)
}

export const getAddress = async () => {
  return getSecureItem('address')
}

export const getHotspots = async () => {
  const address = await getAddress()
  if (!address) return []

  const newHotspotList = await client.account(address).hotspots.list()
  return newHotspotList.takeJSON(1000)
}

export const getHotspotDetails = async (address: string): Promise<Hotspot> => {
  const { data } = await client.hotspots.get(address)
  return data
}

export const getHotspotRewardsSum = async (
  address: string,
  numDaysBack: number,
  date: Date = new Date(),
) => {
  const endDate = new Date(date)
  endDate.setDate(date.getDate() - numDaysBack)
  const { data } = await client.hotspot(address).rewards.getSum(endDate, date)
  return data
}

export const getHotspotRewards = async (
  address: string,
  numDaysBack: number,
  date: Date = new Date(),
) => {
  const endDate = new Date(date)
  endDate.setDate(date.getDate() - numDaysBack)
  const list = await client
    .hotspot(address)
    .rewards.list({ minTime: endDate, maxTime: date })
  return list.take(MAX)
}

export const getHotspotWitnesses = async (address: string) => {
  const list = await client.hotspot(address).witnesses.list()
  return list.take(MAX)
}

export const getHotspotWitnessSums = async (params: {
  address: string
  bucket: Bucket
  minTime: Date | NaturalDate
  maxTime?: Date | NaturalDate
}) => {
  const list = await client.hotspot(params.address).witnesses.listSums({
    minTime: params.minTime,
    maxTime: params.maxTime,
    bucket: params.bucket,
  })
  return list.take(MAX)
}

export const getAccount = async (address?: string) => {
  const accountAddress = address || (await getAddress())
  if (!accountAddress) return

  const { data } = await client.accounts.get(accountAddress)
  return data
}

export const getBlockHeight = () => client.blocks.getHeight()

export const submitTransaction = async (serializedTxn: string) =>
  client.transactions.submit(serializedTxn)

export const getCurrentOraclePrice = async () => client.oracle.getCurrentPrice()

export const getPredictedOraclePrice = async () =>
  client.oracle.getPredictedPrice()

export const getAccountTxnsList = async (filterType: FilterType) => {
  const address = await getAddress()
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
  const address = getAddress()
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
