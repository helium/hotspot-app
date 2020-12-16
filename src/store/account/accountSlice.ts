import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Account, Hotspot, PendingTransaction } from '@helium/http'
import { unionBy } from 'lodash'
import {
  getHotspots,
  getAccount,
  getPendingTxnList,
} from '../../utils/appDataClient'

export type AccountState = {
  hotspots: Hotspot[]
  account?: Account
  mainDataLoading: 'idle' | 'pending' | 'succeeded' | 'failed'
  pendingTransactions: PendingTransaction[]
}

const initialState: AccountState = {
  hotspots: [],
  mainDataLoading: 'idle',
  pendingTransactions: [],
}

type AccountData = { hotspots: Hotspot[]; account?: Account }
export const fetchData = createAsyncThunk<AccountData>(
  'account/fetchData',
  async () => {
    try {
      const data = await Promise.all([getHotspots(), getAccount()])
      return { hotspots: data[0] || [], account: data[1] }
    } catch (e) {
      console.log(e)
      return { hotspots: [] }
    }
  },
)

export const fetchPendingTransactions = createAsyncThunk(
  'account/fetchPendingTransactions',
  async () => getPendingTxnList(),
)

// This slice contains data related to the user account
const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    addPendingTransaction: (
      state,
      action: PayloadAction<PendingTransaction>,
    ) => {
      state.pendingTransactions.push(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.pending, (state, _action) => {
      state.mainDataLoading = 'pending'
    })
    builder.addCase(fetchData.fulfilled, (state, { payload }) => {
      state.hotspots = payload.hotspots
      state.account = payload.account
    })
    builder.addCase(fetchData.rejected, (state, _action) => {
      state.mainDataLoading = 'failed'
    })
    builder.addCase(
      fetchPendingTransactions.fulfilled,
      (state, { payload }) => {
        state.pendingTransactions = unionBy(
          payload,
          state.pendingTransactions,
          'hash',
        )
      },
    )
  },
})

export default accountSlice
