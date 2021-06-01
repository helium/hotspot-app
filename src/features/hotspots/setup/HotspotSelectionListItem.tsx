import React, { useState, memo, useCallback, useMemo } from 'react'
import Box from '../../../components/Box'
import { DebouncedTouchableHighlightBox } from '../../../components/TouchableHighlightBox'
import { useColors } from '../../../theme/themeHooks'
import Text from '../../../components/Text'
import { HotspotMakerModels, HotspotType } from '../../../makers/hotspots'

type Props = {
  isFirst: boolean
  isLast: boolean
  hotspotType: HotspotType
  onPress: () => void
}
const HotspotSelectionListItem = ({
  isFirst,
  isLast,
  hotspotType,
  onPress,
}: Props) => {
  const colors = useColors()
  const [pressing, setPressing] = useState<boolean>()
  const svgColor = pressing ? colors.white : colors.blueGray
  const handlePressing = useCallback(
    (value: boolean) => () => setPressing(value),
    [],
  )

  const HotspotImage = useMemo(() => {
    const ListIcon = HotspotMakerModels[hotspotType].icon
    return <ListIcon color={svgColor} height="100%" width="100%" />
  }, [svgColor, hotspotType])

  return (
    <DebouncedTouchableHighlightBox
      backgroundColor="white"
      width="100%"
      paddingHorizontal="m"
      underlayColor={colors.purpleMain}
      onPressIn={handlePressing(true)}
      onPressOut={handlePressing(false)}
      onPress={onPress}
      alignItems="center"
      flexDirection="row"
      borderTopLeftRadius={isFirst ? 'm' : 'none'}
      borderTopRightRadius={isFirst ? 'm' : 'none'}
      borderBottomLeftRadius={isLast ? 'm' : 'none'}
      borderBottomRightRadius={isLast ? 'm' : 'none'}
    >
      <>
        <Box height={34} width={34}>
          {HotspotImage}
        </Box>
        <Text
          variant="body1Medium"
          color={pressing ? 'white' : 'blueGray'}
          paddingVertical="l"
          paddingHorizontal="m"
          textAlign="center"
          numberOfLines={1}
          adjustsFontSizeToFit
          lineHeight={19}
          maxFontSizeMultiplier={1.1}
        >
          {HotspotMakerModels[hotspotType].name}
        </Text>
      </>
    </DebouncedTouchableHighlightBox>
  )
}

export default memo(HotspotSelectionListItem)
