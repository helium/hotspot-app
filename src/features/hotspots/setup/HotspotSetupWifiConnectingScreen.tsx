import React from 'react'
import { uniq } from 'lodash'
import { useAsync } from 'react-async-hook'
import { RouteProp, useRoute } from '@react-navigation/native'
import BackScreen from '../../../components/BackScreen'
import RingLoader from '../../../components/Loaders/RingLoader'
import { useConnectedHotspotContext } from '../../../providers/ConnectedHotspotProvider'
import useAlert from '../../../utils/useAlert'
import { HotspotSetupStackParamList } from './hotspotSetupTypes'

type Route = RouteProp<
  HotspotSetupStackParamList,
  'HotspotSetupWifiConnectingScreen'
>

const HotspotSetupWifiConnectingScreen = () => {
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
      } else if (response === 'invalid') {
        // TODO: Handle incorrect password
        showOKAlert({ titleKey: 'Your password is invalid' })
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
    <BackScreen>
      <RingLoader color="green" />
    </BackScreen>
  )
}

export default HotspotSetupWifiConnectingScreen
