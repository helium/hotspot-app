import React, { useCallback, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Edge } from 'react-native-safe-area-context'
import { useAsync } from 'react-async-hook'
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
    if (!notifications.find((n) => !n.viewedAt)) return

    dispatch(markNotificationsViewed())
  }, [notifications, dispatch])

  const refreshNotifications = useCallback(async () => {
    if (markNotificationStatus === 'pending') return

    await dispatch(fetchNotifications(filter))
  }, [dispatch, filter, markNotificationStatus])

  useAsync(async () => {
    await refreshNotifications()
  }, [])

  useVisible({ onDisappear: markAsRead })

  const onFilterChanged = useCallback(
    (notificationFilter: NotificationFilter) => {
      setFilter(notificationFilter)
      dispatch(fetchNotifications(notificationFilter))
    },
    [dispatch],
  )

  const edges = useMemo(() => ['top', 'left', 'right'] as Edge[], [])

  return (
    <SafeAreaBox backgroundColor="primaryBackground" edges={edges} flex={1}>
      <NotificationList
        notifications={notifications}
        loadingNotification={loadingNotification}
        onRefresh={refreshNotifications}
        refreshing={loadingNotification}
        onFilterChanged={onFilterChanged}
        filter={filter}
      />
    </SafeAreaBox>
  )
}

export default NotificationsScreen
