import React from 'react'
import { View } from 'react-native'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../../theme/theme'
import WalletView from './WalletView'

const WalletScreen = () => {
  const theme = useTheme<Theme>()
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.primaryBackground,
      }}
    >
      <WalletView />
    </View>
  )
}

export default WalletScreen
