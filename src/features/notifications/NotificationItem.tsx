import React, { memo, useCallback, useMemo } from 'react'
import Box from '../../components/Box'
import Text from '../../components/Text'
import { Notification } from '../../store/notifications/notificationSlice'
import parseMarkup from '../../utils/parseMarkup'
import TouchableHighlightBox from '../../components/TouchableHighlightBox'
import { useColors } from '../../theme/themeHooks'
import CarotRight from '../../assets/images/carot-right.svg'

type Props = {
  notification: Notification
  isLast: boolean
  onNotificationSelected: (notification: Notification) => void
}
const NotificationItem = ({
  notification,
  isLast,
  onNotificationSelected,
}: Props) => {
  const viewed = !!notification.viewedAt
  const colors = useColors()

  const onNotificationPress = useCallback(
    () => onNotificationSelected(notification),
    [notification, onNotificationSelected],
  )

  const body = useMemo(() => parseMarkup(notification.body), [
    notification.body,
  ])

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
          backgroundColor="grayBox"
          marginBottom={isLast ? 'l' : 'none'}
          marginLeft="lm"
          marginTop="s"
          onPress={onNotificationPress}
          borderRadius="m"
        >
          <Box flexDirection="row" justifyContent="space-between" padding="m">
            <Box width="95%">
              <Box flexDirection="row" alignItems="center" marginBottom="xs">
                {!viewed && (
                  <Box
                    borderRadius="round"
                    backgroundColor="purpleMain"
                    width={8}
                    height={8}
                    marginRight="xs"
                  />
                )}
                <Text
                  variant="body2Medium"
                  color={viewed ? 'grayText' : 'black'}
                >
                  {notification.title}
                </Text>
              </Box>
              <Text variant="body2" color="grayExtraLight" numberOfLines={2}>
                {body}
              </Text>
            </Box>
            <Box alignItems="center" justifyContent="center">
              <CarotRight color={colors.grayLight} />
            </Box>
          </Box>
        </TouchableHighlightBox>
      </Box>
    </Box>
  )
}

export default memo(NotificationItem)
