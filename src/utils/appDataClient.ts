import Client, {
  Bucket,
  Hotspot,
  NaturalDate,
  Network,
  PocReceiptsV2,
  Validator,
} from '@helium/http'
import { Transaction } from '@helium/transactions'
import { Platform } from 'react-native'
import Config from 'react-native-config'
import { getVersion } from 'react-native-device-info'
import { subDays } from 'date-fns'
import {
  HotspotActivityFilters,
  HotspotActivityType,
} from '../features/hotspots/root/hotspotTypes'
import { getSecureItem } from './secureAccount'
import { fromNow } from './timeUtils'
import * as Logger from './logger'

const MAX = 100000
const userAgent = `helium-hotspot-app-${getVersion()}-${Platform.OS}-js-client`

const baseURL = Config.HTTP_CLIENT_PROXY_URL

// default network to production until we have a wallet api token for the proxy
let client = new Client(Network.production, {
  retry: 1,
  name: userAgent,
  userAgent,
})

export const updateClient = ({
  networkName,
  retryCount,
  token,
  proxyEnabled,
}: {
  networkName?: string
  retryCount: number
  token?: string
  proxyEnabled?: boolean
}) => {
  const headers = { network: networkName } as Record<string, string>
  if (token) {
    headers.Authorization = token
  }
  let network = networkName === 'helium' ? Network.production : Network.stakejoy
  if (proxyEnabled) {
    network = new Network({ baseURL, version: 1 })
  }
  client = new Client(network, {
    retry: retryCount,
    name: userAgent,
    headers,
    userAgent,
  })
}

const breadcrumbOpts = { type: 'HTTP Request', category: 'appDataClient' }

export const configChainVars = async () => {
  Logger.breadcrumb('configChainVars', breadcrumbOpts)
  const vars = await client.vars.getTransactionVars()
  Transaction.config(vars)
}

export const getChainVars = async (keys?: string[]) => {
  Logger.breadcrumb('getChainVars', breadcrumbOpts)
  return client.vars.get(keys)
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
  return newHotspotList.takeJSON(MAX)
}

export const getValidators = async () => {
  Logger.breadcrumb('getValidators', breadcrumbOpts)
  const address = await getAddress()
  if (!address) return []

  const newValidatorsList = await client.account(address).validators.list()
  return newValidatorsList.takeJSON(MAX)
}

export const searchValidators = async (searchTerm: string) => {
  Logger.breadcrumb('searchValidators', breadcrumbOpts)
  const newValidatorList = await client.validators.search(searchTerm)
  return newValidatorList.takeJSON(MAX)
}

export const getElectedValidators = async () => {
  Logger.breadcrumb('getElectedValidators ', breadcrumbOpts)
  const electedValidatorList = await client.validators.elected()
  return electedValidatorList.takeJSON(MAX)
}

export const getValidatorActivityList = async (
  address: string,
  type = 'rewards_v2',
) => {
  Logger.breadcrumb('getValidatorActivity', breadcrumbOpts)
  const params = { filterTypes: [type] }
  return (await client.validator(address).activity.list(params)).takeJSON(MAX)
}

export const getElections = async () => {
  Logger.breadcrumb('getElections ', breadcrumbOpts)
  return client.elections.list()
}

export const getHotspotsForHexId = async (hexId: string) => {
  const hotspotsList = await client.hotspots.hex(hexId)
  return hotspotsList.takeJSON(MAX)
}

export const searchHotspots = async (searchTerm: string) => {
  Logger.breadcrumb('searchHotspots', breadcrumbOpts)
  const address = await getAddress()
  if (!address) return []

  const newHotspotList = await client.hotspots.search(searchTerm)
  return newHotspotList.takeJSON(MAX)
}

export const getValidatorDetails = async (
  address: string,
): Promise<Validator> => {
  Logger.breadcrumb('getValidatorDetails', breadcrumbOpts)
  return client.validators.get(address)
}

export const getHotspotDetails = async (address: string): Promise<Hotspot> => {
  Logger.breadcrumb('getHotspotDetails', breadcrumbOpts)
  return client.hotspots.get(address)
}

export const getHotspotDenylists = async (
  address: string,
): Promise<string[]> => {
  Logger.breadcrumb('getHotspotDenylistDetails', breadcrumbOpts)
  try {
    const denylistResponse = await (
      await fetch(`https://denylist-api.herokuapp.com/api/hotspots/${address}`)
    ).json()
    return denylistResponse.denylists
  } catch (e) {
    Logger.error(e)
    return []
  }
}

const getRewardsRange = (numDaysBack: number) => {
  const startOfToday = new Date()
  startOfToday.setUTCHours(0, 0, 0, 0)
  const maxTime = startOfToday
  const minTime = subDays(startOfToday, numDaysBack)
  return { maxTime, minTime }
}

export const getValidatorRewards = async (
  address: string,
  numDaysBack: number,
  bucket: Bucket = 'day',
) => {
  Logger.breadcrumb('getValidatorRewards', breadcrumbOpts)
  const list = await client
    .validator(address)
    .rewards.sum.list({ ...getRewardsRange(numDaysBack), bucket })
  return list.take(MAX)
}

export const getHotspotRewards = async (
  address: string,
  numDaysBack: number,
  bucket: Bucket = 'day',
) => {
  Logger.breadcrumb('getHotspotRewards', breadcrumbOpts)

  const list = await client
    .hotspot(address)
    .rewards.sum.list({ ...getRewardsRange(numDaysBack), bucket })
  return list.take(MAX)
}

export const getHotspotWitnesses = async (address: string) => {
  Logger.breadcrumb('getHotspotWitnesses', breadcrumbOpts)
  const list = await client.hotspot(address).witnesses.list()
  return list.take(MAX)
}

export const getWitnessedHotspots = async (address: string) => {
  Logger.breadcrumb('getWitnessedHotspots', breadcrumbOpts)
  const list = await client.hotspot(address).witnessed.list()
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

export const getBlockHeight = (params?: { maxTime?: string }) => {
  Logger.breadcrumb('getBlockHeight', breadcrumbOpts)
  return client.blocks.getHeight(params)
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
      filterTypes: ['poc_receipts_v1', 'poc_receipts_v2', 'poc_request_v1'],
    })
  const [lastHotspotActivity] = hotspotActivityList
    ? await hotspotActivityList?.take(1)
    : []
  if (lastHotspotActivity && lastHotspotActivity.time) {
    const dateLastActive = new Date(lastHotspotActivity.time * 1000)
    return {
      block: (lastHotspotActivity as PocReceiptsV2).height,
      text: fromNow(dateLastActive)?.toUpperCase(),
    }
  }
  return {}
}
