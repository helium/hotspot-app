import { Hotspot } from '@helium/http'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getHotspotsForHexId } from '../../utils/appDataClient'
import {
  CacheRecord,
  handleCacheFulfilled,
  hasValidCache,
} from '../../utils/cacheUtils'
import { makeDiscoverySignature } from '../../utils/secureAccount'
import { getWallet, postWallet } from '../../utils/walletClient'
import { Loading } from '../activity/activitySlice'
import { DiscoveryRequest, RecentDiscoveryInfo } from './discoveryTypes'

export type DiscoveryState = {
  hotspotDiscoStatuses: Record<string, CacheRecord<{ enabled: boolean }>>
  recentDiscoveryInfos: Record<string, RecentDiscoveryInfo>
  infoLoading: Loading
  requestLoading: Loading
  selectedRequest?: DiscoveryRequest | null
  requestId?: number | null
  hotspotsForHexId: Record<string, CacheRecord<{ hotspots: Hotspot[] }>>
  loadingHotspotsForHex: boolean
}

const initialState: DiscoveryState = {
  hotspotDiscoStatuses: {},
  infoLoading: 'idle',
  requestLoading: 'idle',
  recentDiscoveryInfos: {},
  hotspotsForHexId: {},
  loadingHotspotsForHex: false,
}

export const fetchHotspotDiscoStatus = createAsyncThunk<
  { enabled: boolean },
  { hotspotAddress: string }
>('discovery/hotspotDiscoStatus', async ({ hotspotAddress }, { getState }) => {
  const {
    discovery: { hotspotDiscoStatuses },
  } = getState() as {
    discovery: DiscoveryState
  }
  const existing = hotspotDiscoStatuses[hotspotAddress]
  if (hasValidCache(existing, 60)) {
    throw new Error(
      `Valid Cache Found - No need to fetch disco status for ${hotspotAddress}`,
    )
  }
  return getWallet(`discoveries/${hotspotAddress}/status`, null, {
    camelCase: true,
  })
})

export const fetchHotspotsForHex = createAsyncThunk<
  Hotspot[],
  { hexId: string }
>('discovery/hotspotsForHex', async ({ hexId }, { getState }) => {
  const {
    discovery: { hotspotsForHexId },
  } = getState() as {
    discovery: DiscoveryState
  }
  const existing = hotspotsForHexId[hexId]
  if (hasValidCache(existing, 60)) {
    throw new Error(
      `Valid Cache Found - No need to fetch hotspot for hex ${hexId}`,
    )
  }
  return getHotspotsForHexId(hexId)
})

export const fetchRecentDiscoveries = createAsyncThunk<
  RecentDiscoveryInfo,
  { hotspotAddress: string }
>('discovery/recent', async ({ hotspotAddress }) => {
  const recent = await getWallet(`discoveries/${hotspotAddress}`, null, {
    camelCase: true,
  })

  return recent
})

export const startDiscovery = createAsyncThunk<
  DiscoveryRequest,
  { hotspotAddress: string; hotspotName: string }
>('discovery/start', async ({ hotspotAddress, hotspotName }) => {
  const signature = await makeDiscoverySignature(hotspotAddress)
  return postWallet(
    'discoveries',
    {
      hotspot_address: hotspotAddress,
      hotspot_name: hotspotName,
      signature,
    },
    { camelCase: true },
  )
})

export const fetchDiscoveryById = createAsyncThunk<
  DiscoveryRequest | null,
  { requestId: number }
>('discovery/fetch', async ({ requestId }) => {
  return getWallet(`discoveries/responses/${requestId}`, null, {
    camelCase: true,
  })
})

// This slice contains data related to discovery mode
const discoverySlice = createSlice({
  name: 'discovery',
  initialState,
  reducers: {
    setSelectedRequest: (state, action: PayloadAction<DiscoveryRequest>) => {
      state.selectedRequest = action.payload
      state.requestId = action.payload.id
    },
    clearSelections: (state) => {
      state.selectedRequest = null
      state.requestId = null
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRecentDiscoveries.pending, (state) => {
      state.infoLoading = 'pending'
    })
    builder.addCase(
      fetchRecentDiscoveries.fulfilled,
      (
        state,
        {
          payload,
          meta: {
            arg: { hotspotAddress },
          },
        },
      ) => {
        state.recentDiscoveryInfos[hotspotAddress] = payload
        state.infoLoading = 'fulfilled'
      },
    )
    builder.addCase(fetchRecentDiscoveries.rejected, (state) => {
      state.infoLoading = 'rejected'
    })
    builder.addCase(fetchDiscoveryById.pending, (state) => {
      state.requestLoading = 'pending'
    })
    builder.addCase(fetchDiscoveryById.rejected, (state) => {
      state.requestLoading = 'rejected'
    })
    builder.addCase(fetchDiscoveryById.fulfilled, (state, { payload }) => {
      state.requestLoading = 'fulfilled'
      state.selectedRequest = payload
    })
    builder.addCase(startDiscovery.pending, (state) => {
      state.selectedRequest = null
    })
    builder.addCase(startDiscovery.fulfilled, (state, { payload }) => {
      state.requestId = payload.id
    })
    builder.addCase(
      fetchHotspotsForHex.fulfilled,
      (state, { meta: { arg }, payload }) => {
        state.hotspotsForHexId[arg.hexId] = handleCacheFulfilled({
          hotspots: payload,
        })
        state.loadingHotspotsForHex = false
      },
    )
    builder.addCase(fetchHotspotsForHex.pending, (state) => {
      state.loadingHotspotsForHex = true
    })
    builder.addCase(fetchHotspotsForHex.rejected, (state) => {
      state.loadingHotspotsForHex = false
    })
    builder.addCase(
      fetchHotspotDiscoStatus.fulfilled,
      (state, { meta: { arg }, payload }) => {
        state.hotspotDiscoStatuses[arg.hotspotAddress] = handleCacheFulfilled(
          payload,
        )
        state.loadingHotspotsForHex = false
      },
    )
  },
})

export default discoverySlice
