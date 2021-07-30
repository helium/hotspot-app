import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { OSNotification } from 'react-native-onesignal'
import { getWallet, postWallet } from '../../utils/walletClient'
import { Loading } from '../activity/activitySlice'

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

export enum NotificationFilter {
  ALL = 'all',
  HELIUM_UPDATES = 'helium-update',
  HOTSPOT_UPDATES = 'hotspot-update',
  HOTSPOT_TRANSFER = 'transfer',
  WEEKLY_EARNINGS = 'earnings',
  FAILED_NOTIFICATIONS = 'failed-txn',
}

export type NotificationState = {
  pushNotification?: OSNotification
  notifications: Notification[]
  markNotificationStatus: Loading
  loadingNotification: boolean
}

export const fetchNotifications = createAsyncThunk<Notification[]>(
  'account/fetchNotifications',
  async () => getWallet('notifications'),
)

export const fetchMoreNotifications = createAsyncThunk<Notification[], number>(
  'account/fetchMoreNotifications',
  async (lastId: number) =>
    getWallet('notifications', {
      before: lastId,
    }),
)

export const markNotificationsViewed = createAsyncThunk<Notification[]>(
  'account/markNotificationsViewed',
  async () => {
    await postWallet('notifications/view')
    return getWallet('notifications')
  },
)

const initialState = {
  notifications: [],
  markNotificationStatus: 'idle',
  loadingNotification: false,
} as NotificationState

const notificationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    pushNotificationOpened: (
      state,
      { payload: notification }: { payload: OSNotification },
    ) => {
      state.pushNotification = notification
    },
    pushNotificationHandled: (state) => {
      state.pushNotification = undefined
    },
  },
  extraReducers: (builder) => {
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
    builder.addCase(fetchNotifications.pending, (state, _action) => {
      state.loadingNotification = true
    })
    builder.addCase(fetchNotifications.fulfilled, (state, { payload }) => {
      state.notifications = payload
      state.loadingNotification = false
    })
    builder.addCase(fetchNotifications.rejected, (state, _action) => {
      state.loadingNotification = false
    })
    builder.addCase(fetchMoreNotifications.pending, (state, _action) => {
      state.loadingNotification = true
    })
    builder.addCase(fetchMoreNotifications.fulfilled, (state, { payload }) => {
      state.notifications = [...state.notifications, ...payload]
      state.loadingNotification = false
    })
    builder.addCase(fetchMoreNotifications.rejected, (state, _action) => {
      state.loadingNotification = false
    })
  },
})

export default notificationSlice
