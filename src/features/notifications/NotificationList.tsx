import { groupBy } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, RefreshControl } from 'react-native'
import { formatDistance, fromUnixTime } from 'date-fns'
import Box from '../../components/Box'
import Text from '../../components/Text'
import { Notification } from '../../store/account/accountSlice'
import NotificationGroup from './NotificationGroup'
import NotificationShow from './NotificationShow'
import animateTransition from '../../utils/animateTransition'

type Props = {
  notifications: Notification[]
  refreshing: boolean
  onRefresh: () => void
}
const NotificationList = ({ notifications, refreshing, onRefresh }: Props) => {
  const { t } = useTranslation()
  const [allNotifications, setAllNotifications] = useState<Array<Notification>>(
    [],
  )
  const [groupedNotifications, setGroupedNotifications] = useState<
    Array<Array<Notification>>
  >([])
  const [
    selectedNotification,
    setSelectedNotification,
  ] = useState<Notification | null>(null)

  useEffect(() => {
    if (notifications.length !== allNotifications.length) {
      setAllNotifications(notifications)
      return
    }
    notifications.some((propNotif, index) => {
      const notif = allNotifications[index]
      const isEqual =
        propNotif.id === notif.id && propNotif.viewed_at === notif.viewed_at

      if (!isEqual) {
        // data has changed update
        setAllNotifications(notifications)
      }
      return isEqual
    })
  }, [allNotifications, notifications])

  useEffect(() => {
    const now = new Date()

    const grouped = groupBy(allNotifications, (notification) =>
      formatDistance(fromUnixTime(notification.time), now, {
        addSuffix: true,
      }),
    )

    const arr = Object.keys(grouped)
      .map((k) => grouped[k].sort((a, b) => a.time - b.time))
      .sort((a, b) => b[0].time - a[0].time)

    animateTransition()
    setGroupedNotifications(arr)
  }, [allNotifications])

  return (
    <Box flex={1} alignContent="space-between">
      <Text variant="h3" marginVertical="m" flexGrow={1} paddingHorizontal="l">
        {t('notifications.list.title')}
      </Text>

      <FlatList
        inverted
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="white"
          />
        }
        refreshing={refreshing}
        style={{ flexGrow: 0 }}
        data={groupedNotifications}
        keyExtractor={(item) => item[0].id.toString()}
        renderItem={({ item }) => (
          <NotificationGroup
            notifications={item}
            onNotificationSelected={setSelectedNotification}
          />
        )}
      />
      <NotificationShow
        notification={selectedNotification}
        onClose={() => setSelectedNotification(null)}
      />
    </Box>
  )
}

export default NotificationList
