import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { uniq } from 'lodash'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native'
import { useSelector } from 'react-redux'
import BackScreen from '../../../components/BackScreen'
import Box from '../../../components/Box'
import RadarLoader from '../../../components/Loaders/RadarLoader'
import Text from '../../../components/Text'
import { useConnectedHotspotContext } from '../../../providers/ConnectedHotspotProvider'
import { RootState } from '../../../store/rootReducer'
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

  const {
    connectedHotspot: { validOnboarding },
  } = useSelector((state: RootState) => state)

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      // connect to hotspot
      await connectAndConfigHotspot(hotspot)

      // check for valid onboarding record
      if (!validOnboarding) {
        // TODO actual screen for this
        Alert.alert('Error', 'Invalid onboarding record')
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

  // const [checkingFirmware, setCheckingFirmware] = useState(false)
  // const [networks, setNetworks] = useState<null | undefined | string[]>(null)
  // const [configuredNetworks, setConfiguredNetworks] = useState<
  //   null | undefined | string[]
  // >(null)

  // const configuredNetwork = configuredNetworks?.length
  //   ? configuredNetworks[0]
  //   : undefined

  // const loading = networks === null || configuredNetworks === null
  // const hasConfiguredNetwork =
  //   configuredNetworks && configuredNetworks.length > 0
  // const error = !hasConfiguredNetwork && networks && networks.length === 0

  // const removeConfiguredNetwork = async () => {
  //   if (!configuredNetwork) return
  //   await removeConfiguredWifi(configuredNetwork)

  //   scanWifi()
  // }

  // const connectNetwork = (network: string) => {
  //   navigation.push('HotspotSetupWifiScreen', { network })
  // }

  // const continueWithWifi = async () => {
  //   setCheckingFirmware(true)
  //   const hasCurrentFirmware = await checkFirmwareCurrent()
  //   setCheckingFirmware(false)
  //   if (hasCurrentFirmware) {
  //     if (freeAddHotspot) {
  //       navigation.push('HotspotGenesisScreen')
  //     } else {
  //       navigation.push('HotspotSetupAddTxnScreen')
  //     }
  //   } else {
  //     navigation.push('FirmwareUpdateNeededScreen')
  //   }
  // }
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
          {/* {t('hotspot_setup.ble_scan.title')} */}
          CONNECTING TO {(hotspot.localName || '').toUpperCase()}
        </Text>
      </Box>
    </BackScreen>
  )
}

export default HotspotSetupConnectingScreen
