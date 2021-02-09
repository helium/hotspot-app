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

export const fetchHotspotDetails = createAsyncThunk(
  'hotspotDetails/fetchHotspotDetails',
  async (params: FetchDetailsParams) => {
    const bucket = params.numDays === 1 ? 'hour' : 'day'
    const startDate = new Date()
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() - params.numDays)
    const data = await Promise.all([
      getHotspotDetails(params.address),
      getHotspotRewardsSum(params.address, params.numDays),
      getHotspotRewardsSum(params.address, params.numDays, endDate),
      getHotspotRewards(params.address, params.numDays),
      getHotspotWitnesses(params.address),
      fetchHotspotWitnessSums(params, startDate, endDate, bucket),
      fetchHotspotChallengeSums(params, startDate, endDate, bucket),
    ])
    // TODO: handle failures
    const hotspot = data[0]
    const rewardSum = data[1]
    const pastRewardSum = data[2]
    const rewards = data[3]
    const witnesses = data[4]
    const witnessSumData = data[5]
    const challengeSumData = data[6]
    return {
      hotspot,
      address: params.address,
      numDays: params.numDays,
      rewardSum,
      rewardsChange: calculatePercentChange(
        rewardSum.total,
        pastRewardSum.total,
      ),
      rewards,
      witnesses,
      ...witnessSumData,
      ...challengeSumData,
    }
  },
)

type HotspotDetailsState = {
  hotspot?: Hotspot
  numDays?: number
  loading: boolean
  rewardSum?: Sum
  rewards?: Reward[]
  rewardsChange?: number
  witnesses?: Hotspot[]
  witnessSums?: Sum[]
  witnessAverage?: number
  witnessChange?: number
  challengeSums?: Sum[]
  challengeSum?: number
  challengeChange?: number
  showSettings: boolean
}
const initialState: HotspotDetailsState = {
  numDays: 14,
  loading: true,
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
    builder.addCase(fetchHotspotDetails.pending, (state, _action) => {
      state.loading = true
    })
    builder.addCase(fetchHotspotDetails.fulfilled, (state, action) => {
      state.hotspot = action.payload.hotspot
      state.loading = false
      state.numDays = action.payload.numDays
      state.rewardSum = action.payload.rewardSum
      state.rewards = action.payload.rewards
      state.rewardsChange = action.payload.rewardsChange
      state.witnesses = action.payload.witnesses
      state.witnessSums = action.payload.witnessSums
      state.witnessAverage = action.payload.witnessAverage
      state.witnessChange = action.payload.witnessChange
      state.challengeSums = action.payload.challengeSums
      state.challengeSum = action.payload.challengeSum
      state.challengeChange = action.payload.challengeChange
    })
    builder.addCase(fetchHotspotDetails.rejected, (state, _action) => {
      state.loading = false
      state.numDays = undefined
      state.rewardSum = undefined
      state.rewards = undefined
      state.rewardsChange = undefined
      state.witnesses = undefined
      state.witnessSums = undefined
      state.witnessAverage = undefined
      state.witnessChange = undefined
      state.challengeSums = undefined
      state.challengeSum = undefined
      state.challengeChange = undefined
    })
  },
})

export default hotspotDetailsSlice
