import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Sum } from '@helium/http'
import Balance, { CurrencyType, NetworkTokens } from '@helium/currency'
import { getDayOfYear } from 'date-fns'
import {
  getHotspotRewards,
  getValidatorRewards,
} from '../../utils/appDataClient'
import {
  CacheRecord,
  handleCacheRejected,
  handleCachePending,
  handleCacheFulfilled,
  hasValidCache,
} from '../../utils/cacheUtils'
import { getWallet, getWalletExt } from '../../utils/walletClient'

export type WalletReward = {
  avg: number
  gateway: string
  max: number
  median: number
  min: number
  stddev: number
  sum: number
  total: number
  updated_at: string
}

export type ChartTimelineValue = number | 'YTD'

type FetchDetailsParams = {
  address: string
  numDays: ChartTimelineValue
  resource: 'validators' | 'hotspots'
}

type GatewayChartData = {
  rewardSum?: Balance<NetworkTokens>
  rewards?: Sum[]
  rewardsChange?: number
}

export type NetworkHotspotEarnings = {
  avg_rewards: number
  consensus: number
  hotspot_count: number
  securities: number
  total: number
  date: string
}

export type GatewayChartCache = CacheRecord<GatewayChartData>
export type GatewayAddress = string
export type GatewayChartRecord = Record<ChartTimelineValue, GatewayChartCache>
export type GatewayIndex<T> = Record<GatewayAddress, T>

type RewardsState = {
  chartData: GatewayIndex<GatewayChartRecord>
  networkHotspotEarnings: CacheRecord<{ data: NetworkHotspotEarnings[] }>
  networkHotspotEarningsLoaded: boolean
}
const initialState: RewardsState = {
  chartData: {},
  networkHotspotEarnings: { lastFetchedTimestamp: 0, loading: false, data: [] },
  networkHotspotEarningsLoaded: false,
}

export const fetchNetworkHotspotEarnings = createAsyncThunk<
  NetworkHotspotEarnings[]
>('rewards/fetchNetworkHotspotEarnings', async (_arg, { getState }) => {
  const {
    rewards: { networkHotspotEarnings },
  } = (await getState()) as {
    rewards: RewardsState
  }
  if (hasValidCache(networkHotspotEarnings, 30))
    return networkHotspotEarnings.data

  return getWalletExt('hotspots/earnings')
})

export const fetchChartData = createAsyncThunk<
  GatewayChartData,
  FetchDetailsParams
>(
  'rewards/fetchChartData',
  async ({ address, numDays, resource }: FetchDetailsParams, { getState }) => {
    const currentState = (getState() as {
      rewards: {
        chartData: GatewayIndex<GatewayChartRecord>
      }
    }).rewards
    const chartData = currentState.chartData[address] || {}
    const details = chartData[numDays]
    if (hasValidCache(details)) {
      return details
    }

    if (numDays === 'YTD') {
      const response: WalletReward[] = await getWallet(`${resource}/rewards`, {
        addresses: address,
        dayRange: getDayOfYear(new Date()) - 1,
      })
      const selectedBalance = Balance.fromFloat(
        response[0].total,
        CurrencyType.networkToken,
      )
      return {
        rewardSum: selectedBalance,
      }
    }

    const startDate = new Date()
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() - numDays)
    const data: [WalletReward[], WalletReward[], Sum[]] = await Promise.all([
      getWallet(`${resource}/rewards`, {
        addresses: address,
        dayRange: numDays,
      }),
      getWallet(`${resource}/rewards`, {
        addresses: address,
        dayRange: numDays * 2,
      }),
      resource === 'hotspots'
        ? getHotspotRewards(address, numDays)
        : getValidatorRewards(address, numDays),
    ])
    const [selectedRange, fullRange, rewards] = data
    let rewardsChange = 0
    let selectedBalance = Balance.fromFloat(0, CurrencyType.networkToken)
    if (
      selectedRange &&
      selectedRange.length &&
      fullRange &&
      fullRange.length
    ) {
      selectedBalance = Balance.fromFloat(
        selectedRange[0].total,
        CurrencyType.networkToken,
      )
      const fullBalance = Balance.fromFloat(
        fullRange[0].total,
        CurrencyType.networkToken,
      )
      const previousBalance: Balance<NetworkTokens> = fullBalance.minus(
        selectedBalance,
      )
      if (
        previousBalance.integerBalance > 0 &&
        selectedBalance.integerBalance > 0
      ) {
        rewardsChange =
          ((selectedBalance.bigInteger.toNumber() -
            previousBalance.bigInteger.toNumber()) /
            previousBalance.bigInteger.toNumber()) *
          100
      }
    }

    return {
      rewardSum: selectedBalance,
      rewards,
      rewardsChange,
    }
  },
)

// This slice contains data related to rewards
const rewardsSlice = createSlice({
  name: 'rewards',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchChartData.pending, (state, action) => {
      const { address, numDays } = action.meta.arg
      if (hasValidCache(state.chartData[address]?.[numDays])) return

      const prevDetails = state.chartData[address] || {}
      const prevState = prevDetails[numDays] || {}
      const nextState = handleCachePending(prevState)
      state.chartData[address] = {
        ...state.chartData[address],
        [numDays]: nextState,
      }
    })
    builder.addCase(fetchChartData.fulfilled, (state, action) => {
      const { address, numDays } = action.meta.arg
      if (hasValidCache(state.chartData[address]?.[numDays])) return

      state.chartData[address][numDays] = handleCacheFulfilled(action.payload)
    })
    builder.addCase(fetchChartData.rejected, (state, action) => {
      const { address, numDays } = action.meta.arg
      if (hasValidCache(state.chartData[address]?.[numDays])) return

      const prevDetails = state.chartData[address] || {}
      const prevState = prevDetails[numDays] || {}
      const nextState = handleCacheRejected(prevState)
      state.chartData[address] = {
        ...state.chartData[address],
        [numDays]: nextState,
      }
    })
    builder.addCase(fetchNetworkHotspotEarnings.pending, (state, _action) => {
      state.networkHotspotEarnings.loading = true
    })
    builder.addCase(fetchNetworkHotspotEarnings.fulfilled, (state, action) => {
      state.networkHotspotEarnings = handleCacheFulfilled({
        data: action.payload,
      })
      state.networkHotspotEarningsLoaded = true
    })
    builder.addCase(fetchNetworkHotspotEarnings.rejected, (state, _action) => {
      state.networkHotspotEarnings.loading = false
      state.networkHotspotEarningsLoaded = true
    })
  },
})

export default rewardsSlice
