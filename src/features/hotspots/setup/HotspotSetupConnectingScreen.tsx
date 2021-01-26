import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { uniq } from 'lodash'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native'
import BackScreen from '../../../components/BackScreen'
import Box from '../../../components/Box'
import RadarLoader from '../../../components/Loaders/RadarLoader'
import Text from '../../../components/Text'
import { useConnectedHotspotContext } from '../../../providers/ConnectedHotspotProvider'
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

  const {
    availableHotspots,
    connectAndConfigHotspot,
    scanForWifiNetworks,
    checkFirmwareCurrent,
  } = useConnectedHotspotContext()

  const hotspot = availableHotspots[hotspotId]

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      // connect to hotspot
      const connectedHotspot = await connectAndConfigHotspot(hotspot)

      // check for valid onboarding record
      if (!connectedHotspot?.validOnboarding) {
        // TODO actual screen for this
        Alert.alert('Error', 'Invalid onboarding record')
        navigation.goBack()
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
      navigation.navigate('HotspotSetupPickWifiScreen', {
        networks,
        connectedNetworks,
      })
    })

    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <BackScreen backgroundColor="primaryBackground">
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
    </BackScreen>
  )
}

export default HotspotSetupConnectingScreen
