import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '../../components/Box'
import Text from '../../components/Text'
import { Notification } from '../../store/notifications/notificationSlice'
import parseMarkup from '../../utils/parseMarkup'
import TouchableHighlightBox from '../../components/TouchableHighlightBox'
import { useColors } from '../../theme/themeHooks'

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
  const colors = useColors()

  const isSingleItem = isFirst && isLast

  return (
    <Box>
      <Box flexDirection="row">
        <Box
          width={14}
          height="100%"
          borderRightWidth={2}
          borderRightColor="grayAccent"
        />
        <TouchableHighlightBox
          activeOpacity={0.9}
          underlayColor={colors.grayHighlight}
          flex={1}
          backgroundColor={viewed ? 'grayBox' : 'greenBright'}
          padding="m"
          marginBottom={isLast ? 'l' : 'none'}
          marginLeft="lm"
          marginTop="s"
          onPress={() => onNotificationSelected(notification)}
          borderRadius="m"
        >
          <>
            <Text
              variant="body2Medium"
              color={viewed ? 'grayText' : 'whitePurple'}
              marginBottom="xs"
            >
              {notification.title}
            </Text>
            <Text
              variant="body3"
              color={viewed ? 'grayExtraLight' : 'whitePurple'}
              numberOfLines={2}
            >
              {parseMarkup(notification.body)}
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
          </>
        </TouchableHighlightBox>
      </Box>
    </Box>
  )
}

export default memo(NotificationItem)
