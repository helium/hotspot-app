import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Account, Hotspot, PendingTransaction } from '@helium/http'
import { unionBy } from 'lodash'
import {
  getHotspots,
  getAccount,
  getPendingTxnList,
} from '../../utils/appDataClient'
import { getWallet } from '../../utils/walletClient'

export type Notification = {
  account_address: string
  body: string
  color?: string | null
  footer?: string | null
  hotspot_address?: string | null
  hotspot_name?: string | null
  icon: string
  id: number
  share_text?: string | null
  style: string
  time: number
  title: string
  viewed_at?: string | null
}

export type AccountState = {
  hotspots: Hotspot[]
  notifications: Notification[]
  account?: Account
  mainDataLoading: 'idle' | 'pending' | 'succeeded' | 'failed'
  pendingTransactions: PendingTransaction[]
}

const initialState: AccountState = {
  hotspots: [],
  notifications: [],
  mainDataLoading: 'idle',
  pendingTransactions: [],
}

type AccountData = {
  hotspots: Hotspot[]
  account?: Account
  notifications: Notification[]
}
export const fetchData = createAsyncThunk<AccountData>(
  'account/fetchData',
  async () => {
    const data = await Promise.all(
      [getHotspots(), getAccount(), getWallet('notifications')].map((p) =>
        p.catch((e) => {
          console.log('fetchDataError:', e)
        }),
      ),
    )
    return {
      hotspots: data[0] || [],
      account: data[1],
      notifications: data[2] || [],
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
      state.mainDataLoading = 'succeeded'
      state.hotspots = payload.hotspots
      state.account = payload.account
      state.notifications = payload.notifications
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
