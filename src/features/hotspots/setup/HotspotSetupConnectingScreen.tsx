import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { uniq } from 'lodash'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '../../../components/Box'
import RadarLoader from '../../../components/Loaders/RadarLoader'
import SafeAreaBox from '../../../components/SafeAreaBox'
import Text from '../../../components/Text'
import { useConnectedHotspotContext } from '../../../providers/ConnectedHotspotProvider'
import useAlert from '../../../utils/useAlert'
import {
  HotspotSetupNavigationProp,
  HotspotSetupStackParamList,
} from './hotspotSetupTypes'

type Route = RouteProp<
  HotspotSetupStackParamList,
  'HotspotSetupConnectingScreen'
>
const HotspotSetupConnectingScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  const {
    params: { hotspotId },
  } = useRoute<Route>()

  const { showOKAlert } = useAlert()

  const {
    availableHotspots,
    connectAndConfigHotspot,
    scanForWifiNetworks,
    checkFirmwareCurrent,
  } = useConnectedHotspotContext()

  const hotspot = availableHotspots[hotspotId]

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        // connect to hotspot
        const success = await connectAndConfigHotspot(hotspot)

        // check for valid onboarding record
        if (!success) {
          navigation.navigate('OnboardingErrorScreen')
          return
        }

        // check firmware
        const hasCurrentFirmware = await checkFirmwareCurrent()
        if (!hasCurrentFirmware) {
          navigation.navigate('FirmwareUpdateNeededScreen')
          return
        }

        // scan for wifi networks
        const networks = uniq((await scanForWifiNetworks()) || [])
        const connectedNetworks = uniq((await scanForWifiNetworks(true)) || [])

        // navigate to next screen
        navigation.replace('HotspotSetupPickWifiScreen', {
          networks,
          connectedNetworks,
        })
      } catch (e) {
        const titleKey = 'generic.error'
        await showOKAlert({ titleKey, messageKey: e.toString() })
        navigation.goBack()
      }
    })

    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <SafeAreaBox flex={1} backgroundColor="primaryBackground">
      <Box flex={0.8} justifyContent="center">
        <RadarLoader duration={2000} color="green" />
        <Text
          marginTop="xl"
          variant="body2Light"
          numberOfLines={1}
          adjustsFontSizeToFit
          textAlign="center"
        >
          {t('hotspot_setup.ble_scan.connecting', {
            hotspotName: hotspot.localName,
          }).toUpperCase()}
        </Text>
      </Box>
    </SafeAreaBox>
  )
}

export default HotspotSetupConnectingScreen
