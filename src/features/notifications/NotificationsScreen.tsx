import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { ActivityIndicator } from 'react-native'
import SafeAreaBox from '../../components/SafeAreaBox'
import { RootState } from '../../store/rootReducer'
import { useAppDispatch } from '../../store/store'
import useVisible from '../../utils/useVisible'
import EmptyNotifications from './EmptyNotifications'
import NotificationList from './NotificationList'
import {
  fetchNotifications,
  markNotificationsViewed,
} from '../../store/notifications/notificationSlice'
import Box from '../../components/Box'

const NotificationsScreen = () => {
  const {
    notifications,
    markNotificationStatus,
    loadingNotification,
  } = useSelector((state: RootState) => state.notifications)
  const dispatch = useAppDispatch()

  const markAsRead = useCallback(() => {
    if (!notifications.find((n) => !n.viewed_at)) return

    dispatch(markNotificationsViewed())
  }, [notifications, dispatch])

  const refreshNotifications = useCallback(() => {
    if (markNotificationStatus === 'pending') return

    dispatch(fetchNotifications())
  }, [dispatch, markNotificationStatus])

  useVisible({ onAppear: refreshNotifications, onDisappear: markAsRead })

  return (
    <SafeAreaBox
      backgroundColor="primaryBackground"
      edges={['top', 'left', 'right']}
      flex={1}
    >
      {notifications.length > 0 && (
        <NotificationList
          notifications={notifications}
          onRefresh={refreshNotifications}
          refreshing={markNotificationStatus === 'pending'}
        />
      )}
      {notifications.length === 0 && !loadingNotification && (
        <EmptyNotifications />
      )}
      {notifications.length === 0 && loadingNotification && (
        <Box justifyContent="center" alignItems="center" flex={1}>
          <ActivityIndicator color="white" />
        </Box>
      )}
    </SafeAreaBox>
  )
}

export default NotificationsScreen
