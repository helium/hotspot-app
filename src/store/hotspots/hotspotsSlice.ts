import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Hotspot, Sum } from '@helium/http'
import Balance, { CurrencyType, NetworkTokens } from '@helium/currency'
import { orderBy, sortBy } from 'lodash'
import { getHotspotRewardsSum, getHotspots } from '../../utils/appDataClient'
import { distance, LocationCoords } from '../../utils/location'

export enum HotspotSort {
  New = 'new',
  Near = 'near',
  Earn = 'earn',
  Offline = 'offline',
}

type Rewards = Record<string, Sum>

type SorterContext = { rewards?: Rewards; location?: LocationCoords }
type HotspotSorter = (hotspots: Hotspot[], context?: SorterContext) => Hotspot[]
const hotspotSorters: Record<HotspotSort, HotspotSorter> = {
  [HotspotSort.New]: (hotspots) => orderBy(hotspots, 'blockAdded', 'desc'),
  [HotspotSort.Near]: (hotspots, context) => {
    if (!context?.location) {
      return hotspots
    }
    return sortBy(hotspots, [
      (h) => distance(context.location, { latitude: h.lat, longitude: h.lng }),
    ])
  },
  [HotspotSort.Earn]: (hotspots, context) => {
    if (!context || !context.rewards) {
      return hotspots
    }
    return sortBy(hotspots, [(h) => -context.rewards[h.address].total])
  },
  [HotspotSort.Offline]: (hotspots) =>
    orderBy(hotspots, ['status.online', 'offline']),
}

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
  hotspots: Hotspot[]
  order: HotspotSort
  rewards?: Rewards
  totalRewards: Balance<NetworkTokens>
  loadingRewards: boolean
}
const initialState: HotspotsSliceState = {
  hotspots: [],
  order: HotspotSort.New,
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
    changeOrder: (
      state,
      {
        payload,
      }: { payload: { order: HotspotSort; currentLocation?: LocationCoords } },
    ) => {
      return {
        ...state,
        hotspots: hotspotSorters[payload.order](state.hotspots as Hotspot[], {
          rewards: state.rewards as Rewards,
          location: payload.currentLocation,
        }),
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchHotspotsData.fulfilled, (state, action) => {
      state.hotspots = hotspotSorters[state.order](action.payload.hotspots)
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
