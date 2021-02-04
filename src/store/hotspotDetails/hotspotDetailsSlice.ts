import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { HotspotReward, HotspotRewardSum, Hotspot } from '@helium/http'
import { WitnessSum } from '@helium/http/build/models/WitnessSum'
import {
  getHotspotDetails,
  getHotspotRewards,
  getHotspotRewardsSum,
  getHotspotWitnesses,
  getHotspotWitnessSums,
} from '../../utils/appDataClient'
import { calculatePercentChange } from '../../features/hotspots/details/RewardsHelper'

type FetchRewardsParams = {
  address: string
  numDays: number
}

type FetchWitnessSumsParams = {
  address: string
  numDays: number
}

export const fetchHotspotDetails = createAsyncThunk<Hotspot, string>(
  'hotspotDetails/fetchHotspotDetails',
  async (address: string) => {
    return getHotspotDetails(address)
  },
)

export const fetchHotspotRewards = createAsyncThunk(
  'hotspotDetails/fetchRewards',
  async (params: FetchRewardsParams) => {
    const previousStart = new Date()
    previousStart.setDate(previousStart.getDate() - params.numDays)
    const data = await Promise.all([
      getHotspotRewardsSum(params.address, params.numDays),
      getHotspotRewardsSum(params.address, params.numDays, previousStart),
      getHotspotRewards(params.address, params.numDays),
    ])
    return {
      address: params.address,
      numDays: params.numDays,
      rewardSum: data[0],
      percentChange: calculatePercentChange(
        data[0].total.floatBalance,
        data[1].total.floatBalance,
      ),
      rewards: data[2],
    }
  },
)

export const fetchHotspotWitnesses = createAsyncThunk(
  'hotspotDetails/fetchWitnesses',
  async (address: string) => {
    const witnesses = await getHotspotWitnesses(address)
    return { address, witnesses }
  },
)

const getMissingHourlyValue = (i: number, arr: WitnessSum[]) => {
  const averages = arr.map((w) => w.avg)
  const lastNonZero = averages
    .slice(0, i)
    .filter((a) => a > 0)
    .pop()
  const nextNonZero = averages.slice(i).filter((a) => a > 0)[0]
  return lastNonZero || nextNonZero || 0
}

const fillMissingHourlyValues = (array: WitnessSum[]) => {
  return array.map(
    (w, i, arr) =>
      ({
        ...w,
        avg: w.avg || getMissingHourlyValue(i, arr),
      } as WitnessSum),
  )
}

export const fetchHotspotWitnessSums = createAsyncThunk(
  'hotspotDetails/fetchWitnessSums',
  async (params: FetchWitnessSumsParams) => {
    const bucket = params.numDays === 1 ? 'hour' : 'day'
    const today = new Date()
    const previousMaxDate = new Date(today)
    previousMaxDate.setDate(previousMaxDate.getDate() - params.numDays)
    let witnessSums = await getHotspotWitnessSums({
      address: params.address,
      minTime: `-${params.numDays} day`,
      maxTime: today,
      bucket,
    })
    let witnessSumsPrevious = await getHotspotWitnessSums({
      address: params.address,
      minTime: `-${params.numDays} day`,
      maxTime: previousMaxDate,
      bucket,
    })
    if (bucket === 'hour') {
      witnessSums = fillMissingHourlyValues(witnessSums)
      witnessSumsPrevious = fillMissingHourlyValues(witnessSumsPrevious)
    }
    witnessSums.reverse()
    const totalAvg = witnessSums.reduce(
      (a, b) => ({ avg: a.avg + b.avg } as WitnessSum),
    )
    const prevAvg = witnessSumsPrevious.reduce(
      (a, b) => ({ avg: a.avg + b.avg } as WitnessSum),
    )
    const witnessAverage = totalAvg.avg / witnessSums.length
    const witnessAveragePrev = prevAvg.avg / witnessSumsPrevious.length
    return {
      address: params.address,
      witnessSums,
      witnessAverage,
      witnessChange: calculatePercentChange(witnessAverage, witnessAveragePrev),
    }
  },
)

type HotspotDetailsState = {
  hotspot?: Hotspot
  numDays?: number
  rewardSum?: HotspotRewardSum
  rewards?: HotspotReward[]
  rewardsChange?: number
  loadingRewards: boolean
  witnesses?: Hotspot[]
  witnessSums?: WitnessSum[]
  witnessAverage?: number
  witnessChange?: number
  loadingWitnessSums?: boolean
  loadingWitnesses: boolean
  showSettings: boolean
}
const initialState: HotspotDetailsState = {
  numDays: 14,
  loadingRewards: false,
  loadingWitnesses: false,
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
    clearHotspotDetails: () => {
      return { ...initialState }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchHotspotDetails.fulfilled, (state, action) => {
      state.hotspot = action.payload
    })
    builder.addCase(fetchHotspotRewards.pending, (state, _action) => {
      state.loadingRewards = true
    })
    builder.addCase(fetchHotspotRewards.fulfilled, (state, action) => {
      state.loadingRewards = false
      state.numDays = action.payload.numDays
      state.rewardSum = action.payload.rewardSum
      state.rewards = action.payload.rewards
      state.rewardsChange = action.payload.percentChange
    })
    builder.addCase(fetchHotspotRewards.rejected, (state, _action) => {
      state.loadingRewards = false
      state.numDays = undefined
      state.rewardSum = undefined
      state.rewards = undefined
      state.rewardsChange = undefined
    })
    builder.addCase(fetchHotspotWitnesses.pending, (state, _action) => {
      state.loadingWitnesses = true
    })
    builder.addCase(fetchHotspotWitnesses.fulfilled, (state, action) => {
      state.loadingWitnesses = false
      state.witnesses = action.payload.witnesses
    })
    builder.addCase(fetchHotspotWitnesses.rejected, (state, _action) => {
      state.loadingWitnesses = false
      state.numDays = undefined
      state.rewardSum = undefined
      state.rewards = undefined
      state.rewardsChange = undefined
    })
    builder.addCase(fetchHotspotWitnessSums.pending, (state, _action) => {
      state.loadingWitnessSums = true
    })
    builder.addCase(fetchHotspotWitnessSums.fulfilled, (state, action) => {
      state.loadingWitnessSums = false
      state.witnessSums = action.payload.witnessSums
      state.witnessAverage = action.payload.witnessAverage
      state.witnessChange = action.payload.witnessChange
    })
    builder.addCase(fetchHotspotWitnessSums.rejected, (state, _action) => {
      state.loadingWitnessSums = false
      state.witnessSums = undefined
      state.witnessAverage = undefined
      state.witnessChange = undefined
    })
  },
})

export default hotspotDetailsSlice
