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
import * as Logger from '../../utils/logger'

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
  hotspotsLoaded: boolean
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
  hotspotsLoaded: false,
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

export const fetchRewards = createAsyncThunk(
  'hotspots/fetchRewards',
  async (_, { getState }) => {
    const { hotspots, followedHotspots } = (getState() as {
      hotspots: {
        hotspots: Hotspot[]
        followedHotspots: Hotspot[]
      }
    }).hotspots

    let total = new Balance(0, CurrencyType.networkToken)

    const ownedAddresses = hotspots.map((h) => h.address)
    const followingAddresses = followedHotspots.map((h) => h.address)
    const unOwnedAddresses = followingAddresses.filter(
      (fa) => !ownedAddresses.includes(fa),
    )

    const unOwnedResults = (
      await Promise.all(
        unOwnedAddresses
          .map((address) => getHotspotRewardsSum(address, 1))
          .map((p) =>
            p.catch((e) => {
              Logger.error(e)
            }),
          ),
      )
    ).filter((a) => a !== undefined) as Sum[]

    const ownedResults = (
      await Promise.all(
        ownedAddresses
          .map((address) => getHotspotRewardsSum(address, 1))
          .map((p) =>
            p.catch((e) => {
              Logger.error(e)
            }),
          ),
      )
    ).filter((a) => a !== undefined) as Sum[]

    const rewards: Record<string, Sum> = {}
    ownedResults.forEach((reward, i) => {
      const address = ownedAddresses[i]
      rewards[address] = reward
      total = total.plus(reward.balanceTotal)
    })

    unOwnedResults.forEach((reward, i) => {
      const address = unOwnedAddresses[i]
      rewards[address] = reward
    })

    return {
      total,
      rewards,
    }
  },
)
export const fetchFollowedHotspotsFromBlock = createAsyncThunk(
  'hotspots/fetchFollowedHotspotsFromBlock ',
  async (_, { getState }) => {
    const { hotspots, followedHotspots } = (getState() as {
      hotspots: {
        hotspots: Hotspot[]
        followedHotspots: Hotspot[]
      }
    }).hotspots

    const ownedAddresses = hotspots.map((h) => h.address)
    const followingAddresses = followedHotspots.map((h) => h.address)
    const unOwnedAddresses = followingAddresses.filter(
      (fa) => !ownedAddresses.includes(fa),
    )

    let unOwnedHotspots: Hotspot[] = []
    unOwnedHotspots = (
      await Promise.all(
        unOwnedAddresses
          .map((a) => getHotspotDetails(a))
          .map((p) =>
            p.catch((e) => {
              Logger.error(e)
            }),
          ),
      )
    ).filter((h) => h !== undefined) as Hotspot[]

    // Followed hotspots come from the wallet api
    // Replace followed hotspots with their blockchain equivalent
    return followedHotspots.map((fh) => {
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
  },
)

export const fetchHotspotsData = createAsyncThunk(
  'hotspots/fetchHotspotsData',
  async () => {
    const allHotspots = await Promise.all(
      [getHotspots(), getWallet('hotspots/follow', null, true)].map((p) =>
        p.catch((e) => {
          Logger.error(e)
        }),
      ),
    )
    const [hotspots = [], followedHotspots = []]: [
      Hotspot[],
      Hotspot[],
    ] = allHotspots as [Hotspot[], Hotspot[]]

    return { hotspots, followedHotspots }
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
      state.hotspotsLoaded = true
    })
    builder.addCase(fetchRewards.fulfilled, (state, action) => {
      state.rewards = action.payload.rewards
      state.totalRewards = action.payload.total
      state.loadingRewards = false
    })
    builder.addCase(
      fetchFollowedHotspotsFromBlock.fulfilled,
      (state, action) => {
        const followed: Hotspot[] = action.payload
        state.followedHotspots = followed
        state.followedHotspotsObj = hotspotsToObj(followed)
      },
    )
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
