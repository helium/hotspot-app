import Client, {
  AnyTransaction,
  Bucket,
  Hotspot,
  NaturalDate,
  PendingTransaction,
  PocReceiptsV1,
  ResourceList,
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
import { fromNow } from './timeUtils'
import * as Logger from './logger'

const MAX = 100000
const client = new Client()

const breadcrumbOpts = { type: 'HTTP Request', category: 'appDataClient' }

export const configChainVars = async () => {
  Logger.breadcrumb('configChainVars', breadcrumbOpts)
  const vars = await client.vars.get()
  Transaction.config(vars)
}

export const getChainVars = async () => {
  Logger.breadcrumb('getChainVars', breadcrumbOpts)
  return client.vars.get()
}

export const getAddress = async () => {
  Logger.breadcrumb('getAddress', breadcrumbOpts)
  return getSecureItem('address')
}

export const getHotspots = async () => {
  Logger.breadcrumb('getHotspots', breadcrumbOpts)
  const address = await getAddress()
  if (!address) return []

  const newHotspotList = await client.account(address).hotspots.list()
  return newHotspotList.takeJSON(1000)
}

export const getHotspotsForHexId = async (hexId: string) => {
  const hotspotsList = await client.hotspots.hex(hexId)
  return hotspotsList.takeJSON(1000)
}

export const searchHotspots = async (searchTerm: string) => {
  Logger.breadcrumb('searchHotspots', breadcrumbOpts)
  const address = await getAddress()
  if (!address) return []

  const newHotspotList = await client.hotspots.search(searchTerm)
  return newHotspotList.takeJSON(1000)
}

export const getHotspotDetails = async (address: string): Promise<Hotspot> => {
  Logger.breadcrumb('getHotspotDetails', breadcrumbOpts)
  return client.hotspots.get(address)
}

export const getHotspotRewardsSum = async (
  address: string,
  numDaysBack: number,
  date: Date = new Date(),
) => {
  Logger.breadcrumb('getHotspotRewardsSum', breadcrumbOpts)
  const endDate = new Date(date)
  endDate.setDate(date.getDate() - numDaysBack)
  return client.hotspot(address).rewards.sum.get(endDate, date)
}

export const getHotspotRewards = async (
  address: string,
  numDaysBack: number,
  date: Date = new Date(),
) => {
  Logger.breadcrumb('getHotspotRewards', breadcrumbOpts)
  const endDate = new Date(date)
  endDate.setDate(date.getDate() - numDaysBack)
  const list = await client
    .hotspot(address)
    .rewards.list({ minTime: endDate, maxTime: date })
  return list.take(MAX)
}

export const getHotspotWitnesses = async (address: string) => {
  Logger.breadcrumb('getHotspotWitnesses', breadcrumbOpts)
  const list = await client.hotspot(address).witnesses.list()
  return list.take(MAX)
}

export const getHotspotWitnessSums = async (params: {
  address: string
  bucket: Bucket
  minTime: Date | NaturalDate
  maxTime?: Date
}) => {
  Logger.breadcrumb('getHotspotWitnessSums', breadcrumbOpts)
  const list = await client.hotspot(params.address).witnesses.sum.list({
    minTime: params.minTime,
    maxTime: params.maxTime,
    bucket: params.bucket,
  })
  return list.take(MAX)
}

export const getHotspotChallengeSums = async (params: {
  address: string
  bucket: Bucket
  minTime: Date | NaturalDate
  maxTime?: Date
}) => {
  Logger.breadcrumb('getHotspotChallengeSums', breadcrumbOpts)
  const list = await client.hotspot(params.address).challenges.sum.list({
    minTime: params.minTime,
    maxTime: params.maxTime,
    bucket: params.bucket,
  })
  return list.take(MAX)
}

export const getAccount = async (address?: string) => {
  Logger.breadcrumb('getAccount', breadcrumbOpts)
  const accountAddress = address || (await getAddress())
  if (!accountAddress) return

  const { data } = await client.accounts.get(accountAddress)
  return data
}

export const getBlockHeight = () => {
  Logger.breadcrumb('getBlockHeight', breadcrumbOpts)
  return client.blocks.getHeight()
}

export const getBlockStats = () => {
  Logger.breadcrumb('getBlockStats', breadcrumbOpts)
  return client.blocks.stats()
}

export const getStatCounts = () => {
  Logger.breadcrumb('getStatCounts', breadcrumbOpts)
  return client.stats.counts()
}

export const getCurrentOraclePrice = async () => {
  Logger.breadcrumb('getCurrentOraclePrice', breadcrumbOpts)
  return client.oracle.getCurrentPrice()
}

export const getPredictedOraclePrice = async () => {
  Logger.breadcrumb('getPredictedOraclePrice', breadcrumbOpts)
  return client.oracle.getPredictedPrice()
}

export const getAccountTxnsList = async (filterType: FilterType) => {
  Logger.breadcrumb('getAccountTxnsList', breadcrumbOpts)
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
  Logger.breadcrumb('getHotspotActivityList', breadcrumbOpts)
  const params = { filterTypes: HotspotActivityFilters[filterType] }
  return client.hotspot(gateway).activity.list(params)
}

export const getHotspotsLastChallengeActivity = async (
  gatewayAddress: string,
) => {
  Logger.breadcrumb('getHotspotsLastChallengeActivity', breadcrumbOpts)
  const hotspotActivityList = await client
    .hotspot(gatewayAddress)
    .activity.list({
      filterTypes: ['poc_receipts_v1', 'poc_request_v1'],
    })
  const [lastHotspotActivity] = hotspotActivityList
    ? await hotspotActivityList?.take(1)
    : []
  if (lastHotspotActivity && lastHotspotActivity.time) {
    const dateLastActive = new Date(lastHotspotActivity.time * 1000)
    return {
      block: (lastHotspotActivity as PocReceiptsV1).height,
      text: fromNow(dateLastActive)?.toUpperCase(),
    }
  }
  return {}
}

export const txnFetchers = {} as Record<
  FilterType,
  ResourceList<AnyTransaction | PendingTransaction>
>

export const initFetchers = async () => {
  Logger.breadcrumb('initFetchers', breadcrumbOpts)
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
