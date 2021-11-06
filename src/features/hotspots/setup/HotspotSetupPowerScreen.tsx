import React, { useCallback } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import BackScreen from '../../../components/BackScreen'
import { DebouncedButton } from '../../../components/Button'
import Text from '../../../components/Text'
import {
  HotspotSetupNavigationProp,
  HotspotSetupStackParamList,
} from './hotspotSetupTypes'
import Lightning from '../../../assets/images/lightning.svg'
import Box from '../../../components/Box'
import { RootNavigationProp } from '../../../navigation/main/tabTypes'

type Route = RouteProp<HotspotSetupStackParamList, 'HotspotSetupPowerScreen'>

const HotspotSetupPowerScreen = () => {
  const { t } = useTranslation()
  const {
    params: { hotspotType },
  } = useRoute<Route>()
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  const rootNav = useNavigation<RootNavigationProp>()

  const handleClose = useCallback(() => rootNav.navigate('MainTabs'), [rootNav])

  const navNext = useCallback(
    () => navigation.push('HotspotSetupBluetoothInfoScreen', { hotspotType }),
    [navigation, hotspotType],
  )

  return (
    <BackScreen
      backgroundColor="primaryBackground"
      onClose={handleClose}
      alignItems="center"
      justifyContent="center"
    >
      <Box flex={1} alignItems="center" justifyContent="center">
        <Lightning />
        <Text
          marginTop="xl"
          variant="h1"
          numberOfLines={2}
          adjustsFontSizeToFit
          maxFontSizeMultiplier={1}
          marginBottom="l"
          textAlign="center"
        >
          {t('hotspot_setup.power.title')}
        </Text>
        <Text
          marginBottom="lx"
          maxFontSizeMultiplier={1.2}
          variant="subtitleBold"
          textAlign="center"
          color="white"
        >
          {t(`makerHotspot.${hotspotType}.power.0`)}
        </Text>
        <Text
          marginBottom="xl"
          maxFontSizeMultiplier={1.2}
          variant="subtitle"
          textAlign="center"
        >
          {t(`makerHotspot.${hotspotType}.power.1`)}
        </Text>
      </Box>
      <DebouncedButton
        width="100%"
        variant="secondary"
        mode="contained"
        title={t('hotspot_setup.power.next')}
        onPress={navNext}
      />
    </BackScreen>
  )
}

export default HotspotSetupPowerScreen
