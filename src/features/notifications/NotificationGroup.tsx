import React, { memo } from 'react'
import { formatDistance, fromUnixTime } from 'date-fns'
import Box from '../../components/Box'
import Text from '../../components/Text'
import { Notification } from '../../store/notifications/notificationSlice'
import NotificationItem from './NotificationItem'
import ImageBox from '../../components/ImageBox'

const getNotificationGroupTitle = (iconUrl: string) => {
  // TODO localize & failed notifications
  if (iconUrl.includes('hotspot-update')) {
    return 'Hotspot Updates'
  }
  if (iconUrl.includes('helium-update')) {
    return 'Helium Updates'
  }
  if (iconUrl.includes('earnings')) {
    return 'Weekly Earnings'
  }
  return ''
}

type Props = {
  notifications: Notification[]
  onNotificationSelected: (notification: Notification) => void
  isFirst: boolean
}
const NotificationGroup = ({
  isFirst,
  notifications,
  onNotificationSelected,
}: Props) => {
  const lastIndex = notifications.length - 1
  return (
    <Box paddingHorizontal="l">
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        marginBottom="xs"
        marginTop={isFirst ? 'l' : 'xs'}
      >
        <Box flexDirection="row" alignItems="center">
          <ImageBox
            borderRadius="round"
            source={{
              uri: notifications[0].icon,
              method: 'GET',
            }}
            resizeMode="contain"
            width={26}
            height={26}
            marginRight="s"
          />
          <Text variant="h5" color="grayBlack">
            {getNotificationGroupTitle(notifications[0].icon)}
          </Text>
        </Box>
        <Text variant="body3" fontSize={12} color="grayExtraLight">
          {formatDistance(
            fromUnixTime(notifications[lastIndex].time),
            new Date(),
            {
              addSuffix: true,
            },
          )}
        </Text>
      </Box>
      {notifications.map((notification, idx) => (
        <NotificationItem
          onNotificationSelected={onNotificationSelected}
          key={`${notification.id}`}
          notification={notification}
          isFirst={idx === 0}
          isLast={idx === notifications.length - 1}
        />
      ))}
    </Box>
  )
}

export default memo(NotificationGroup)
