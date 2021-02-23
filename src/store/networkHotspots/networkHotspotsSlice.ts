import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Position } from 'geojson'
import { getWallet } from '../../utils/walletClient'

export const fetchNetworkHotspots = createAsyncThunk<
  NetworkHotspot[],
  Position[]
>('networkHotspots/fetch', async (bounds) => {
  const [[swlng, swlat], [nelng, nelat]] = bounds
  const networkHotspots = await getWallet('hotspots', {
    swlng,
    swlat,
    nelng,
    nelat,
  })
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
  networkHotspots: Record<string, NetworkHotspot>
}
const initialState: NetworkHotspotsSliceState = {
  loading: false,
  networkHotspots: {},
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
      action.payload.forEach((networkHotspot) => {
        state.networkHotspots[networkHotspot.address] = networkHotspot
      })
    })
    builder.addCase(fetchNetworkHotspots.rejected, (state, _action) => {
      state.loading = false
    })
  },
})

export default networkHotspotsSlice
