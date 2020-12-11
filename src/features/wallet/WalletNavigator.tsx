import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import WalletScreen from './root/WalletScreen'

const WalletStack = createStackNavigator()

const Wallet = () => {
  return (
    <WalletStack.Navigator headerMode="none">
      <WalletStack.Screen name="Wallet" component={WalletScreen} />
    </WalletStack.Navigator>
  )
}

export default Wallet
