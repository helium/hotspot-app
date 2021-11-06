import React, { memo } from 'react'
import Chevron from '@assets/images/chevron-right.svg'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import { useColors } from '../../../theme/themeHooks'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'

type Props = {
  title: string
  subtitle: string
  icon: Element
  isFirst: boolean
  isLast: boolean
  onPress: () => void
}

const HotspotSearchListItem = ({
  title,
  subtitle,
  icon,
  isFirst,
  isLast,
  onPress,
}: Props) => {
  const { grayLightText } = useColors()
  return (
    <TouchableOpacityBox
      height={60}
      paddingHorizontal="m"
      backgroundColor="grayBox"
      borderTopLeftRadius={isFirst ? 'm' : 'none'}
      borderTopRightRadius={isFirst ? 'm' : 'none'}
      borderBottomLeftRadius={isLast ? 'm' : 'none'}
      borderBottomRightRadius={isLast ? 'm' : 'none'}
      alignItems="center"
      flexDirection="row"
      onPress={onPress}
    >
      <Box justifyContent="center" flex={1}>
        <Box flexDirection="row" alignItems="center">
          {icon && <Box marginRight="xs">{icon}</Box>}
          <Text variant="medium" fontSize={15} color="offblack">
            {title}
          </Text>
        </Box>
        {!!subtitle && (
          <Text variant="regular" fontSize={12} color="grayLightText">
            {subtitle}
          </Text>
        )}
      </Box>
      <Chevron color={grayLightText} />
    </TouchableOpacityBox>
  )
}

export default memo(HotspotSearchListItem)
