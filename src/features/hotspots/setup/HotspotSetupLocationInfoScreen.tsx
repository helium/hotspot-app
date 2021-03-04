import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'
import Button from '../../../components/Button'
import SafeAreaBox from '../../../components/SafeAreaBox'
import Text from '../../../components/Text'
import usePermissionManager from '../../../utils/usePermissionManager'
import { HotspotSetupNavigationProp } from './hotspotSetupTypes'
import LocationPin from '../../../assets/images/location-pin.svg'
import Box from '../../../components/Box'
import { ww } from '../../../utils/layout'
import ImageBox from '../../../components/ImageBox'
import BackButton from '../../../components/BackButton'

const HotspotSetupLocationInfoScreen = () => {
  const { t } = useTranslation()
  const { requestLocationPermission } = usePermissionManager()
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  const checkLocationPermissions = async () => {
    const enabled = await requestLocationPermission()
    if (enabled) {
      navigation.navigate('HotspotSetupPickLocationScreen')
    }
  }

  const skipLocationAssert = () => {
    navigation.navigate('HotspotSetupSkipLocationScreen')
  }

  const goBack = () => {
    navigation.goBack()
  }

  return (
    <Box flex={1}>
      <Box backgroundColor="primaryBackground" flex={1}>
        <ImageBox
          position="absolute"
          left={-(ww - 585 / 2)}
          source={require('../../../assets/images/world.png')}
        />
        <BackButton marginTop="l" paddingHorizontal="m" onPress={goBack} />
      </Box>
      <SafeAreaBox
        height={496}
        edges={['bottom']}
        backgroundColor="primaryBackground"
        padding="l"
        flex={2}
      >
        <ScrollView>
          <Box flex={1}>
            <Box marginBottom="m">
              <LocationPin />
            </Box>
            <Text
              variant="h1"
              marginBottom="m"
              maxFontSizeMultiplier={1}
              numberOfLines={2}
              adjustsFontSizeToFit
            >
              {t('hotspot_setup.enable_location.title')}
            </Text>
            <Text
              variant="subtitle"
              marginBottom="l"
              maxFontSizeMultiplier={1.1}
              numberOfLines={3}
              adjustsFontSizeToFit
            >
              {t('hotspot_setup.enable_location.subtitle')}
            </Text>
            <Text
              variant="body1Light"
              numberOfLines={2}
              adjustsFontSizeToFit
              maxFontSizeMultiplier={1.2}
            >
              {t('hotspot_setup.enable_location.p_1')}
            </Text>
          </Box>
        </ScrollView>
        <Button
          onPress={checkLocationPermissions}
          variant="primary"
          mode="contained"
          title={t('hotspot_setup.enable_location.next')}
        />
        <Button
          onPress={skipLocationAssert}
          variant="primary"
          mode="text"
          title={t('hotspot_setup.enable_location.cancel')}
        />
      </SafeAreaBox>
    </Box>
  )
}

export default HotspotSetupLocationInfoScreen
