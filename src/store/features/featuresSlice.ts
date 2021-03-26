import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getWallet } from '../../utils/walletClient'

export type FeaturesState = {
  discoveryEnabled: boolean
}

const initialState: FeaturesState = {
  discoveryEnabled: false,
}

export const fetchFeatures = createAsyncThunk<
  Record<'discoveryEnabled', boolean>
>('features/get', async () => getWallet('features'))

// This slice contains data related optional features within the app
const featuresSlice = createSlice({
  name: 'features',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchFeatures.rejected, (state, data) => {
      console.log('failed', data)
    })
    builder.addCase(fetchFeatures.fulfilled, (state, { payload }) => {
      console.log('success', payload)
      state.discoveryEnabled = payload.discoveryEnabled
    })
  },
})

export default featuresSlice
