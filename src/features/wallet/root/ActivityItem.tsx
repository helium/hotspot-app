import React, { memo } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import { triggerNotification } from '../../../utils/haptic'

type Props = {
  isFirst: boolean
  isLast: boolean
  backgroundColor: string
  icon: React.ReactNode
  title: string
  amount: string
  time?: string
}

const ActivityItem = ({
  isFirst = false,
  isLast = false,
  backgroundColor,
  icon,
  amount,
  time,
  title,
}: Props) => {
  const handlePress = () => {
    triggerNotification()
  }

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        borderColor="grayLight"
        borderWidth={1}
        borderBottomWidth={isLast ? 1 : 0}
        borderTopLeftRadius={isFirst ? 'm' : undefined}
        borderTopRightRadius={isFirst ? 'm' : undefined}
        borderBottomLeftRadius={isLast ? 'm' : undefined}
        borderBottomRightRadius={isLast ? 'm' : undefined}
      >
        <Box
          width={50}
          height={50}
          style={{ backgroundColor }}
          justifyContent="center"
          alignItems="center"
          borderTopLeftRadius={isFirst ? 'm' : undefined}
          borderBottomLeftRadius={isLast ? 'm' : undefined}
        >
          {icon}
        </Box>
        <Box flex={1} paddingHorizontal="m">
          <Text
            variant="body2Medium"
            color="black"
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {title}
          </Text>
          <Text
            color="grayExtraLight"
            variant="body2"
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {amount}
          </Text>
        </Box>
        <Box paddingHorizontal="m">
          {time && <Text color="graySteel">{time}</Text>}
        </Box>
      </Box>
    </TouchableWithoutFeedback>
  )
}

export default memo(ActivityItem)
