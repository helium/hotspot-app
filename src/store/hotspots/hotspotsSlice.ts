import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Hotspot } from '@helium/http'
import Balance, { CurrencyType, NetworkTokens } from '@helium/currency'
import { getHotspotDetails, getHotspots } from '../../utils/appDataClient'
import { LocationCoords } from '../../utils/location'
import { getWallet, deleteWallet, postWallet } from '../../utils/walletClient'
import {
  CacheRecord,
  handleCacheFulfilled,
  hasValidCache,
} from '../../utils/cacheUtils'
import { HotspotSyncStatus } from '../../features/hotspots/root/hotspotTypes'
import { WalletReward } from '../rewards/rewardsSlice'

export type Rewards = Record<string, Balance<NetworkTokens>>

export type HotspotsSliceState = {
  hotspots: CacheRecord<{ data: Hotspot[] }>
  orderedHotspots: Hotspot[]
  followedHotspotsObj: Record<string, Hotspot>
  followedHotspots: CacheRecord<{ data: Hotspot[] }>
  location?: LocationCoords
  loadingRewards: boolean
  hotspotsLoaded: boolean
  failure: boolean
  syncStatuses: Record<string, CacheRecord<{ status: HotspotSyncStatus }>>
  rewards: Rewards
}

const initialState: HotspotsSliceState = {
  hotspots: { lastFetchedTimestamp: 0, loading: false, data: [] },
  orderedHotspots: [],
  followedHotspotsObj: {},
  followedHotspots: { lastFetchedTimestamp: 0, loading: false, data: [] },
  loadingRewards: false,
  hotspotsLoaded: false,
  failure: false,
  syncStatuses: {},
  rewards: {},
}

export const fetchRewards = createAsyncThunk<
  WalletReward[],
  { addresses: string[] }
>('hotspots/fetchRewards', async ({ addresses }) => {
  if (!addresses.length) return []

  return getWallet('hotspots/rewards', {
    addresses: addresses.join(','),
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
  async (_arg, { getState }) => {
    const state = ((await getState()) as { hotspots: HotspotsSliceState })
      .hotspots
    if (
      hasValidCache(state.hotspots) &&
      hasValidCache(state.followedHotspots)
    ) {
      return {
        hotspots: state.hotspots.data,
        followedHotspots: state.followedHotspots.data,
      }
    }

    const allHotspots = await Promise.all([
      getHotspots(),
      getWallet('hotspots/follow', null, { camelCase: true }),
    ])

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
  } catch (e) {}

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
  } catch (e) {}

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const hotspotsSliceMigrations: any = {
  0: () => initialState, // migration for hotspots and followedHotspots moving to CacheRecord
}

const hotspotsSlice = createSlice({
  name: 'hotspots',
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
  },
  extraReducers: (builder) => {
    builder.addCase(fetchHotspotsData.fulfilled, (state, action) => {
      const followed: Hotspot[] = action.payload.followedHotspots
      state.followedHotspots = handleCacheFulfilled({ data: followed })
      state.followedHotspotsObj = hotspotsToObj(followed)
      state.hotspots = handleCacheFulfilled({ data: action.payload.hotspots })
      state.hotspotsLoaded = true
      state.failure = false
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

        state.followedHotspots = handleCacheFulfilled({ data: nextFollowed })
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

        state.followedHotspots = handleCacheFulfilled({ data: nextFollowed })
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
