import React, { memo } from 'react'
import Portal from '@burstware/react-native-portal'
import WalletView from './WalletView'
import Box from '../../../components/Box'
import ActivityDetails from './ActivityDetails/ActivityDetails'

const WalletScreen = () => {
  return (
    <>
      <Box flex={1} backgroundColor="primaryBackground">
        <WalletView />
      </Box>
      <Portal>
        <ActivityDetails />
      </Portal>
    </>
  )
}

export default memo(WalletScreen)
