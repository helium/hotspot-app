import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import BackScreen from '../../../components/BackScreen'
import Box from '../../../components/Box'
import Card from '../../../components/Card'
import Text from '../../../components/Text'
import TouchableHighlightBox from '../../../components/TouchableHighlightBox'
import { HotspotSetupNavigationProp } from './hotspotSetupTypes'
import Hotspot from '../../../assets/images/hotspot.svg'
import RAK from '../../../assets/images/rak.svg'
import { useColors } from '../../../theme/themeHooks'
import { HotspotType } from '../../../store/connectedHotspot/connectedHotspotSlice'

const HotspotSetupSelectionScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  const { purpleMain } = useColors()
  const [pressing, setPressing] = useState<HotspotType | undefined>()
  const colors = useColors()

  return (
    <BackScreen backgroundColor="primaryBackground" padding="lx">
      <Box flex={1} />
      <Text variant="h1">{t('hotspot_setup.selection.title')}</Text>
      <Text
        variant="subtitle"
        numberOfLines={2}
        adjustsFontSizeToFit
        marginVertical="l"
      >
        {t('hotspot_setup.selection.subtitle')}
      </Text>

      <Box flexDirection="row" height={191} marginTop="s">
        <Card flex={1} variant="elevated" backgroundColor="white">
          <TouchableHighlightBox
            height="100%"
            width="100%"
            borderRadius="m"
            underlayColor={purpleMain}
            onPressIn={() => setPressing('Helium')}
            onPressOut={() => setPressing(undefined)}
            onPress={() =>
              navigation.push('HotspotSetupEducationScreen', {
                hotspotType: 'Helium',
              })
            }
            alignItems="center"
            justifyContent="center"
          >
            <>
              <Box height={77}>
                <Hotspot
                  color={pressing === 'Helium' ? colors.white : colors.blueGray}
                />
              </Box>
              <Text
                variant="body1Medium"
                color={pressing === 'Helium' ? 'white' : 'blueGray'}
                marginTop="l"
                textAlign="center"
                numberOfLines={2}
                adjustsFontSizeToFit
                lineHeight={19}
              >
                {t('hotspot_setup.selection.option_one')}
              </Text>
            </>
          </TouchableHighlightBox>
        </Card>

        <Box marginRight="ms" />

        <Card flex={1} variant="elevated" backgroundColor="white">
          <TouchableHighlightBox
            height="100%"
            width="100%"
            borderRadius="m"
            underlayColor={purpleMain}
            onPressIn={() => setPressing('RAK')}
            onPressOut={() => setPressing(undefined)}
            onPress={() =>
              navigation.push('HotspotSetupEducationScreen', {
                hotspotType: 'RAK',
              })
            }
            alignItems="center"
            justifyContent="center"
          >
            <>
              <Box height={77}>
                <RAK
                  color={pressing === 'RAK' ? colors.white : colors.blueGray}
                />
              </Box>
              <Text
                variant="body1Medium"
                color={pressing === 'RAK' ? 'white' : 'blueGray'}
                marginTop="l"
                textAlign="center"
                numberOfLines={2}
                adjustsFontSizeToFit
                lineHeight={19}
              >
                {t('hotspot_setup.selection.option_two')}
              </Text>
            </>
          </TouchableHighlightBox>
        </Card>
      </Box>
      <Box flex={1.5} />
    </BackScreen>
  )
}

export default HotspotSetupSelectionScreen
