import React from 'react'
import SafeAreaBox from '../../components/SafeAreaBox'
import WalletView from './WalletView'

const WalletScreen = () => {
  return (
    <SafeAreaBox
      backgroundColor="primaryBackground"
      flex={1}
      justifyContent="space-evenly"
      alignContent="center"
      padding="l"
      flexDirection="column"
    >
      <WalletView />
    </SafeAreaBox>
  )
}

export default WalletScreen
