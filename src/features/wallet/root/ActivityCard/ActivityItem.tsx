import React, { memo, useMemo } from 'react'
import { createText } from '@shopify/restyle'
import Box from '../../../../components/Box'
import TouchableOpacityBox from '../../../../components/TouchableOpacityBox'
import { Theme } from '../../../../theme/theme'

export const ACTIVITY_ITEM_ROW_HEIGHT = 58

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

const Text = createText<Theme>()

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
  const iconStyle = useMemo(
    () => ({
      backgroundColor,
    }),
    [backgroundColor],
  )

  return (
    <TouchableOpacityBox
      onPress={handlePress}
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
        width={ACTIVITY_ITEM_ROW_HEIGHT}
        height={ACTIVITY_ITEM_ROW_HEIGHT}
        style={iconStyle}
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
    </TouchableOpacityBox>
  )
}

export default memo(
  ActivityItem,
  (prev, next) =>
    prev.hash === next.hash &&
    prev.isFirst === next.isFirst &&
    prev.isLast === next.isLast &&
    prev.time === next.time &&
    prev.title === next.title,
)
