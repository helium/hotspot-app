import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import SendScreen from './SendScreen'
import ScanScreen from '../scan/ScanScreen'
import SendCompleteScreen from './SendCompleteScreen'

const WalletStack = createStackNavigator()

const SendNavigator = () => {
  return (
    <WalletStack.Navigator headerMode="none">
      <WalletStack.Screen name="Send" component={SendScreen} />
      <WalletStack.Screen name="SendScan" component={ScanScreen} />
      <WalletStack.Screen name="SendComplete" component={SendCompleteScreen} />
    </WalletStack.Navigator>
  )
}

export default SendNavigator
