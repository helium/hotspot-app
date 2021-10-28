import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getWallet } from '../../utils/walletClient'

export type FeaturesState = {
  fleetModeLowerLimit?: number
  hotspotSyncBuffer?: number
  tileServerRes8Url?: string
  tileServerPointsUrl?: string
  appRetryCount: number
  featuresLoaded: boolean
  walletChartEnabled: boolean
  proxyEnabled: boolean
}

const initialState: FeaturesState = {
  tileServerRes8Url:
    'https://helium-hotspots.s3.us-west-2.amazonaws.com/public.h3_res8.json',
  tileServerPointsUrl:
    'https://helium-hotspots.s3.us-west-2.amazonaws.com/public.points.json',
  appRetryCount: 1,
  featuresLoaded: false,
  walletChartEnabled: false,
  proxyEnabled: false,
}

export const fetchFeatures = createAsyncThunk<FeaturesState>(
  'features/get',
  async () => getWallet('features'),
)

// This slice contains data related optional features within the app
const featuresSlice = createSlice({
  name: 'features',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchFeatures.pending, (state) => {
      state.featuresLoaded = false
    })
    builder.addCase(fetchFeatures.fulfilled, (state, { payload }) => {
      state.fleetModeLowerLimit = payload.fleetModeLowerLimit
      state.hotspotSyncBuffer = payload.hotspotSyncBuffer
      state.appRetryCount = payload.appRetryCount
      state.walletChartEnabled = payload.walletChartEnabled
      state.proxyEnabled = payload.proxyEnabled
      if (payload.tileServerRes8Url) {
        state.tileServerRes8Url = payload.tileServerRes8Url
      }
      if (payload.tileServerPointsUrl) {
        state.tileServerPointsUrl = payload.tileServerPointsUrl
      }
      state.featuresLoaded = true
    })
    builder.addCase(fetchFeatures.rejected, (state) => {
      state.featuresLoaded = false
    })
  },
})

export default featuresSlice
