import React from 'react'
import { SafeAreaView } from 'react-native'
import { useTheme } from '@shopify/restyle'
import WalletView from './WalletView'
import { Theme } from '../../../theme/theme'

// needed to use SafeAreaView directly because of
// strange spacing with SafeAreaBox

const WalletScreen = () => {
  const theme = useTheme<Theme>()
  return (
    <>
      <SafeAreaView
        style={{
          backgroundColor: theme.colors.primaryBackground,
          zIndex: 1,
          flex: 0,
        }}
      />
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.primaryBackground }}
      >
        <WalletView />
      </SafeAreaView>
    </>
  )
}

export default WalletScreen
