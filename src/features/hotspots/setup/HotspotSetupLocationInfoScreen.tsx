import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'
import Button from '../../../components/Button'
import SafeAreaBox from '../../../components/SafeAreaBox'
import Text from '../../../components/Text'
import {
  HotspotSetupNavigationProp,
  HotspotSetupStackParamList,
} from './hotspotSetupTypes'
import LocationPin from '../../../assets/images/location-pin.svg'
import Box from '../../../components/Box'
import { ww } from '../../../utils/layout'
import ImageBox from '../../../components/ImageBox'
import BackScreen from '../../../components/BackScreen'
import { RootNavigationProp } from '../../../navigation/main/tabTypes'
import useGetLocation from '../../../utils/useGetLocation'

type Route = RouteProp<
  HotspotSetupStackParamList,
  'HotspotSetupLocationInfoScreen'
>

const HotspotSetupLocationInfoScreen = () => {
  const { t } = useTranslation()
  const { params } = useRoute<Route>()
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  const rootNav = useNavigation<RootNavigationProp>()
  const maybeGetLocation = useGetLocation()

  const handleClose = useCallback(() => rootNav.navigate('MainTabs'), [rootNav])

  const checkLocationPermissions = async () => {
    await maybeGetLocation(true)
    navigation.navigate('HotspotSetupPickLocationScreen', params)
  }

  const skipLocationAssert = () => {
    navigation.navigate('HotspotSetupSkipLocationScreen', params)
  }

  return (
    <Box flex={1}>
      <Box backgroundColor="primaryBackground" flex={1}>
        <ImageBox
          position="absolute"
          left={-(ww - 585 / 2)}
          source={require('../../../assets/images/world.png')}
        />
        <BackScreen backgroundColor="transparent" onClose={handleClose} />
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
