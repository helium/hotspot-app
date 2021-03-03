import React, { useCallback } from 'react'
import { uniq } from 'lodash'
import { useAsync } from 'react-async-hook'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
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
import { getAddress, getHotspotDetails } from '../../../utils/appDataClient'
import { RootState } from '../../../store/rootReducer'
import * as Logger from '../../../utils/logger'

type Route = RouteProp<
  HotspotSetupStackParamList,
  'HotspotSetupWifiConnectingScreen'
>

const HotspotSetupWifiConnectingScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  const { connectedHotspot } = useSelector((state: RootState) => state)

  const {
    params: { network, password },
  } = useRoute<Route>()

  const {
    scanForWifiNetworks,
    setWifiCredentials,
    removeConfiguredWifi,
  } = useConnectedHotspotContext()

  const { showOKAlert } = useAlert()

  const handleError = useCallback(
    async (messageKey: string) => {
      await showOKAlert({ titleKey: 'generic.error', messageKey })
      navigation.goBack()
    },
    [navigation, showOKAlert],
  )

  const goToNextStep = async () => {
    if (connectedHotspot.address) {
      const address = await getAddress()
      const hotspot = await getHotspotDetails(connectedHotspot.address)
      if (hotspot && hotspot.owner === address) {
        navigation.replace('OwnedHotspotErrorScreen')
      } else if (hotspot && hotspot.owner !== address) {
        navigation.replace('NotHotspotOwnerErrorScreen')
      } else {
        navigation.replace('HotspotSetupLocationInfoScreen')
      }
    } else {
      Logger.error('no connectedHotspot address after connecting to wifi')
      showOKAlert({ titleKey: 'something went wrong' })
      navigation.goBack()
    }
  }

  const connectToWifi = () => {
    setWifiCredentials(network, password, async (response, error) => {
      if (response === 'error') {
        showOKAlert({
          titleKey: 'generic.error',
          messageKey: error?.toString() || 'generic.something_went_wrong',
        })
        navigation.goBack()
      } else if (response === 'invalid') {
        showOKAlert({
          titleKey: 'generic.error',
          messageKey: 'generic.invalid_password',
        })
        navigation.goBack()
      } else {
        goToNextStep()
      }
    })
  }

  const forgetWifi = async () => {
    try {
      const connectedNetworks = uniq((await scanForWifiNetworks(true)) || [])
      if (connectedNetworks.length > 0) {
        await removeConfiguredWifi(connectedNetworks[0])
      }
    } catch (e) {
      handleError(e)
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
