import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import {
  Account,
  Hotspot,
  PendingTransaction,
  AnyTransaction,
} from '@helium/http'
import { unionBy } from 'lodash'
import { getHotspots, getAccount, txnFetchers } from '../../utils/appDataClient'
import { getWallet, postWallet } from '../../utils/walletClient'
import { FilterType } from '../../features/wallet/root/walletTypes'

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

type Loading = 'idle' | 'pending' | 'fulfilled' | 'rejected'

export type AccountState = {
  hotspots: Hotspot[]
  notifications: Notification[]
  account?: Account
  mainDataStatus: Loading
  markNotificationStatus: Loading
  txns: {
    all: { data: AnyTransaction[]; status: Loading }
    hotspot: { data: AnyTransaction[]; status: Loading }
    mining: { data: AnyTransaction[]; status: Loading }
    payment: { data: AnyTransaction[]; status: Loading }
    pending: { data: PendingTransaction[]; status: Loading }
  }
}

const initialState: AccountState = {
  hotspots: [],
  notifications: [],
  mainDataStatus: 'idle',
  markNotificationStatus: 'idle',
  txns: {
    all: { data: [], status: 'idle' },
    hotspot: { data: [], status: 'idle' },
    mining: { data: [], status: 'idle' },
    payment: { data: [], status: 'idle' },
    pending: { data: [], status: 'idle' },
  },
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

export const fetchNotifications = createAsyncThunk<Notification[]>(
  'account/fetchNotifications',
  async () => getWallet('notifications'),
)
export const markNotificationsViewed = createAsyncThunk<Notification[]>(
  'account/markNotificationsViewed',
  async () => {
    await postWallet('notifications/view')
    return getWallet('notifications')
  },
)

export const fetchTxns = createAsyncThunk<
  AnyTransaction[] | PendingTransaction[],
  FilterType
>('account/fetchAccountActivity', async (filterType) => {
  const list = txnFetchers[filterType]
  return list.takeJSON(filterType === 'pending' ? 1000 : 30)
})

// This slice contains data related to the user account
const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    addPendingTransaction: (
      state,
      action: PayloadAction<PendingTransaction>,
    ) => {
      state.txns.pending.data.push(action.payload)
    },
    signOut: () => {
      return { ...initialState }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.pending, (state, _action) => {
      state.mainDataStatus = 'pending'
      state.markNotificationStatus = 'pending'
    })
    builder.addCase(fetchData.fulfilled, (state, { payload }) => {
      state.mainDataStatus = 'fulfilled'
      state.markNotificationStatus = 'fulfilled'
      state.hotspots = payload.hotspots
      state.account = payload.account
      state.notifications = payload.notifications
    })
    builder.addCase(fetchData.rejected, (state, _action) => {
      state.mainDataStatus = 'rejected'
      state.markNotificationStatus = 'rejected'
    })
    builder.addCase(fetchTxns.pending, (state, { meta: { arg } }) => {
      state.txns[arg].status = 'pending'
    })
    builder.addCase(fetchTxns.rejected, (state, { meta: { arg } }) => {
      state.txns[arg].status = 'rejected'
    })
    builder.addCase(
      fetchTxns.fulfilled,
      (state, { payload, meta: { arg } }) => {
        state.txns[arg].status = 'fulfilled'
        if (arg === 'pending') {
          const pending = payload as PendingTransaction[]
          const filtered = pending.filter((txn) => txn.status === 'pending')
          const joined = unionBy(filtered, state.txns.pending.data, 'hash')
          state.txns.pending.data = joined
        } else {
          state.txns[arg].data = [
            ...state.txns[arg].data,
            ...(payload as AnyTransaction[]),
          ]
        }
      },
    )
    builder.addCase(markNotificationsViewed.pending, (state, _action) => {
      state.markNotificationStatus = 'pending'
    })
    builder.addCase(markNotificationsViewed.fulfilled, (state, { payload }) => {
      state.markNotificationStatus = 'fulfilled'
      state.notifications = payload
    })
    builder.addCase(markNotificationsViewed.rejected, (state, _action) => {
      state.markNotificationStatus = 'rejected'
    })
    builder.addCase(fetchNotifications.fulfilled, (state, { payload }) => {
      state.notifications = payload
    })
  },
})

export default accountSlice
