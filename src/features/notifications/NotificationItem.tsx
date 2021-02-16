import React, { memo } from 'react'
import { formatDistance, fromUnixTime } from 'date-fns'
import { useTranslation } from 'react-i18next'
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
  const viewed = !!notification.viewed_at
  const { t } = useTranslation()

  const isSingleItem = isFirst && isLast

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
          backgroundColor={viewed ? 'purple100' : 'greenBright'}
          padding="lm"
          onPress={() => onNotificationSelected(notification)}
          borderBottomRightRadius={isLast ? 'm' : 'none'}
          borderTopLeftRadius={isFirst ? 'm' : 'none'}
          borderTopRightRadius={isFirst ? 'm' : 'none'}
          borderBottomWidth={!isLast ? 1 : 0}
          borderBottomColor="primaryBackground"
        >
          <Text
            variant="body1Medium"
            color={viewed ? 'grayExtraLight' : 'whitePurple'}
          >
            {notification.title}
          </Text>
          {!viewed && isSingleItem && (
            <Text
              variant="body1Light"
              fontSize={16}
              color="black"
              marginTop="s"
              numberOfLines={1}
            >
              {t('notifications.tapToReadMore')}
            </Text>
          )}
        </TouchableOpacityBox>
      </Box>
      <Box flexDirection="row" alignItems="center" marginLeft="xxl">
        {isLast && (
          <>
            {!viewed && (
              <Text variant="h7" marginRight="xs" textTransform="uppercase">
                {t('generic.new')}
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

// const areEqual = (prev: Props, next: Props) =>
//   prev.notification.id === next.notification.id &&
//   prev.notification.viewed_at === next.notification.viewed_at

export default memo(NotificationItem)
