import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  HotspotRewardData,
  HotspotRewardSumData,
} from '@helium/http/build/models/HotspotReward'
import { Hotspot } from '@helium/http'
import {
  getHotspotRewards,
  getHotspotRewardsSum,
  getHotspotWitnesses,
} from '../../utils/appDataClient'
import { calculatePercentChange } from '../../features/hotspots/details/RewardsHelper'

type FetchRewardsParams = {
  address: string
  numDays: number
}

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

type HotspotDetailsState = {
  numDays: number
  rewardSum?: HotspotRewardSumData
  rewards?: HotspotRewardData[]
  percentChange?: number
  loadingRewards: boolean
  witnesses?: Hotspot[]
  loadingWitnesses: boolean
}
const initialState: HotspotDetailsState = {
  numDays: 14,
  loadingRewards: false,
  loadingWitnesses: false,
}

// This slice contains data related to hotspot details
const hotspotDetailsSlice = createSlice({
  name: 'hotspotDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchHotspotRewards.pending, (state, _action) => {
      state.loadingRewards = true
    })
    builder.addCase(fetchHotspotRewards.fulfilled, (state, action) => {
      state.loadingRewards = false
      state.numDays = action.payload.numDays
      state.rewardSum = action.payload.rewardSum
      state.rewards = action.payload.rewards
      state.percentChange = action.payload.percentChange
    })
    builder.addCase(fetchHotspotRewards.rejected, (state, _action) => {
      state.loadingRewards = false
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
    })
  },
})

export default hotspotDetailsSlice
