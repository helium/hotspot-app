import React, { memo } from 'react'
import Portal from '@burstware/react-native-portal'
import { Platform } from 'react-native'
import WalletView from './WalletView'
import Box from '../../../components/Box'
import ActivityDetails from './ActivityDetails/ActivityDetails'

const WalletScreen = () => {
  return (
    <>
      <Box flex={1} backgroundColor="primaryBackground">
        <WalletView />
      </Box>

      {/* For some reason having a BottomSheet (which is in ActivityDetails)
      contained in a <Portal/> breaks the header drag handler on Android.
      Conditionally removing the portal on Android for now  */}
      {Platform.OS === 'android' && <ActivityDetails />}
      {Platform.OS === 'ios' && (
        <Portal>
          <ActivityDetails />
        </Portal>
      )}
    </>
  )
}

export default memo(WalletScreen)
