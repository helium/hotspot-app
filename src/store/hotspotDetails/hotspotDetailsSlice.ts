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
  async (params: FetchDetailsParams, { getState }) => {
    const currentState = (getState() as {
      hotspotDetails: {
        details: Record<string, Record<number, HotspotDetails>>
      }
    }).hotspotDetails
    const currentDetails = currentState.details[params.address] || {}
    const { lastFetchedTimestamp = 0 } = currentDetails[params.numDays] || {}
    const now = Date.now()
    const fiveMinutes = 300000
    if (lastFetchedTimestamp && now - lastFetchedTimestamp < fiveMinutes) {
      return
    }
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

type HotspotDetails = {
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
  lastFetchedTimestamp?: number
}

type HotspotDetailsState = {
  details: Record<string, Record<number, HotspotDetails>>
  showSettings: boolean
}
const initialState: HotspotDetailsState = {
  details: {},
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
    clearHotspotDetails: () => {},
  },
  extraReducers: (builder) => {
    builder.addCase(fetchHotspotDetails.pending, (state, action) => {
      const { address, numDays } = action.meta.arg
      const prevDetails = state.details[address] || {}
      const prevState = prevDetails[numDays] || {}
      state.details[address] = {
        ...state.details[address],
        [numDays]: {
          ...prevState,
          loading: true,
        },
      }
    })
    builder.addCase(fetchHotspotDetails.fulfilled, (state, action) => {
      if (!action.payload) {
        state.details[action.meta.arg.address][action.meta.arg.numDays] = {
          ...state.details[action.meta.arg.address][action.meta.arg.numDays],
          loading: false,
        }
        return
      }
      state.details[action.meta.arg.address][action.payload.numDays] = {
        ...state.details[action.meta.arg.address][action.payload.numDays],
        loading: false,
        hotspot: action.payload.hotspot,
        numDays: action.payload.numDays,
        rewardSum: action.payload.rewardSum,
        rewards: action.payload.rewards,
        rewardsChange: action.payload.rewardsChange,
        witnesses: action.payload.witnesses,
        witnessSums: action.payload.witnessSums,
        witnessAverage: action.payload.witnessAverage,
        witnessChange: action.payload.witnessChange,
        challengeSums: action.payload.challengeSums,
        challengeSum: action.payload.challengeSum,
        challengeChange: action.payload.challengeChange,
        lastFetchedTimestamp: Date.now(),
      }
    })
    builder.addCase(fetchHotspotDetails.rejected, (state, action) => {
      const { address, numDays } = action.meta.arg
      const prevDetails = state.details[address] || {}
      const prevState = prevDetails[numDays] || {}
      state.details[address] = {
        ...state.details[address],
        [numDays]: {
          ...prevState,
          loading: false,
        },
      }
    })
  },
})

export default hotspotDetailsSlice
