import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Hotspot, Sum } from '@helium/http'
import Balance, { CurrencyType, NetworkTokens } from '@helium/currency'
import { orderBy, sortBy } from 'lodash'
import {
  getHotspotDetails,
  getHotspotRewardsSum,
  getHotspots,
} from '../../utils/appDataClient'
import { distance, LocationCoords } from '../../utils/location'
import { getWallet, deleteWallet, postWallet } from '../../utils/walletClient'

export enum HotspotSort {
  New = 'new',
  Near = 'near',
  Earn = 'earn',
  Followed = 'followed',
  Offline = 'offline',
}

type Rewards = Record<string, Sum>

type HotspotsSliceState = {
  hotspots: Hotspot[]
  orderedHotspots: Hotspot[]
  loadingOrderedHotspots: boolean
  followedHotspotsObj: Record<string, Hotspot>
  followedHotspots: Hotspot[]
  order: HotspotSort
  rewards?: Rewards
  location?: LocationCoords
  totalRewards: Balance<NetworkTokens>
  loadingRewards: boolean
}

const initialState: HotspotsSliceState = {
  hotspots: [],
  orderedHotspots: [],
  followedHotspotsObj: {},
  followedHotspots: [],
  order: HotspotSort.New,
  loadingRewards: false,
  loadingOrderedHotspots: false,
  totalRewards: new Balance(0, CurrencyType.networkToken),
}

type SorterContext = {
  rewards?: Rewards
  location?: LocationCoords
}
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
  [HotspotSort.Followed]: (hotspots) => hotspots,
}

export const fetchHotspotsData = createAsyncThunk(
  'hotspots/fetchRewards',
  async () => {
    const [hotspots, followedHotspots]: [
      Hotspot[],
      Hotspot[],
    ] = await Promise.all([
      getHotspots(),
      getWallet('hotspots/follow', null, true),
    ])

    let total = new Balance(0, CurrencyType.networkToken)

    const ownedAddresses = hotspots.map((h) => h.address)
    const followingAddresses = followedHotspots.map((h) => h.address)
    const unOwnedAddresses = followingAddresses.filter(
      (fa) => !ownedAddresses.includes(fa),
    )

    const allAddresses = [...unOwnedAddresses, ...ownedAddresses]

    const unOwnedHotspots = await Promise.all(
      unOwnedAddresses.map((a) => getHotspotDetails(a)),
    )

    const rewards: Record<string, Sum> = {}
    const results = await Promise.all(
      allAddresses.map((address) => getHotspotRewardsSum(address, 1)),
    )
    results.forEach((reward, i) => {
      const address = allAddresses[i]
      rewards[address] = reward
      total = total.plus(reward.balanceTotal)
    })

    // replace followed hotspots with their blockchain equivalent
    const followedFromBlock = followedHotspots.map((fh) => {
      let idx = unOwnedHotspots.findIndex((uoh) => uoh.address === fh.address)
      if (idx !== -1) {
        return unOwnedHotspots[idx]
      }
      idx = hotspots.findIndex((h) => h.address === fh.address)
      if (idx !== -1) {
        return hotspots[idx]
      }

      // this should never happen, but providing a fallback just in the case the block api fails
      return fh
    })

    return {
      followedHotspots: followedFromBlock,
      hotspots,
      total,
      rewards,
    }
  },
)

export const followHotspot = createAsyncThunk<Hotspot[], string>(
  'hotspots/followHotspot',
  async (hotspot_address) =>
    postWallet(`hotspots/follow/${hotspot_address}`, null, true),
)

export const unfollowHotspot = createAsyncThunk<Hotspot[], string>(
  'hotspots/unfollowHotspot',
  async (hotspot_address) =>
    deleteWallet(`hotspots/follow/${hotspot_address}`, null, true),
)

const hotspotsToObj = (hotspots: Hotspot[]) =>
  hotspots.reduce((obj, hotspot) => {
    return {
      ...obj,
      [hotspot.address]: hotspot,
    }
  }, {})

const hotspotsSlice = createSlice({
  name: 'hotspotDetails',
  initialState,
  reducers: {
    signOut: () => {
      return { ...initialState }
    },
    changeFilter: (state, { payload }: { payload: HotspotSort }) => {
      state.order = payload
      state.loadingOrderedHotspots = true
    },
    changeFilterData: (
      state,
      { payload }: { payload: LocationCoords | undefined },
    ) => {
      const hotspots = (state.order === HotspotSort.Followed
        ? state.followedHotspots
        : state.hotspots) as Hotspot[]
      return {
        ...state,
        location: payload,
        loadingOrderedHotspots: false,
        orderedHotspots: hotspotSorters[state.order](hotspots, {
          rewards: state.rewards as Rewards,
          location: payload,
        }),
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchHotspotsData.fulfilled, (state, action) => {
      const followed: Hotspot[] = action.payload.followedHotspots
      state.followedHotspots = followed
      state.followedHotspotsObj = hotspotsToObj(followed)

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
    builder.addCase(unfollowHotspot.fulfilled, (state, action) => {
      state.followedHotspots = action.payload
      state.followedHotspotsObj = hotspotsToObj(action.payload)
    })
    builder.addCase(followHotspot.fulfilled, (state, action) => {
      state.followedHotspots = action.payload
      state.followedHotspotsObj = hotspotsToObj(action.payload)
    })
  },
})

export default hotspotsSlice
