import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Stats } from './statsTypes'

export type StatsState = {
  error: string
  data: Stats | null
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
}
const initialState: StatsState = { error: '', data: null, loading: 'idle' }

export const fetchStats = createAsyncThunk<Stats>('stats/get', async () => {
  const response = await fetch('https://api.helium.io/v1/stats')
  const json = await response.json()
  return json.data as Stats
})

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchStats.pending, (state, _action) => {
      state.loading = 'pending'
      state.error = ''
    })
    builder.addCase(fetchStats.fulfilled, (state, { payload }) => {
      state.loading = 'succeeded'
      state.data = payload
    })
    builder.addCase(fetchStats.rejected, (state, action) => {
      Object.assign(state, action.payload)
      state.loading = 'failed'
    })
  },
})

export default statsSlice
