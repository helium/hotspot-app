import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Hotspot } from '@helium/http'
import Balance, { CurrencyType, NetworkTokens } from '@helium/currency'
import { orderBy, sortBy, uniq } from 'lodash'
import { getHotspotDetails, getHotspots } from '../../utils/appDataClient'
import { distance, LocationCoords } from '../../utils/location'
import { getWallet, deleteWallet, postWallet } from '../../utils/walletClient'
import * as Logger from '../../utils/logger'
import { CacheRecord, handleCacheFulfilled } from '../../utils/cacheUtils'
import { HotspotSyncStatus } from '../../features/hotspots/root/hotspotTypes'
import { WalletReward } from '../rewards/rewardsSlice'

export enum HotspotSort {
  New = 'new',
  Near = 'near',
  Earn = 'earn',
  Followed = 'followed',
  Offline = 'offline',
}

type Rewards = Record<string, Balance<NetworkTokens>>

export type HotspotsSliceState = {
  hotspots: Hotspot[]
  orderedHotspots: Hotspot[]
  loadingOrderedHotspots: boolean
  followedHotspotsObj: Record<string, Hotspot>
  followedHotspots: Hotspot[]
  order: HotspotSort
  rewards: Rewards
  location?: LocationCoords
  loadingRewards: boolean
  hotspotsLoaded: boolean
  failure: boolean
  syncStatuses: Record<string, CacheRecord<{ status: HotspotSyncStatus }>>
}

const initialState: HotspotsSliceState = {
  hotspots: [],
  orderedHotspots: [],
  followedHotspotsObj: {},
  followedHotspots: [],
  order: HotspotSort.Followed,
  loadingRewards: false,
  loadingOrderedHotspots: false,
  hotspotsLoaded: false,
  failure: false,
  syncStatuses: {},
  rewards: {},
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
      (h) =>
        distance(context.location || { latitude: 0, longitude: 0 }, {
          latitude: h.lat || 0,
          longitude: h.lng || 0,
        }),
    ])
  },
  [HotspotSort.Earn]: (hotspots, context) => {
    if (!context || !context.rewards) {
      return hotspots
    }
    return sortBy(hotspots, [
      (h) =>
        context.rewards ? -context.rewards[h.address]?.integerBalance : 0,
    ])
  },
  [HotspotSort.Offline]: (hotspots) =>
    orderBy(hotspots, ['status.online', 'offline']),
  [HotspotSort.Followed]: (hotspots) => hotspots,
}

export const fetchRewards = createAsyncThunk<
  WalletReward[],
  { fetchType: 'all' | 'followed' }
>('hotspots/fetchRewards', async ({ fetchType }, { getState }) => {
  const { hotspots, followedHotspots } = (getState() as {
    hotspots: {
      hotspots: Hotspot[]
      followedHotspots: Hotspot[]
    }
  }).hotspots
  let gatewayAddresses = followedHotspots.map((h) => h.address)
  if (fetchType === 'all') {
    const ownedAddresses = hotspots.map((h) => h.address)
    gatewayAddresses = uniq([...ownedAddresses, ...gatewayAddresses])
  }

  if (gatewayAddresses.length === 0) {
    return []
  }

  return getWallet('hotspots/rewards', {
    addresses: gatewayAddresses.join(','),
    dayRange: 1,
  })
})
// TODO: fix lat/lng coming as strings from the wallet api.
const sanitizeWalletHotspots = (hotspots: WalletHotspot[]) => {
  return hotspots.map((h) => ({
    ...h,
    lat: parseFloat(h.lat),
    lng: parseFloat(h.lng),
  }))
}

type WalletHotspot = Hotspot & { lat: string; lng: string }
export const fetchHotspotsData = createAsyncThunk(
  'hotspots/fetchHotspotsData',
  async (_arg) => {
    const allHotspots = await Promise.all(
      [
        getHotspots(),
        getWallet('hotspots/follow', null, { camelCase: true }),
      ].map((p) =>
        p.catch((e) => {
          Logger.error(e)
        }),
      ),
    )

    const [hotspots = [], followedHotspots = []]: [
      Hotspot[],
      WalletHotspot[],
    ] = allHotspots as [Hotspot[], WalletHotspot[]]

    return {
      hotspots,
      followedHotspots: sanitizeWalletHotspots(followedHotspots),
    }
  },
)

export const followHotspot = createAsyncThunk<
  {
    followed: Hotspot[]
    blockHotspot: Hotspot | null
    hotspotRewards: Balance<NetworkTokens> | null
    hotspotAddress: string
  },
  string
>('hotspots/followHotspot', async (hotspotAddress) => {
  const followed = await postWallet(`hotspots/follow/${hotspotAddress}`, null, {
    camelCase: true,
  })
  let blockHotspot: Hotspot | null = null
  try {
    blockHotspot = await getHotspotDetails(hotspotAddress)
  } catch (e) {
    Logger.error(e)
  }

  let hotspotRewards: Balance<NetworkTokens> | null = null
  try {
    const response: WalletReward[] = await getWallet('hotspots/rewards', {
      addresses: hotspotAddress,
      dayRange: 1,
    })
    if (response && response.length) {
      hotspotRewards = Balance.fromFloat(
        response[0].total,
        CurrencyType.networkToken,
      )
    }
  } catch (e) {
    Logger.error(e)
  }

  return {
    followed: sanitizeWalletHotspots(followed),
    blockHotspot,
    hotspotRewards,
    hotspotAddress,
  }
})

export const unfollowHotspot = createAsyncThunk<Hotspot[], string>(
  'hotspots/unfollowHotspot',
  async (hotspot_address) => {
    const followed = await deleteWallet(
      `hotspots/follow/${hotspot_address}`,
      null,
      { camelCase: true },
    )
    return sanitizeWalletHotspots(followed)
  },
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
    updateSyncStatus: (
      state,
      {
        payload: { address, status },
      }: { payload: { address: string; status: HotspotSyncStatus } },
    ) => {
      state.syncStatuses[address] = handleCacheFulfilled({
        status,
      })
    },
    changeFilter: (state, { payload }: { payload: HotspotSort }) => {
      if (state.order === payload) return state

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
      state.failure = false
      if (state.hotspots.length === 0) {
        state.order = HotspotSort.Followed
      }
    })
    builder.addCase(fetchHotspotsData.rejected, (state, _action) => {
      state.loadingRewards = false
      state.hotspotsLoaded = true
      state.failure = true
    })
    builder.addCase(fetchRewards.rejected, (state, _action) => {
      state.loadingRewards = false
    })
    builder.addCase(fetchRewards.pending, (state, _action) => {
      state.loadingRewards = true
    })
    builder.addCase(fetchRewards.fulfilled, (state, action) => {
      action.payload.forEach((r) => {
        state.rewards[r.gateway] = Balance.fromFloat(
          r.total,
          CurrencyType.networkToken,
        )
      })
      state.loadingRewards = false
    })
    builder.addCase(
      unfollowHotspot.fulfilled,
      (state, { payload: followed }) => {
        const nextFollowed = followed.map((walletFollowed) => {
          const hotspot = state.followedHotspotsObj[walletFollowed.address]
          return (hotspot as Hotspot) || walletFollowed
        })

        state.followedHotspots = nextFollowed
        state.followedHotspotsObj = hotspotsToObj(nextFollowed)
      },
    )
    builder.addCase(
      followHotspot.fulfilled,
      (
        state,
        { payload: { blockHotspot, followed, hotspotRewards, hotspotAddress } },
      ) => {
        const nextFollowed = followed.map((walletFollowed) => {
          if (walletFollowed.address === blockHotspot?.address)
            return blockHotspot
          const hotspot = state.followedHotspotsObj[walletFollowed.address]
          return (hotspot as Hotspot) || walletFollowed
        })

        state.followedHotspots = nextFollowed
        state.followedHotspotsObj = hotspotsToObj(nextFollowed)

        if (hotspotRewards) {
          const rewards = state.rewards || {}
          rewards[hotspotAddress] = hotspotRewards
          state.rewards = rewards
        }
      },
    )
  },
})

export default hotspotsSlice
