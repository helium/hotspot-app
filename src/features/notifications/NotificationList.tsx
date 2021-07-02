import { groupBy } from 'lodash'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RefreshControl, SectionList } from 'react-native'
import { formatDistance, fromUnixTime } from 'date-fns'
import Box from '../../components/Box'
import Text from '../../components/Text'
import NotificationShow from './NotificationShow'
import animateTransition from '../../utils/animateTransition'
import { Notification } from '../../store/notifications/notificationSlice'
import { useColors, useSpacing } from '../../theme/themeHooks'
import NotificationItem from './NotificationItem'
import NotificationGroupHeader from './NotificationGroupHeader'

export type NotificationGroupData = {
  title: string
  data: Notification[]
  icon: string
  time: string
}

type Props = {
  notifications: Notification[]
  refreshing: boolean
  onRefresh: () => void
}
const NotificationList = ({ notifications, refreshing, onRefresh }: Props) => {
  const { t } = useTranslation()
  const colors = useColors()
  const spacing = useSpacing()
  const [allNotifications, setAllNotifications] = useState<Array<Notification>>(
    [],
  )
  const [groupedNotifications, setGroupedNotifications] = useState<
    Array<NotificationGroupData>
  >([])
  const [
    selectedNotification,
    setSelectedNotification,
  ] = useState<Notification | null>(null)

  const getNotificationGroupTitle = useCallback(
    (iconUrl: string) => {
      if (iconUrl.includes('hotspot-update')) {
        return t('notifications.hotspot_updates')
      }
      if (iconUrl.includes('helium-update')) {
        return t('notifications.helium_updates')
      }
      if (iconUrl.includes('earnings')) {
        return t('notifications.weekly_earnings')
      }
      if (iconUrl.includes('failed-txn')) {
        return t('notifications.failure_notifications')
      }
      return t('notifications.helium_updates')
    },
    [t],
  )

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

    const grouped = groupBy(
      allNotifications,
      (notification) =>
        formatDistance(fromUnixTime(notification.time), now, {
          addSuffix: true,
        }) + notification.icon,
    )

    const arr = Object.keys(grouped)
      .map((k) => ({
        title: getNotificationGroupTitle(grouped[k][0].icon),
        icon: grouped[k][0].icon,
        time: formatDistance(fromUnixTime(grouped[k][0].time), new Date(), {
          addSuffix: true,
        }),
        data: grouped[k].sort((a, b) => b.time - a.time),
      }))
      .sort((a, b) => b.data[0].time - a.data[0].time)

    animateTransition('NotificationList.SortedAndGrouped')
    setGroupedNotifications(arr)
  }, [allNotifications, getNotificationGroupTitle, t])

  return (
    <Box flex={1} marginBottom="m">
      <Text variant="h3" marginVertical="m" flexGrow={1} paddingHorizontal="l">
        {t('notifications.list.title')}
      </Text>

      <Box
        backgroundColor="white"
        borderRadius="xl"
        marginBottom="xl"
        overflow="hidden"
      >
        <SectionList
          stickySectionHeadersEnabled={false}
          contentContainerStyle={{
            paddingHorizontal: spacing.l,
            paddingTop: spacing.l,
          }}
          scrollIndicatorInsets={{
            top: spacing.m,
            bottom: spacing.m,
            left: 0,
            right: 0,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.grayLight}
            />
          }
          refreshing={refreshing}
          style={{ flexGrow: 0 }}
          sections={groupedNotifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index, section }) => (
            <NotificationItem
              onNotificationSelected={setSelectedNotification}
              notification={item}
              isFirst={index === 0}
              isLast={index === section.data.length - 1}
            />
          )}
          renderSectionHeader={({ section: { title, icon, time } }) => (
            <NotificationGroupHeader title={title} icon={icon} time={time} />
          )}
        />
        <NotificationShow
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
        />
      </Box>
    </Box>
  )
}

export default NotificationList
