import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Bucket, Hotspot, Reward, Sum } from '@helium/http'
import {
  getHotspotChallengeSums,
  getHotspotDetails,
  getHotspotRewards,
  getHotspotRewardsSum,
  getHotspotWitnesses,
  getHotspotWitnessSums,
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

const getMissingHourlyValue = (i: number, arr: Sum[]) => {
  const averages = arr.map((w) => w.avg)
  const lastNonZero = averages
    .slice(0, i)
    .filter((a) => a > 0)
    .pop()
  const nextNonZero = averages.slice(i).filter((a) => a > 0)[0]
  return lastNonZero || nextNonZero || 0
}

const fillMissingHourlyValues = (array: Sum[]) => {
  array.forEach((sum, i) => {
    if (sum.avg === 0) {
      sum.avg = getMissingHourlyValue(i, array)
    }
  })
}

const fetchHotspotWitnessSums = async (
  params: FetchDetailsParams,
  today: Date,
  previousMaxDate: Date,
  bucket: Bucket,
) => {
  previousMaxDate.setDate(previousMaxDate.getDate() - params.numDays)
  const witnessSums = await getHotspotWitnessSums({
    address: params.address,
    minTime: `-${params.numDays} day`,
    maxTime: today,
    bucket,
  })
  const witnessSumsPrevious = await getHotspotWitnessSums({
    address: params.address,
    minTime: `-${params.numDays} day`,
    maxTime: previousMaxDate,
    bucket,
  })
  if (bucket === 'hour') {
    fillMissingHourlyValues(witnessSums)
    fillMissingHourlyValues(witnessSumsPrevious)
  }
  witnessSums.reverse()
  const totalAvg = witnessSums.reduce((a, b) => ({ avg: a.avg + b.avg } as any))
  const prevAvg = witnessSumsPrevious.reduce(
    (a, b) => ({ avg: a.avg + b.avg } as any),
  )
  const witnessAverage = totalAvg.avg / witnessSums.length
  const witnessAveragePrev = prevAvg.avg / witnessSumsPrevious.length
  return {
    witnessSums,
    witnessAverage,
    witnessChange: calculatePercentChange(witnessAverage, witnessAveragePrev),
  }
}

export const fetchHotspotChallengeSums = async (
  params: FetchDetailsParams,
  today: Date,
  previousMaxDate: Date,
  bucket: Bucket,
) => {
  const challengeSums = await getHotspotChallengeSums({
    address: params.address,
    minTime: `-${params.numDays} day`,
    maxTime: today,
    bucket,
  })
  const challengeSumsPrevious = await getHotspotChallengeSums({
    address: params.address,
    minTime: `-${params.numDays} day`,
    maxTime: previousMaxDate,
    bucket,
  })
  challengeSums.reverse()
  const totalSum = challengeSums.reduce(
    (a, b) => ({ sum: a.sum + b.sum } as any),
  )
  const prevSum = challengeSumsPrevious.reduce(
    (a, b) => ({ sum: a.sum + b.sum } as any),
  )
  return {
    challengeSums,
    challengeSum: totalSum.sum,
    challengeChange: calculatePercentChange(totalSum.sum, prevSum.sum),
  }
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
      throw new Error('Data already fetched')
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
    const bucket = params.numDays === 1 ? 'hour' : 'day'
    const startDate = new Date()
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() - params.numDays)
    const data = await Promise.all([
      getHotspotRewardsSum(params.address, params.numDays),
      getHotspotRewardsSum(params.address, params.numDays, endDate),
      getHotspotRewards(params.address, params.numDays),
      fetchHotspotWitnessSums(params, startDate, endDate, bucket),
      fetchHotspotChallengeSums(params, startDate, endDate, bucket),
    ])
    const rewardSum = data[0]
    const pastRewardSum = data[1]
    const rewards = data[2]
    const witnessSumData = data[3]
    const challengeSumData = data[4]
    return {
      rewardSum,
      rewards,
      rewardsChange: calculatePercentChange(
        rewardSum.total,
        pastRewardSum.total,
      ),
      ...witnessSumData,
      ...challengeSumData,
    }
  },
)

type HotspotChartData = {
  rewardSum?: Sum
  rewards?: Reward[]
  rewardsChange?: number
  witnessSums?: Sum[]
  witnessAverage?: number
  witnessChange?: number
  challengeSums?: Sum[]
  challengeSum?: number
  challengeChange?: number
}

type HotspotData = {
  witnesses?: Hotspot[]
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
}
const initialState: HotspotDetailsState = {
  chartData: {},
  hotspotData: {},
  showSettings: false,
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
