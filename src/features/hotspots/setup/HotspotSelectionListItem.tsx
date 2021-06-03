/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { SvgProps } from 'react-native-svg'
import Box from '../../../components/Box'
import { DebouncedTouchableHighlightBox } from '../../../components/TouchableHighlightBox'
import { HotspotType } from '../../../store/connectedHotspot/connectedHotspotSlice'
import { useColors } from '../../../theme/themeHooks'
import Hotspot from '../../../assets/images/hotspot.svg'
import RAK from '../../../assets/images/rak.svg'
import NEBRAIN from '../../../assets/images/nebra-in.svg'
import NEBRAOUT from '../../../assets/images/nebra-out.svg'
import BOBCAT from '../../../assets/images/bobcat.svg'
import SYNCROBIT from '../../../assets/images/syncrobit.svg'
import FINESTRA from '../../../assets/images/finestra.svg'
import LONGAPONE from '../../../assets/images/longap-one.svg'
import Text from '../../../components/Text'

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
  const { t } = useTranslation()
  const colors = useColors()
  const [pressing, setPressing] = useState<boolean>()
  const svgColor = pressing ? colors.white : colors.blueGray
  const handlePressing = useCallback(
    (value: boolean) => () => setPressing(value),
    [],
  )

  const svgProps = useMemo(() => {
    const props: SvgProps = { color: svgColor, height: '100%', width: '100%' }
    return props
  }, [svgColor])

  const HotspotImage = useMemo(() => {
    switch (hotspotType) {
      default:
      case 'Helium':
        return <Hotspot {...svgProps} />
      case 'RAK':
        return <RAK color={svgColor} {...svgProps} />
      case 'NEBRAIN':
        return <NEBRAIN color={svgColor} {...svgProps} />
      case 'NEBRAOUT':
        return <NEBRAOUT color={svgColor} {...svgProps} />
      case 'Bobcat':
        return <BOBCAT color={svgColor} {...svgProps} />
      case 'SYNCROBIT':
        return <SYNCROBIT color={svgColor} {...svgProps} />
      case 'LONGAPONE':
        return <LONGAPONE color={svgColor} {...svgProps} />
      case 'Finestra':
        return <FINESTRA color={svgColor} {...svgProps} />
    }
  }, [svgColor, hotspotType, svgProps])

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
          {t(`hotspot_setup.selection.${hotspotType.toLowerCase()}`)}
        </Text>
      </>
    </DebouncedTouchableHighlightBox>
  )
}

export default memo(HotspotSelectionListItem)
