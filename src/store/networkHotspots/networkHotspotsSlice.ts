import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getWallet } from '../../utils/walletClient'

type GeoBounds = { lat: number; lng: number; dist: number }

export const fetchNetworkHotspots = createAsyncThunk<
  NetworkHotspot[],
  GeoBounds
>('networkHotspots/fetch', async (params) => {
  const networkHotspots = await getWallet('hotspots', params)
  return networkHotspots.map((h: HTTPNetworkHotspot) => ({
    ...h,
    lat: parseFloat(h.lat),
    lng: parseFloat(h.lng),
  }))
})

export type NetworkHotspot = {
  address: string
  owner: string
  name: string
  lat: number
  lng: number
}

type HTTPNetworkHotspot = {
  address: string
  owner: string
  name: string
  lat: string
  lng: string
}

type NetworkHotspotsSliceState = {
  loading: boolean
  networkHotspots: NetworkHotspot[]
}
const initialState: NetworkHotspotsSliceState = {
  loading: false,
  networkHotspots: [],
}

const networkHotspotsSlice = createSlice({
  name: 'networkHotspots',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchNetworkHotspots.pending, (state, _action) => {
      state.loading = true
    })
    builder.addCase(fetchNetworkHotspots.fulfilled, (state, action) => {
      state.loading = false
      state.networkHotspots = action.payload
    })
    builder.addCase(fetchNetworkHotspots.rejected, (state, _action) => {
      state.loading = false
    })
  },
})

export default networkHotspotsSlice
