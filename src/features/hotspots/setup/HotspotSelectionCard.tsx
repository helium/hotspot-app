import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import Card from '../../../components/Card'
import TouchableHighlightBox from '../../../components/TouchableHighlightBox'
import Box from '../../../components/Box'
import Hotspot from '../../../assets/images/hotspot.svg'
import RAK from '../../../assets/images/rak.svg'
import NEBRAIN from '../../../assets/images/nebra-in.svg'
import NEBRAOUT from '../../../assets/images/nebra-out.svg'
import Text from '../../../components/Text'
import { HotspotSetupNavigationProp } from './hotspotSetupTypes'
import { useColors } from '../../../theme/themeHooks'
import { HotspotType } from '../../../store/connectedHotspot/connectedHotspotSlice'

type Props = {
  hotspotType: HotspotType
}

const HotspotSelectionCard = ({ hotspotType }: Props) => {
  const { t } = useTranslation()
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  const colors = useColors()

  const [pressing, setPressing] = useState<HotspotType | undefined>()

  const onPressIn = () => setPressing(hotspotType)
  const onPressOut = () => setPressing(undefined)
  const onPress = () =>
    navigation.push('HotspotSetupEducationScreen', { hotspotType })

  const HotspotImage = () => {
    const color = pressing === hotspotType ? colors.white : colors.blueGray
    switch (hotspotType) {
      default:
      case 'Helium':
        return <Hotspot color={color} />
      case 'RAK':
        return <RAK color={color} />
      case 'NEBRAIN':
        return <NEBRAIN color={color} />
      case 'NEBRAOUT':
        return <NEBRAOUT color={color} />
    }
  }

  return (
    <Card flex={1} variant="elevated" backgroundColor="white" margin="xs">
      <TouchableHighlightBox
        height="100%"
        width="100%"
        borderRadius="m"
        underlayColor={colors.purpleMain}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
        alignItems="center"
        justifyContent="center"
      >
        <>
          <Box height={77}>{HotspotImage()}</Box>
          <Text
            variant="body1Medium"
            color={pressing === hotspotType ? 'white' : 'blueGray'}
            marginTop="l"
            textAlign="center"
            numberOfLines={2}
            adjustsFontSizeToFit
            lineHeight={19}
          >
            {t(`hotspot_setup.selection.${hotspotType.toLowerCase()}`)}
          </Text>
        </>
      </TouchableHighlightBox>
    </Card>
  )
}

export default HotspotSelectionCard
