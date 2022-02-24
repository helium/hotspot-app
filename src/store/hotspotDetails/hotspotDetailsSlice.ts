import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Hotspot, Witness } from '@helium/http'
import {
  getHotspotDenylists,
  getHotspotDetails,
  getWitnessedHotspots,
} from '../../utils/appDataClient'
import {
  CacheRecord,
  handleCacheRejected,
  handleCachePending,
  handleCacheFulfilled,
  hasValidCache,
} from '../../utils/cacheUtils'

export const fetchHotspotData = createAsyncThunk<HotspotData, string>(
  'hotspotDetails/fetchHotspotData',
  async (address: string, { getState }) => {
    const currentState = (getState() as {
      hotspotDetails: {
        hotspotData: HotspotIndexed<HotspotDetailCache>
      }
    }).hotspotDetails
    const hotspotData = currentState.hotspotData[address] || {}
    if (hasValidCache(hotspotData)) {
      return hotspotData
    }
    const data = await Promise.all([
      getHotspotDetails(address),
      getWitnessedHotspots(address),
    ])
    return {
      hotspot: data[0],
      witnesses: data[1],
    }
  },
)

export const fetchHotspotDenylists = createAsyncThunk<DenylistsData, string>(
  'hotspotDetails/fetchHotspotDenylists',
  async (address: string, { getState }) => {
    const currentState = (getState() as {
      hotspotDetails: {
        denylists: HotspotIndexed<CacheRecord<DenylistsData>>
      }
    }).hotspotDetails
    const denylists = currentState.denylists[address] || []
    if (hasValidCache(denylists)) {
      return denylists
    }
    const data = await getHotspotDenylists(address)
    return { data }
  },
)

type HotspotData = {
  witnesses?: Witness[]
  hotspot?: Hotspot
}

export type HotspotDetailCache = CacheRecord<HotspotData>
export type HotspotAddress = string
export type HotspotIndexed<T> = Record<HotspotAddress, T>
export type DenylistsData = { data: string[] }

type HotspotDetailsState = {
  hotspotData: HotspotIndexed<HotspotDetailCache>
  denylists: HotspotIndexed<CacheRecord<DenylistsData>>
  showSettings: boolean
  showMapFilter: boolean
}
const initialState: HotspotDetailsState = {
  hotspotData: {},
  denylists: {},
  showSettings: false,
  showMapFilter: false,
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
    toggleShowMapFilter: (state) => ({
      ...state,
      showMapFilter: !state.showMapFilter,
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(fetchHotspotData.pending, (state, action) => {
      const address = action.meta.arg
      const prevState = state.hotspotData[address] || {}
      const nextState = handleCachePending(prevState)
      state.hotspotData[address] = {
        ...state.hotspotData[address],
        ...nextState,
      }
    })
    builder.addCase(fetchHotspotData.fulfilled, (state, action) => {
      const address = action.meta.arg
      state.hotspotData[address] = handleCacheFulfilled(action.payload)
    })
    builder.addCase(fetchHotspotData.rejected, (state, action) => {
      const address = action.meta.arg
      const prevState = state.hotspotData[address] || {}
      const nextState = handleCacheRejected(prevState)
      state.hotspotData[address] = {
        ...state.hotspotData[address],
        ...nextState,
      }
    })
    builder.addCase(fetchHotspotDenylists.pending, (state, action) => {
      const address = action.meta.arg
      const prevState = state.denylists[address] || {}
      const nextState = handleCachePending(prevState)
      state.denylists[address] = {
        ...state.denylists[address],
        ...nextState,
      }
    })
    builder.addCase(fetchHotspotDenylists.fulfilled, (state, action) => {
      const address = action.meta.arg
      state.denylists[address] = handleCacheFulfilled(action.payload)
    })
    builder.addCase(fetchHotspotDenylists.rejected, (state, action) => {
      const address = action.meta.arg
      const prevState = state.denylists[address] || {}
      const nextState = handleCacheRejected(prevState)
      state.denylists[address] = {
        ...state.denylists[address],
        ...nextState,
      }
    })
  },
})

export default hotspotDetailsSlice
