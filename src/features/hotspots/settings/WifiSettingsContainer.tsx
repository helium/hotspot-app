import React, { useState, useCallback, useEffect } from 'react'
import animateTransition from '../../../utils/animateTransition'
import WifiSettings from './WifiSettings'
import WifiSetup from './WifiSetup'
import { useHotspotSettingsContext } from './HotspotSettingsProvider'

type Props = { onFinished: () => void }
const WifiSettingsContainer = ({ onFinished }: Props) => {
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null)

  const { enableBack } = useHotspotSettingsContext()

  const handleNetworkSelected = (wifi: string) => {
    setSelectedNetwork(wifi)
    animateTransition()
  }

  const handleBack = useCallback(() => {
    animateTransition()
    if (selectedNetwork) {
      setSelectedNetwork(null)
    } else {
      onFinished()
    }
  }, [onFinished, selectedNetwork])

  useEffect(() => {
    enableBack(handleBack)
  }, [enableBack, handleBack])

  if (selectedNetwork) {
    return <WifiSetup network={selectedNetwork} onFinished={onFinished} />
  }
  return <WifiSettings onNetworkSelected={handleNetworkSelected} />
}

export default WifiSettingsContainer
