import React from 'react'
import BackScreen from '../../../components/BackScreen'
import { useConnectedHotspotContext } from '../../../providers/ConnectedHotspotProvider'
import HotspotSetupBluetoothError from './HotspotSetupBluetoothError'
import HotspotSetupBluetoothSuccess from './HotspotSetupBluetoothSuccess'

const HotspotSetupPickHotspotScreen = () => {
  const { availableHotspots } = useConnectedHotspotContext()
  // const availableHotspots = {
  //   '31D15CD5': {
  //     id: '31D15CD5',
  //     localName: 'Helium Hotspot A15B',
  //     name: 'Helium Hotspot',
  //   },
  // }
  const hotspotCount = Object.keys(availableHotspots).length
  // const hotspotCount = 3

  if (hotspotCount > 0) {
    return (
      <BackScreen backgroundColor="purple200" padding="none">
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
