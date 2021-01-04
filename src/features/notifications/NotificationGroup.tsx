import React, { memo } from 'react'
import Box from '../../components/Box'
import { Notification } from '../../store/account/accountSlice'
import NotificationItem from './NotificationItem'

type Props = {
  notifications: Notification[]
  onNotificationSelected: (notification: Notification) => void
}
const NotificationGroup = ({
  notifications,
  onNotificationSelected,
}: Props) => {
  return (
    <Box marginBottom="xl" paddingHorizontal="l">
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
