import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Hotspot } from '@helium/http'
import { fetchHotspots } from '../../utils/appDataClient'

export type AccountState = {
  hotspots: Hotspot[]
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState: AccountState = { hotspots: [], loading: 'idle' }

type AccountData = { hotspots: Hotspot[] }
export const fetchData = createAsyncThunk<AccountData>(
  'account/fetchData',
  async () => {
    try {
      const data = await Promise.all([fetchHotspots()])
      return { hotspots: data[0] || [] }
    } catch (e) {}

    return { hotspots: [] }
  },
)

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchData.pending, (state, _action) => {
      state.loading = 'pending'
    })
    builder.addCase(fetchData.fulfilled, (state, { payload }) => {
      return { ...state, ...payload }
    })
    builder.addCase(fetchData.rejected, (state, _action) => {
      state.loading = 'failed'
    })
  },
})

export default accountSlice
