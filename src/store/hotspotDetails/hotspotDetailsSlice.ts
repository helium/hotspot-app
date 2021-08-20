import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Hotspot, Witness } from '@helium/http'
import {
  getHotspotDetails,
  getHotspotWitnesses,
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
      getHotspotWitnesses(address),
    ])
    return {
      hotspot: data[0],
      witnesses: data[1],
    }
  },
)

type HotspotData = {
  witnesses?: Witness[]
  hotspot?: Hotspot
}

export type HotspotDetailCache = CacheRecord<HotspotData>
export type HotspotAddress = string
export type HotspotIndexed<T> = Record<HotspotAddress, T>

type HotspotDetailsState = {
  hotspotData: HotspotIndexed<HotspotDetailCache>
  showSettings: boolean
  showMapFilter: boolean
}
const initialState: HotspotDetailsState = {
  hotspotData: {},
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
  },
})

export default hotspotDetailsSlice
