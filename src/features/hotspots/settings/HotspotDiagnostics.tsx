import React, { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Device } from 'react-native-ble-plx'
import animateTransition from '../../../utils/animateTransition'
import HotspotDiagnosticReport from './HotspotDiagnosticReport'
import HotspotDiagnosticsConnection from './HotspotDiagnosticsConnection'
import HotspotDiagnosticOptions from './HotspotsDiagnosticOptions'
import { useHotspotSettingsContext } from './HotspotSettingsProvider'
import { HotspotOptions } from './HotspotSettingsTypes'
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

  const onConnected = useCallback((hotspot: Device) => {
    setConnectedHotspot(hotspot)
    animateTransition('HotspotDiagnostics.OnConnected')
    setState('options')
  }, [])

  const handleOptionSelected = useCallback(
    (opt: 'scan' | 'options' | HotspotOptions) => {
      switch (opt) {
        case 'diagnostic':
          updateTitle(t('hotspot_settings.diagnostics.title'))
          break
        case 'wifi':
          updateTitle(t('hotspot_settings.wifi.title'))
          break
        case 'options':
        default:
          updateTitle(t('hotspot_settings.title'))
          disableBack()
          break
      }
      animateTransition('HotspotDiagnostics.HandleOptionSelected')
      setState(opt)
    },
    [disableBack, t, updateTitle],
  )

  const selectOptions = useCallback(() => handleOptionSelected('options'), [
    handleOptionSelected,
  ])

  const handleConnected = useCallback((hotspot) => onConnected(hotspot), [
    onConnected,
  ])

  switch (state) {
    case 'scan':
      return <HotspotDiagnosticsConnection onConnected={handleConnected} />
    case 'options':
      return (
        <HotspotDiagnosticOptions
          hotspot={connectedHotspot}
          optionSelected={handleOptionSelected}
        />
      )
    case 'diagnostic':
      return <HotspotDiagnosticReport onFinished={selectOptions} />
    case 'wifi':
      return <WifiSettingsContainer onFinished={selectOptions} />
  }

  return null
}

export default memo(HotspotDiagnostics)
