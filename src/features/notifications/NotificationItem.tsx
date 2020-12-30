import React, { memo, useEffect } from 'react'
import { formatDistance, fromUnixTime } from 'date-fns'
import Animated, {
  withSpring,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import Box from '../../components/Box'
import HeliumBubble from '../../assets/images/heliumBubble.svg'
import Text from '../../components/Text'
import { Notification } from '../../store/account/accountSlice'
import TouchableOpacityBox from '../../components/TouchableOpacityBox'
import usePrevious from '../../utils/usePrevious'

const COLLAPSED_HEIGHT = 61
const EXPANDED_HEIGHT = 81
const BOTTOM_SECTION_HEIGHT = 20

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
  const prevViewed = usePrevious(!!notification.viewed_at)
  const offset = isLast ? BOTTOM_SECTION_HEIGHT : 0

  const heightWithOffset = (hasViewed: boolean) =>
    (hasViewed ? COLLAPSED_HEIGHT : EXPANDED_HEIGHT) + offset

  const height = heightWithOffset(viewed)

  const heightPrev =
    prevViewed === undefined ? height : heightWithOffset(prevViewed)

  const heightSharedVal = useSharedValue(heightPrev)

  const animatedStyles = useAnimatedStyle(() => {
    return {
      height: heightSharedVal.value,
    }
  })

  // Stripping tags from the body text preview. (Not sure if this is necessary)
  const strippedBody = notification.body.replace(/(<([^>]+)>)/gi, '')

  useEffect(() => {
    if (heightPrev !== height && prevViewed !== undefined) {
      heightSharedVal.value = withSpring(height)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, heightPrev])

  return (
    <Animated.View style={animatedStyles}>
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
          borderBottomColor="primaryBackground"
        >
          <Text variant="body1Medium" color="black">
            {notification.title}
          </Text>
          {!viewed && (
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
            {!viewed && (
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
    </Animated.View>
  )
}

const areEqual = (prev: Props, next: Props) =>
  prev.notification.id === next.notification.id &&
  prev.notification.viewed_at === next.notification.viewed_at

export default memo(NotificationItem, areEqual)
