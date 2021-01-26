import React from 'react'
import { uniq } from 'lodash'
import { useAsync } from 'react-async-hook'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import RingLoader from '../../../components/Loaders/RingLoader'
import { useConnectedHotspotContext } from '../../../providers/ConnectedHotspotProvider'
import useAlert from '../../../utils/useAlert'
import {
  HotspotSetupNavigationProp,
  HotspotSetupStackParamList,
} from './hotspotSetupTypes'
import Text from '../../../components/Text'
import Box from '../../../components/Box'
import SafeAreaBox from '../../../components/SafeAreaBox'

type Route = RouteProp<
  HotspotSetupStackParamList,
  'HotspotSetupWifiConnectingScreen'
>

const HotspotSetupWifiConnectingScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<HotspotSetupNavigationProp>()

  const {
    params: { network, password },
  } = useRoute<Route>()

  const {
    scanForWifiNetworks,
    setWifiCredentials,
    removeConfiguredWifi,
  } = useConnectedHotspotContext()

  const { showOKAlert } = useAlert()

  const connectToWifi = () => {
    setWifiCredentials(network, password, async (response) => {
      if (response === 'error') {
        // TODO: Handle Failure
        showOKAlert({ titleKey: 'something went wrong' })
        navigation.goBack()
      } else if (response === 'invalid') {
        // TODO: Handle incorrect password
        showOKAlert({ titleKey: 'Your password is invalid' })
        navigation.goBack()
      } else {
        navigation.replace('HotspotSetupLocationInfoScreen')
      }
    })
  }

  const forgetWifi = async () => {
    const connectedNetworks = uniq((await scanForWifiNetworks(true)) || [])
    if (connectedNetworks.length > 0) {
      await removeConfiguredWifi(connectedNetworks[0])
    }
  }

  useAsync(async () => {
    await forgetWifi()
    connectToWifi()
  }, [])

  return (
    <SafeAreaBox flex={1} backgroundColor="primaryBackground">
      <Box flex={1} justifyContent="center" paddingBottom="xxl">
        <RingLoader color="green" />
        <Box marginTop="xl">
          <Text variant="body1Light" textAlign="center">
            {t('hotspot_setup.wifi_password.connecting').toUpperCase()}
          </Text>
        </Box>
      </Box>
    </SafeAreaBox>
  )
}

export default HotspotSetupWifiConnectingScreen
