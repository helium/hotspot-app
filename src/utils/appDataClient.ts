import Client, {
  AnyTransaction,
  Hotspot,
  PendingTransaction,
  ResourceList,
  Bucket,
  NaturalDate,
} from '@helium/http'
import { Transaction } from '@helium/transactions'
import { format, subDays } from 'date-fns'
import { chunk } from 'lodash'
import { ChartData, ChartRange } from '../components/BarChart/types'
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
  return client.hotspots.get(address)
}

export const getHotspotRewardsSum = async (
  address: string,
  numDaysBack: number,
  date: Date = new Date(),
) => {
  const endDate = new Date(date)
  endDate.setDate(date.getDate() - numDaysBack)
  return client.hotspot(address).rewards.sum.get(endDate, date)
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
  maxTime?: Date | NaturalDate
}) => {
  const list = await client.hotspot(params.address).challenges.sum.list({
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

export const getRewardsChart = async (
  range: ChartRange,
): Promise<ChartData[]> => {
  const address = await getAddress()
  if (!address) return []

  if (range === 'daily') {
    const rewards = await (
      await client.account(address).rewards.sum.list({
        bucket: 'day',
        minTime: '-14 day',
      })
    ).take(1000)

    return rewards
      .map((r) => ({
        id: r.timestamp,
        up: r.total,
        down: 0,
        day: format(new Date(r.timestamp), 'E').slice(0, 2),
      }))
      .reverse()
  }

  if (range === 'weekly') {
    const rewards = await (
      await client.account(address).rewards.sum.list({
        bucket: 'week',
        minTime: '-12 week',
      })
    ).take(1000)

    return rewards
      .map((r) => ({
        id: r.timestamp,
        up: r.total,
        down: 0,
        day: format(new Date(r.timestamp), 'I'),
      }))
      .reverse()
  }

  if (range === 'monthly') {
    const rewards = await (
      await client.account(address).rewards.sum.list({
        bucket: 'day',
        minTime: '-360 day',
      })
    ).take(1000)

    return chunk(rewards.reverse(), 30).map((days) =>
      days.reduce(
        (acc, r) => {
          if (!acc.id) {
            acc.id = r.timestamp
            acc.up = r.total
            acc.day = format(new Date(r.timestamp), 'MMMMM')
            return acc
          }

          acc.up += r.total
          return acc
        },
        { id: '', up: 0, down: 0, day: '' } as ChartData,
      ),
    )
  }

  return []

  const date = subDays(new Date(), 14)
  const txns = await getAccountTxnsUntil(address, 'payment', date)
  console.log('txns', txns)
}

export const getAccountTxnsUntil = async (
  address,
  filterType: FilterType,
  time?: Date,
) => {
  const params = { filterTypes: Filters[filterType] }
  const list = await client.account(address).activity.list(params)
  // console.log('list', list)
  // const txns = []
  return list.take(20)

  // eslint-disable-next-line no-restricted-syntax
  // for await (const txn of list) {
  //   console.log('txn', txn)
  //   if (txns.length > 10) {
  //     break
  //   }

  //   txns.push(txn)
  // }
  // console.log('finsihed async loop')

  // return txns
}

export default client
