import React, { memo } from 'react'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  withDelay,
} from 'react-native-reanimated'
import Box from '../../components/Box'
import { Notification } from '../../store/account/accountSlice'
import { ww } from '../../utils/layout'
import NotificationItem from './NotificationItem'

type Props = {
  notifications: Notification[]
  onNotificationSelected: (notification: Notification) => void
  index: number
}
const NotificationGroup = ({
  notifications,
  onNotificationSelected,
  index,
}: Props) => {
  const offset = useSharedValue(-1)
  offset.value = withTiming(0, {
    duration: 200,
    easing: Easing.out(Easing.exp),
  })

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withDelay(
            100 * index,
            withSpring(offset.value * ww, {
              damping: 20,
              stiffness: 90,
            }),
          ),
        },
      ],
    }
  })

  return (
    <Animated.View style={[animatedStyles, {}]}>
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
    </Animated.View>
  )
}

export default memo(NotificationGroup)
