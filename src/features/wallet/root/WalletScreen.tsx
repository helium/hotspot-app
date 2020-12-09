import React from 'react'
import WalletView from './WalletView'
import SafeAreaBox from '../../../components/SafeAreaBox'

const WalletScreen = () => {
  return (
    <SafeAreaBox flex={1} backgroundColor="primaryBackground">
      <WalletView />
    </SafeAreaBox>
  )
}

export default WalletScreen
