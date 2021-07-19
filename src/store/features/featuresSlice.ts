import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getWallet } from '../../utils/walletClient'

export type FeaturesState = {
  checklistEnabled: boolean
  followHotspotEnabled: boolean
  fleetModeLimit?: number
}

const initialState: FeaturesState = {
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
      state.checklistEnabled = payload.checklistEnabled
      state.followHotspotEnabled = payload.followHotspotEnabled
      state.fleetModeLimit = 20
    })
  },
})

export default featuresSlice
