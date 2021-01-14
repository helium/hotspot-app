import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getBlockHeight } from '../../utils/appDataClient'
import { signOut } from '../../utils/secureAccount'

export type HeliumDataState = {
  blockHeight?: number
}
const initialState: HeliumDataState = {}

export const fetchBlockHeight = createAsyncThunk<number>(
  'heliumData/blockHeight',
  async () => getBlockHeight(),
)

// This slice contains global helium data not specifically related to the current user
const heliumDataSlice = createSlice({
  name: 'heliumData',
  initialState,
  reducers: {
    signOut: () => {
      signOut()
      return { ...initialState, isRestored: true }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBlockHeight.fulfilled, (state, { payload }) => {
      state.blockHeight = payload
    })
  },
})

export default heliumDataSlice
