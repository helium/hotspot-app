import React, { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import SafeAreaBox from '../../components/SafeAreaBox'
import { RootState } from '../../store/rootReducer'
import { useAppDispatch } from '../../store/store'
import useVisible from '../../utils/useVisible'
import NotificationList from './NotificationList'
import {
  fetchNotifications,
  markNotificationsViewed,
  NotificationFilter,
} from '../../store/notifications/notificationSlice'

const NotificationsScreen = () => {
  const {
    notifications,
    markNotificationStatus,
    loadingNotification,
  } = useSelector((state: RootState) => state.notifications)
  const dispatch = useAppDispatch()
  const [filter, setFilter] = useState<NotificationFilter>(
    NotificationFilter.ALL,
  )

  const markAsRead = useCallback(() => {
    if (!notifications.find((n) => !n.viewed_at)) return

    dispatch(markNotificationsViewed())
  }, [notifications, dispatch])

  const refreshNotifications = useCallback(() => {
    if (markNotificationStatus === 'pending') return

    dispatch(fetchNotifications(filter))
  }, [dispatch, filter, markNotificationStatus])

  useVisible({ onAppear: refreshNotifications, onDisappear: markAsRead })

  const onFilterChanged = useCallback(
    (notificationFilter: NotificationFilter) => {
      setFilter(notificationFilter)
      dispatch(fetchNotifications(notificationFilter))
    },
    [dispatch],
  )

  return (
    <SafeAreaBox
      backgroundColor="primaryBackground"
      edges={['top', 'left', 'right']}
      flex={1}
    >
      <NotificationList
        notifications={notifications}
        loadingNotification={loadingNotification}
        onRefresh={refreshNotifications}
        refreshing={markNotificationStatus === 'pending'}
        onFilterChanged={onFilterChanged}
        filter={filter}
      />
    </SafeAreaBox>
  )
}

export default NotificationsScreen
