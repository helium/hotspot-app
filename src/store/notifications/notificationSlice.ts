import { createSlice } from '@reduxjs/toolkit'
import { OSNotification } from 'react-native-onesignal'

export type NotificationState = {
  notification?: OSNotification
}

const notificationSlice = createSlice({
  name: 'location',
  initialState: {} as NotificationState,
  reducers: {
    notificationOpened: (
      state,
      { payload: notification }: { payload: OSNotification },
    ) => {
      state.notification = notification
    },
    notificationHandled: (state) => {
      state.notification = undefined
    },
  },
})

export default notificationSlice
