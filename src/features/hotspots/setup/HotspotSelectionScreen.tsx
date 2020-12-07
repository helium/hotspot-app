import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import BackScreen from '../../../components/BackScreen'
import Card from '../../../components/Card'
import Text from '../../../components/Text'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import { HotspotSetupNavigationProp } from './hotspotSetupTypes'

const HotspotSetupSelectionScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  return (
    <BackScreen backgroundColor="primaryBackground" padding="l">
      <Text
        variant="header"
        numberOfLines={2}
        adjustsFontSizeToFit
        textAlign="center"
      >
        {t('hotspot_setup.selection.title')}
      </Text>

      <Card
        variant="elevated"
        backgroundColor="white"
        height={120}
        marginTop="xl"
      >
        <TouchableOpacityBox
          height="100%"
          width="100%"
          onPress={() =>
            navigation.push('HotspotSetupEducationScreen', {
              hotspotType: 'Helium',
            })
          }
          alignItems="center"
          justifyContent="center"
        >
          <Text variant="body" color="blueGray">
            {t('hotspot_setup.selection.option_one')}
          </Text>
        </TouchableOpacityBox>
      </Card>

      <Card
        variant="elevated"
        backgroundColor="white"
        height={120}
        marginTop="xl"
      >
        <TouchableOpacityBox
          height="100%"
          width="100%"
          onPress={() =>
            navigation.push('HotspotSetupEducationScreen', {
              hotspotType: 'RAK',
            })
          }
          alignItems="center"
          justifyContent="center"
        >
          <Text variant="body" color="blueGray">
            {t('hotspot_setup.selection.option_two')}
          </Text>
        </TouchableOpacityBox>
      </Card>
    </BackScreen>
  )
}

export default HotspotSetupSelectionScreen
