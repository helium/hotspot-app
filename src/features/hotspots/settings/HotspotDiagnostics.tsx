import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LayoutAnimation } from 'react-native'
import { Device } from 'react-native-ble-plx'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import HotspotDiagnosticReport from './HotspotDiagnosticReport'
import HotspotDiagnosticsConnection from './HotspotDiagnosticsConnection'
import HotspotDiagnosticOptions from './HotspotsDiagnosticOptions'
import { HotspotOptions } from './HotspotSettingsTypes'
import WifiSettings from './WifiSettings'

type State = 'scan' | 'options' | HotspotOptions

type Props = {
  updateTitle: (nextTitle: string) => void
}
const HotspotDiagnostics = ({ updateTitle }: Props) => {
  const [state, setState] = useState<State>('scan')
  const [connectedHotspot, setConnectedHotspot] = useState<Device | undefined>()
  const { t } = useTranslation()
  const onConnected = (hotspot: Device) => {
    setConnectedHotspot(hotspot)
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setState('options')
  }

  const handleOptionSelected = (opt: 'scan' | HotspotOptions) => {
    switch (opt) {
      case 'diagnostic':
        updateTitle(t('hotspot_settings.diagnostics.title'))
        break
      case 'wifi':
        updateTitle(t('hotspot_settings.wifi.title'))
        break
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setState(opt)
  }

  switch (state) {
    case 'scan':
      return (
        <HotspotDiagnosticsConnection
          onConnected={(hotspot) => onConnected(hotspot)}
        />
      )
    case 'options':
      return (
        <HotspotDiagnosticOptions
          hotspot={connectedHotspot}
          optionSelected={handleOptionSelected}
        />
      )
    case 'diagnostic':
      return <HotspotDiagnosticReport />
    case 'wifi':
      return <WifiSettings />
  }

  return (
    <Box height={412} padding="l">
      <Text variant="subtitle" color="black">
        {state}
      </Text>
    </Box>
  )
}

export default HotspotDiagnostics
