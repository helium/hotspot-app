import React from 'react'
import BackScreen from '../../../components/BackScreen'
import { useConnectedHotspotContext } from '../../../providers/ConnectedHotspotProvider'
import HotspotSetupBluetoothError from './HotspotSetupBluetoothError'
import HotspotSetupBluetoothSuccess from './HotspotSetupBluetoothSuccess'

const HotspotSetupPickHotspotScreen = () => {
  const { availableHotspots } = useConnectedHotspotContext()
  const hotspotCount = Object.keys(availableHotspots).length

  if (hotspotCount > 0) {
    return (
      <BackScreen backgroundColor="primaryBackground" padding="none">
        <HotspotSetupBluetoothSuccess />
      </BackScreen>
    )
  }

  return (
    <BackScreen backgroundColor="primaryBackground">
      <HotspotSetupBluetoothError />
    </BackScreen>
  )
}

export default HotspotSetupPickHotspotScreen
