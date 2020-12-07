import { useNavigation } from '@react-navigation/native'
import React from 'react'
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

const HotspotSetupSelectionScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  const { purpleMain } = useColors()
  return (
    <BackScreen backgroundColor="primaryBackground" padding="lx">
      <Box flex={1} />
      <Text variant="header">{t('hotspot_setup.selection.title')}</Text>
      <Text
        variant="subtitle"
        numberOfLines={2}
        adjustsFontSizeToFit
        marginVertical="l"
      >
        {t('hotspot_setup.selection.subtitle')}
      </Text>

      <Box flexDirection="row" height={191}>
        <Card flex={1} variant="elevated" backgroundColor="white">
          <TouchableHighlightBox
            height="100%"
            width="100%"
            borderRadius="m"
            underlayColor={purpleMain}
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
                <Hotspot />
              </Box>
              <Text
                variant="body"
                color="blueGray"
                marginTop="l"
                textAlign="center"
                numberOfLines={2}
                width={100}
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
                <RAK />
              </Box>
              <Text
                variant="body"
                color="blueGray"
                marginTop="l"
                textAlign="center"
                numberOfLines={2}
                width={100}
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
