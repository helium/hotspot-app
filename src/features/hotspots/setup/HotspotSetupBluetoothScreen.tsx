import React from 'react'
import BackScreen from '../../../components/BackScreen'
import { useHotspotContext } from '../../../providers/HotspotProvider'
import HotspotSetupBluetoothError from './HotspotSetupBluetoothError'
import HotspotSetupBluetoothSuccess from './HotspotSetupBluetoothSuccess'

const HotspotSetupBluetoothScreen = () => {
  const { availableHotspots } = useHotspotContext()
  const hotspotCount = Object.keys(availableHotspots).length

  return (
    <BackScreen backgroundColor="primaryBackground">
      {hotspotCount === 0 && <HotspotSetupBluetoothError />}
      {hotspotCount > 0 && <HotspotSetupBluetoothSuccess />}
    </BackScreen>
  )
}

export default HotspotSetupBluetoothScreen
