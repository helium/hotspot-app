import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getWallet } from '../../utils/walletClient'

export type FeaturesState = {
  fleetModeLowerLimit?: number
  hotspotSyncBuffer?: number
}

const initialState: FeaturesState = {}

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
    builder.addCase(fetchFeatures.fulfilled, (state, { payload }) => {
      state.fleetModeLowerLimit = payload.fleetModeLowerLimit
      state.hotspotSyncBuffer = payload.hotspotSyncBuffer
    })
  },
})

export default featuresSlice
