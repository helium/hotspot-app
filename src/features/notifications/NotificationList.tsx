import { groupBy } from 'lodash'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RefreshControl, SectionList } from 'react-native'
import { formatDistance, fromUnixTime } from 'date-fns'
import Box from '../../components/Box'
import Text, { TextProps } from '../../components/Text'
import NotificationShow from './NotificationShow'
import {
  fetchMoreNotifications,
  Notification,
  NotificationFilter,
} from '../../store/notifications/notificationSlice'
import { useColors, useSpacing } from '../../theme/themeHooks'
import NotificationItem from './NotificationItem'
import NotificationGroupHeader from './NotificationGroupHeader'
import { useAppDispatch } from '../../store/store'
import HeliumActionSheet from '../../components/HeliumActionSheet'
import EmptyNotifications from './EmptyNotifications'

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
  onFilterChanged: (filter: NotificationFilter) => void
  filter: NotificationFilter
}
const NotificationList = ({
  notifications,
  refreshing,
  onRefresh,
  onFilterChanged,
  filter,
}: Props) => {
  const { t } = useTranslation()
  const colors = useColors()
  const spacing = useSpacing()
  const dispatch = useAppDispatch()
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
      if (iconUrl.includes('transfer')) {
        return t('notifications.hotspot_transfers')
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
    const now = new Date()

    const grouped = groupBy(
      notifications,
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

    setGroupedNotifications(arr)
  }, [notifications, getNotificationGroupTitle, t])

  const loadMoreNotifications = useCallback(() => {
    dispatch(
      fetchMoreNotifications({
        lastId: notifications[notifications.length - 1].id,
        filter,
      }),
    )
  }, [dispatch, filter, notifications])

  const listContainerStyle = useMemo(
    () => ({
      paddingHorizontal: spacing.l,
      paddingTop: spacing.l,
    }),
    [spacing.l],
  )

  const listIndicatorInsets = useMemo(
    () => ({
      top: spacing.m,
      bottom: spacing.m,
      left: 0,
      right: 0,
    }),
    [spacing.m],
  )

  const listKeyExtractor = useCallback((item) => item.time.toString(), [])

  const renderListItem = useCallback(
    ({ item, index, section }) => (
      <NotificationItem
        onNotificationSelected={setSelectedNotification}
        notification={item}
        isLast={index === section.data.length - 1}
      />
    ),
    [],
  )

  const renderListHeader = useCallback(
    ({ section: { title, icon, time } }) => (
      <NotificationGroupHeader title={title} icon={icon} time={time} />
    ),
    [],
  )

  const onCloseNotification = useCallback(
    () => setSelectedNotification(null),
    [],
  )

  const onSelectFilter = useCallback(
    (value) => {
      onFilterChanged(value)
    },
    [onFilterChanged],
  )

  const filterActionSheetData = useMemo(
    () => [
      { label: 'All Messages', value: NotificationFilter.ALL },
      {
        label: t('notifications.helium_updates'),
        value: NotificationFilter.HELIUM_UPDATES,
      },
      {
        label: t('notifications.hotspot_updates'),
        value: NotificationFilter.HOTSPOT_UPDATES,
      },
      {
        label: t('notifications.weekly_earnings'),
        value: NotificationFilter.WEEKLY_EARNINGS,
      },
      {
        label: t('notifications.hotspot_transfers'),
        value: NotificationFilter.HOTSPOT_TRANSFER,
      },
      {
        label: t('notifications.failure_notifications'),
        value: NotificationFilter.FAILED_NOTIFICATIONS,
      },
    ],
    [t],
  )

  const filterActionSheetTextStyle = useMemo(
    () => ({ color: 'grayText', fontSize: 15 } as TextProps),
    [],
  )

  return (
    <Box flex={1}>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        padding="l"
        paddingBottom="xl"
      >
        <Text variant="h3" flexGrow={1}>
          {t('notifications.list.title')}
        </Text>
        <HeliumActionSheet
          data={filterActionSheetData}
          selectedValue={filter}
          onValueSelected={onSelectFilter}
          title="Filter Notifications"
          textProps={filterActionSheetTextStyle}
          iconVariant="carot"
          iconColor="grayText"
        />
      </Box>

      <Box backgroundColor="white" borderRadius="xl" flex={1}>
        <SectionList
          stickySectionHeadersEnabled={false}
          contentContainerStyle={listContainerStyle}
          scrollIndicatorInsets={listIndicatorInsets}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.grayLight}
            />
          }
          refreshing={refreshing}
          sections={groupedNotifications}
          keyExtractor={listKeyExtractor}
          renderItem={renderListItem}
          renderSectionHeader={renderListHeader}
          onEndReached={loadMoreNotifications}
          onEndReachedThreshold={0.2}
          ListEmptyComponent={<EmptyNotifications />}
        />
        <NotificationShow
          notification={selectedNotification}
          onClose={onCloseNotification}
        />
      </Box>
    </Box>
  )
}

export default NotificationList
