import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Account } from '@helium/http'
import { getAccount } from '../../utils/appDataClient'
import { getWallet, postWallet } from '../../utils/walletClient'
import { ChartData, ChartRange } from '../../components/BarChart/types'
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

type ChartRangeData = { data: ChartData[]; loading: Loading }
type ActivityChart = {
  daily: ChartRangeData
  weekly: ChartRangeData
  monthly: ChartRangeData
}

export type AccountState = {
  notifications: Notification[]
  account?: Account
  fetchDataStatus: Loading
  markNotificationStatus: Loading
  activityChart: ActivityChart
  activityChartRange: ChartRange
}

const initialState: AccountState = {
  notifications: [],
  fetchDataStatus: 'idle',
  markNotificationStatus: 'idle',
  activityChart: {
    daily: { data: [], loading: 'idle' },
    weekly: { data: [], loading: 'idle' },
    monthly: { data: [], loading: 'idle' },
  },
  activityChartRange: 'daily',
}

type AccountData = {
  account?: Account
  notifications: Notification[]
}

export const fetchData = createAsyncThunk<AccountData>(
  'account/fetchData',
  async () => {
    const data = await Promise.all([getAccount(), getWallet('notifications')])
    return {
      account: data[0],
      notifications: data[1] || [],
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

type ActivityChartParams = { range: ChartRange; filterType: FilterType }
export const fetchActivityChart = createAsyncThunk<
  ChartData[],
  ActivityChartParams
>('account/fetchActivityChart', async ({ range, filterType }) => {
  return getWallet('wallet/chart', { range, type: filterType })
})

// This slice contains data related to the user account
const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    signOut: () => {
      return { ...initialState }
    },
    resetActivityChart: (state) => {
      return { ...state, activityChart: initialState.activityChart }
    },
    setActivityChartRange: (state, action: PayloadAction<ChartRange>) => {
      return { ...state, activityChartRange: action.payload }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.pending, (state, _action) => {
      state.fetchDataStatus = 'pending'
      state.markNotificationStatus = 'pending'
    })
    builder.addCase(fetchData.fulfilled, (state, { payload }) => {
      state.fetchDataStatus = 'fulfilled'
      state.markNotificationStatus = 'fulfilled'
      state.account = payload.account
      state.notifications = payload.notifications
    })
    builder.addCase(fetchData.rejected, (state, _action) => {
      state.fetchDataStatus = 'rejected'
      state.markNotificationStatus = 'rejected'
    })
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
    builder.addCase(fetchActivityChart.pending, (state, { meta }) => {
      state.activityChart[meta.arg.range].loading = 'pending'
    })
    builder.addCase(
      fetchActivityChart.fulfilled,
      (state, { meta, payload }) => {
        state.activityChart[meta.arg.range].loading = 'fulfilled'
        state.activityChart[meta.arg.range].data = payload
      },
    )
    builder.addCase(fetchActivityChart.rejected, (state, { meta }) => {
      state.activityChart[meta.arg.range].loading = 'rejected'
    })
  },
})

export default accountSlice
