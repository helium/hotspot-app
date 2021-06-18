import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getWallet } from '../../utils/walletClient'

export type FeaturesState = {
  discoveryEnabled: boolean
  checklistEnabled: boolean
  followHotspotEnabled: boolean
  qrOnboardEnabled?: boolean
}

const initialState: FeaturesState = {
  discoveryEnabled: false,
  checklistEnabled: false,
  followHotspotEnabled: true,
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
    builder.addCase(fetchFeatures.fulfilled, (state, { payload }) => {
      state.discoveryEnabled = payload.discoveryEnabled
      state.checklistEnabled = payload.checklistEnabled
      state.followHotspotEnabled = payload.followHotspotEnabled
      state.qrOnboardEnabled = payload.qrOnboardEnabled
    })
  },
})

export default featuresSlice
