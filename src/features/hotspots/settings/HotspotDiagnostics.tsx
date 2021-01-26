import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Device } from 'react-native-ble-plx'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import animateTransition from '../../../utils/animateTransition'
import HotspotDiagnosticReport from './HotspotDiagnosticReport'
import HotspotDiagnosticsConnection from './HotspotDiagnosticsConnection'
import HotspotDiagnosticOptions from './HotspotsDiagnosticOptions'
import { HotspotOptions } from './HotspotSettingsTypes'
import ReassertLocation from './ReassertLocation'
import WifiSettingsContainer from './WifiSettingsContainer'

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
    animateTransition()
    setState('options')
  }

  const handleOptionSelected = (opt: 'scan' | 'options' | HotspotOptions) => {
    switch (opt) {
      case 'diagnostic':
        updateTitle(t('hotspot_settings.diagnostics.title'))
        break
      case 'wifi':
        updateTitle(t('hotspot_settings.wifi.title'))
        break
      case 'reassert':
        updateTitle(t('hotspot_settings.options.reassert'))
        break
      default:
        updateTitle(t('hotspot_settings.title'))
        break
    }
    animateTransition()
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
      return (
        <WifiSettingsContainer
          onFinished={() => handleOptionSelected('options')}
        />
      )
    case 'reassert':
      return <ReassertLocation />
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
