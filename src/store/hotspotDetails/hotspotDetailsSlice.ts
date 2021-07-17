import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Hotspot, Reward, Sum, Witness } from '@helium/http'
import {
  getHotspotDetails,
  getHotspotRewards,
  getHotspotRewardsSum,
  getHotspotWitnesses,
} from '../../utils/appDataClient'
import { calculatePercentChange } from '../../features/hotspots/details/RewardsHelper'
import {
  CacheRecord,
  handleCacheRejected,
  handleCachePending,
  handleCacheFulfilled,
  hasValidCache,
} from '../../utils/cacheUtils'

type FetchDetailsParams = {
  address: string
  numDays: number
}

export const fetchHotspotData = createAsyncThunk<HotspotData, string>(
  'hotspotDetails/fetchHotspotData',
  async (address: string, { getState }) => {
    const currentState = (getState() as {
      hotspotDetails: {
        hotspotData: HotspotIndexed<HotspotDetailCache>
      }
    }).hotspotDetails
    const hotspotData = currentState.hotspotData[address] || {}
    if (hasValidCache(hotspotData)) {
      return hotspotData
    }
    const data = await Promise.all([
      getHotspotDetails(address),
      getHotspotWitnesses(address),
    ])
    return {
      hotspot: data[0],
      witnesses: data[1],
    }
  },
)

export const fetchHotspotChartData = createAsyncThunk<
  HotspotChartData,
  FetchDetailsParams
>(
  'hotspotDetails/fetchHotspotChartData',
  async (params: FetchDetailsParams, { getState }) => {
    const currentState = (getState() as {
      hotspotDetails: {
        chartData: HotspotIndexed<HotspotChartRecord>
      }
    }).hotspotDetails
    const chartData = currentState.chartData[params.address] || {}
    const details = chartData[params.numDays]
    if (hasValidCache(details)) {
      throw new Error('Data already fetched')
    }
    const startDate = new Date()
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() - params.numDays)
    const data = await Promise.all([
      getHotspotRewardsSum(params.address, params.numDays),
      getHotspotRewardsSum(params.address, params.numDays, endDate),
      getHotspotRewards(params.address, params.numDays),
    ])
    const rewardSum = data[0]
    const pastRewardSum = data[1]
    const rewards = data[2]
    return {
      rewardSum,
      rewards,
      rewardsChange: calculatePercentChange(
        rewardSum.total,
        pastRewardSum.total,
      ),
    }
  },
)

type HotspotChartData = {
  rewardSum?: Sum
  rewards?: Reward[]
  rewardsChange?: number
}

type HotspotData = {
  witnesses?: Witness[]
  hotspot?: Hotspot
}

export type HotspotChartCache = CacheRecord<HotspotChartData>
export type HotspotDetailCache = CacheRecord<HotspotData>
export type HotspotAddress = string
export type ChartTimelineIndex = number
export type HotspotChartRecord = Record<ChartTimelineIndex, HotspotChartCache>
export type HotspotIndexed<T> = Record<HotspotAddress, T>

type HotspotDetailsState = {
  chartData: HotspotIndexed<HotspotChartRecord>
  hotspotData: HotspotIndexed<HotspotDetailCache>
  showSettings: boolean
  showMapFilter: boolean
}
const initialState: HotspotDetailsState = {
  chartData: {},
  hotspotData: {},
  showSettings: false,
  showMapFilter: false,
}

// This slice contains data related to hotspot details
const hotspotDetailsSlice = createSlice({
  name: 'hotspotDetails',
  initialState,
  reducers: {
    toggleShowSettings: (state) => ({
      ...state,
      showSettings: !state.showSettings,
    }),
    toggleShowMapFilter: (state) => ({
      ...state,
      showMapFilter: !state.showMapFilter,
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(fetchHotspotChartData.pending, (state, action) => {
      const { address, numDays } = action.meta.arg
      const prevDetails = state.chartData[address] || {}
      const prevState = prevDetails[numDays] || {}
      const nextState = handleCachePending(prevState)
      state.chartData[address] = {
        ...state.chartData[address],
        [numDays]: nextState,
      }
    })
    builder.addCase(fetchHotspotChartData.fulfilled, (state, action) => {
      const { address, numDays } = action.meta.arg
      state.chartData[address][numDays] = handleCacheFulfilled(action.payload)
    })
    builder.addCase(fetchHotspotChartData.rejected, (state, action) => {
      const { address, numDays } = action.meta.arg
      const prevDetails = state.chartData[address] || {}
      const prevState = prevDetails[numDays] || {}
      const nextState = handleCacheRejected(prevState)
      state.chartData[address] = {
        ...state.chartData[address],
        [numDays]: nextState,
      }
    })
    builder.addCase(fetchHotspotData.pending, (state, action) => {
      const address = action.meta.arg
      const prevState = state.hotspotData[address] || {}
      const nextState = handleCachePending(prevState)
      state.hotspotData[address] = {
        ...state.hotspotData[address],
        ...nextState,
      }
    })
    builder.addCase(fetchHotspotData.fulfilled, (state, action) => {
      const address = action.meta.arg
      state.hotspotData[address] = handleCacheFulfilled(action.payload)
    })
    builder.addCase(fetchHotspotData.rejected, (state, action) => {
      const address = action.meta.arg
      const prevState = state.hotspotData[address] || {}
      const nextState = handleCacheRejected(prevState)
      state.hotspotData[address] = {
        ...state.hotspotData[address],
        ...nextState,
      }
    })
  },
})

export default hotspotDetailsSlice
