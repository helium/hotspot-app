import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import SendScreen from '../send/SendScreen'
import ScanScreen from './ScanScreen'

const WalletStack = createStackNavigator()

const SendNavigator = () => {
  return (
    <WalletStack.Navigator headerMode="none">
      <WalletStack.Screen name="Scan" component={ScanScreen} />
      <WalletStack.Screen name="Send" component={SendScreen} />
    </WalletStack.Navigator>
  )
}

export default SendNavigator
