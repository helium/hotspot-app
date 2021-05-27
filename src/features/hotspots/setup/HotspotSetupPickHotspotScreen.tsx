import React, { useCallback } from 'react'
import { useNavigation } from '@react-navigation/native'
import BackScreen from '../../../components/BackScreen'
import { useConnectedHotspotContext } from '../../../providers/ConnectedHotspotProvider'
import HotspotSetupBluetoothError from './HotspotSetupBluetoothError'
import HotspotSetupBluetoothSuccess from './HotspotSetupBluetoothSuccess'
import { RootNavigationProp } from '../../../navigation/main/tabTypes'

const HotspotSetupPickHotspotScreen = () => {
  const { availableHotspots } = useConnectedHotspotContext()
  const hotspotCount = Object.keys(availableHotspots).length
  const rootNav = useNavigation<RootNavigationProp>()
  const handleClose = useCallback(() => rootNav.navigate('MainTabs'), [rootNav])

  if (hotspotCount > 0) {
    return (
      <BackScreen
        backgroundColor="primaryBackground"
        padding="none"
        onClose={handleClose}
      >
        <HotspotSetupBluetoothSuccess />
      </BackScreen>
    )
  }

  return (
    <BackScreen backgroundColor="primaryBackground" onClose={handleClose}>
      <HotspotSetupBluetoothError />
    </BackScreen>
  )
}

export default HotspotSetupPickHotspotScreen
