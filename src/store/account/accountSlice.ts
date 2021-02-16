import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Account, Hotspot } from '@helium/http'
import { getHotspots, getAccount } from '../../utils/appDataClient'
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
  hotspots: Hotspot[]
  notifications: Notification[]
  account?: Account
  fetchDataStatus: Loading
  markNotificationStatus: Loading
  activityChart: ActivityChart
}

const initialState: AccountState = {
  hotspots: [],
  notifications: [],
  fetchDataStatus: 'idle',
  markNotificationStatus: 'idle',
  activityChart: {
    daily: { data: [], loading: 'idle' },
    weekly: { data: [], loading: 'idle' },
    monthly: { data: [], loading: 'idle' },
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
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.pending, (state, _action) => {
      state.fetchDataStatus = 'pending'
      state.markNotificationStatus = 'pending'
    })
    builder.addCase(fetchData.fulfilled, (state, { payload }) => {
      state.fetchDataStatus = 'fulfilled'
      state.markNotificationStatus = 'fulfilled'
      state.hotspots = payload.hotspots
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
