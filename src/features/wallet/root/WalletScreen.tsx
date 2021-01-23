import React, { memo } from 'react'
import WalletView from './WalletView'
import Box from '../../../components/Box'
import WalletProvider from './ActivityDetails/WalletProvider'
import ActivityDetails from './ActivityDetails/ActivityDetails'

const WalletScreen = () => {
  return (
    <WalletProvider>
      <Box flex={1} backgroundColor="primaryBackground">
        <WalletView />
      </Box>
      <ActivityDetails />
    </WalletProvider>
  )
}

export default memo(WalletScreen)
