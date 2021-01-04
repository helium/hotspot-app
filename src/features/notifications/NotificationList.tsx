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

type Props = {
  notifications: Notification[]
  refreshing: boolean
  onRefresh: () => void
}
const NotificationList = ({ notifications, refreshing, onRefresh }: Props) => {
  const { t } = useTranslation()
  const [groupedNotifications, setGroupedNotifications] = useState<
    Array<Array<Notification>>
  >([])
  const [
    selectedNotification,
    setSelectedNotification,
  ] = useState<Notification | null>(null)

  useEffect(() => {
    // TODO: Figure out how to group these.
    // Currently, they are grouped by the date-fns function formatDistance
    // Then, sorted newest to oldest
    // Seems good, but need to confirm

    const now = new Date()

    const grouped = groupBy(notifications, (notification) =>
      formatDistance(fromUnixTime(notification.time), now, {
        addSuffix: true,
      }),
    )

    const arr = Object.keys(grouped)
      .map((k) => grouped[k])
      .sort((a) => a[0].time)

    setGroupedNotifications(arr)
  }, [notifications])

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
        keyExtractor={(item, idx) => `${item[0].id}.${idx}`}
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
