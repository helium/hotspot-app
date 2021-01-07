import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import SendScreen from './SendScreen'
import ScanScreen from '../scan/ScanScreen'

const WalletStack = createStackNavigator()

const SendNavigator = () => {
  return (
    <WalletStack.Navigator headerMode="none">
      <WalletStack.Screen name="Send" component={SendScreen} />
      <WalletStack.Screen name="SendScan" component={ScanScreen} />
    </WalletStack.Navigator>
  )
}

export default SendNavigator
