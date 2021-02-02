import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Device } from 'react-native-ble-plx'
import animateTransition from '../../../utils/animateTransition'
import HotspotDiagnosticReport from './HotspotDiagnosticReport'
import HotspotDiagnosticsConnection from './HotspotDiagnosticsConnection'
import HotspotDiagnosticOptions from './HotspotsDiagnosticOptions'
import { useHotspotSettingsContext } from './HotspotSettingsProvider'
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
  const { disableBack } = useHotspotSettingsContext()

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
      case 'options':
      default:
        updateTitle(t('hotspot_settings.title'))
        disableBack()
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
      return (
        <HotspotDiagnosticReport
          onFinished={() => handleOptionSelected('options')}
        />
      )
    case 'wifi':
      return (
        <WifiSettingsContainer
          onFinished={() => handleOptionSelected('options')}
        />
      )
    case 'reassert':
      return (
        <ReassertLocation onFinished={() => handleOptionSelected('options')} />
      )
  }

  return null
}

export default HotspotDiagnostics
