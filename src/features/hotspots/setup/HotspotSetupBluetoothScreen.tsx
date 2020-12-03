import React from 'react'
import BackScreen from '../../../components/BackScreen'
import { useBluetoothContext } from '../../../utils/BluetoothProvider'
import HotspotSetupBluetoothError from './HotspotSetupBluetoothError'
import HotspotSetupBluetoothSuccess from './HotspotSetupBluetoothSuccess'

const HotspotSetupBluetoothScreen = () => {
  const { availableHotspots } = useBluetoothContext()
  const hotspotCount = Object.keys(availableHotspots).length

  return (
    <BackScreen backgroundColor="secondaryBackground">
      {hotspotCount === 0 && <HotspotSetupBluetoothError />}
      {hotspotCount > 0 && <HotspotSetupBluetoothSuccess />}
    </BackScreen>
  )
}

export default HotspotSetupBluetoothScreen
