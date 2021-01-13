import React, { useState } from 'react'
import { LayoutAnimation } from 'react-native'
import { Device } from 'react-native-ble-plx'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import HotspotDiagnosticReport from './HotspotDiagnosticReport'
import HotspotDiagnosticsConnection from './HotspotDiagnosticsConnection'
import HotspotDiagnosticOptions from './HotspotsDiagnosticOptions'
import { HotspotOptions } from './HotspotSettingsTypes'

type State = 'scan' | 'options' | HotspotOptions

const HotspotDiagnostics = () => {
  const [state, setState] = useState<State>('scan')
  const [connectedHotspot, setConnectedHotspot] = useState<Device | undefined>()
  const onConnected = (hotspot: Device) => {
    setConnectedHotspot(hotspot)
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setState('options')
  }

  if (state === 'scan')
    return (
      <HotspotDiagnosticsConnection
        onConnected={(hotspot) => onConnected(hotspot)}
      />
    )

  if (state === 'options' && connectedHotspot)
    return (
      <HotspotDiagnosticOptions
        hotspot={connectedHotspot}
        optionSelected={(opt) => setState(opt)}
      />
    )

  if (state === 'diagnostic' && connectedHotspot)
    return <HotspotDiagnosticReport />

  return (
    <Box height={412} padding="l">
      <Text variant="subtitle" color="black">
        {state}
      </Text>
    </Box>
  )
}

export default HotspotDiagnostics
