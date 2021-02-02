import React, { memo } from 'react'
import { TouchableOpacity } from 'react-native'
import Box from '../../../../components/Box'
import Text from '../../../../components/Text'

type Props = {
  isFirst: boolean
  isLast: boolean
  backgroundColor: string
  icon: React.ReactNode
  title: string
  subtitle: string
  time?: string
  // eslint-disable-next-line react/no-unused-prop-types
  hash: string // used for memoization
  handlePress: () => void
}

const ActivityItem = ({
  isFirst = false,
  isLast = false,
  backgroundColor,
  icon,
  subtitle,
  time,
  title,
  handlePress,
}: Props) => {
  return (
    <TouchableOpacity onPress={handlePress}>
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
            {subtitle}
          </Text>
        </Box>
        <Box paddingHorizontal="m">
          {time && <Text color="graySteel">{time}</Text>}
        </Box>
      </Box>
    </TouchableOpacity>
  )
}

export default memo(ActivityItem, (prev, next) => prev.hash === next.hash)
