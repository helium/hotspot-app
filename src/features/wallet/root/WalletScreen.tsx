import React from 'react'
import WalletView from './WalletView'
import Box from '../../../components/Box'

const WalletScreen = () => {
  return (
    <Box flex={1} backgroundColor="primaryBackground">
      <WalletView />
    </Box>
  )
}

export default WalletScreen
