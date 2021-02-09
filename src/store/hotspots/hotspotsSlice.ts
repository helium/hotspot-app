import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Hotspot, Sum } from '@helium/http'
import Balance, { CurrencyType, NetworkTokens } from '@helium/currency'
import { getHotspotRewardsSum, getHotspots } from '../../utils/appDataClient'

export const fetchHotspotsData = createAsyncThunk(
  'hotspots/fetchRewards',
  async () => {
    const hotspots = await getHotspots()

    let total = new Balance(0, CurrencyType.networkToken)
    const rewards: Record<string, Sum> = {}
    const results = await Promise.all(
      hotspots.map((hotspot) => getHotspotRewardsSum(hotspot.address, 1)),
    )
    results.forEach((reward, i) => {
      const { address } = hotspots[i]
      rewards[address] = reward
      total = total.plus(reward.balanceTotal)
    })

    return {
      hotspots,
      total,
      rewards,
    }
  },
)

type HotspotsSliceState = {
  hotspots?: Hotspot[]
  rewards?: Record<string, Sum>
  totalRewards: Balance<NetworkTokens>
  loadingRewards: boolean
}
const initialState: HotspotsSliceState = {
  loadingRewards: false,
  totalRewards: new Balance(0, CurrencyType.networkToken),
}

const hotspotsSlice = createSlice({
  name: 'hotspotDetails',
  initialState,
  reducers: {
    signOut: () => {
      return { ...initialState }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchHotspotsData.fulfilled, (state, action) => {
      state.hotspots = action.payload.hotspots
      state.rewards = action.payload.rewards
      state.totalRewards = action.payload.total
      state.loadingRewards = false
    })
    builder.addCase(fetchHotspotsData.pending, (state, _action) => {
      state.loadingRewards = true
    })
    builder.addCase(fetchHotspotsData.rejected, (state, _action) => {
      state.loadingRewards = false
    })
  },
})

export default hotspotsSlice
