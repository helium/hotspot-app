import React, { memo } from 'react'
import { formatDistance, fromUnixTime } from 'date-fns'
import Box from '../../components/Box'
import HeliumBubble from '../../assets/images/heliumBubble.svg'
import Text from '../../components/Text'
import { Notification } from '../../store/account/accountSlice'
import TouchableOpacityBox from '../../components/TouchableOpacityBox'

type Props = {
  notification: Notification
  isFirst: boolean
  isLast: boolean
  onNotificationSelected: (notification: Notification) => void
}
const NotificationItem = ({
  notification,
  isFirst,
  isLast,
  onNotificationSelected,
}: Props) => {
  const isNew = !notification.viewed_at

  // Stripping tags from the body text preview. (Not sure if this is necessary)
  const strippedBody = notification.body.replace(/(<([^>]+)>)/gi, '')

  return (
    <Box>
      <Box
        flexDirection="row"
        alignItems="flex-end"
        marginBottom={isLast ? 's' : 'none'}
      >
        <HeliumBubble />
        <TouchableOpacityBox
          activeOpacity={0.9}
          marginLeft="s"
          flex={1}
          backgroundColor="white"
          padding="lm"
          onPress={() => onNotificationSelected(notification)}
          borderBottomRightRadius={isLast ? 'm' : 'none'}
          borderTopLeftRadius={isFirst ? 'm' : 'none'}
          borderTopRightRadius={isFirst ? 'm' : 'none'}
          borderBottomWidth={!isLast ? 1 : 0}
          borderBottomColor="black"
        >
          <Text variant="body1Medium" color="black">
            {notification.title}
          </Text>
          {isNew && (
            <Text
              variant="body2Light"
              color="black"
              marginTop="s"
              numberOfLines={1}
            >
              {strippedBody}
            </Text>
          )}
        </TouchableOpacityBox>
      </Box>
      <Box flexDirection="row" alignItems="center" marginLeft="xxl">
        {isLast && (
          <>
            {isNew && (
              <Text variant="h7" marginRight="xs">
                NEW
              </Text>
            )}
            <Text variant="body3" fontSize={12} color="grayExtraLight">
              {formatDistance(fromUnixTime(notification.time), new Date(), {
                addSuffix: true,
              })}
            </Text>
          </>
        )}
      </Box>
    </Box>
  )
}

export default memo(NotificationItem)
