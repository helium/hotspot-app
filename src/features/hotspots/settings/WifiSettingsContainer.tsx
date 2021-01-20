import React, { useState } from 'react'
import animateTransition from '../../../utils/animateTransition'
import WifiSettings from './WifiSettings'
import WifiSetup from './WifiSetup'

type Props = { onFinished: () => void }
const WifiSettingsContainer = ({ onFinished }: Props) => {
  const [selectedNetwork, setSelectedNetwork] = useState<string | undefined>(
    undefined,
  )

  const handleNetworkSelected = (wifi: string) => {
    setSelectedNetwork(wifi)
    animateTransition()
  }

  if (selectedNetwork) {
    return <WifiSetup network={selectedNetwork} onFinished={onFinished} />
  }
  return <WifiSettings onNetworkSelected={handleNetworkSelected} />
}

export default WifiSettingsContainer
