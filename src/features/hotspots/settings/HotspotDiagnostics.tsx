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
        optionSelected={(opt) => {
          if (opt === 'diagnostic') {
            updateTitle(t('hotspot_settings.diagnostics.title'))
          }
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
          setState(opt)
        }}
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
