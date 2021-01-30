import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import SendScreen from './SendScreen'
import ScanScreen from '../scan/ScanScreen'
import SendCompleteScreen from './SendCompleteScreen'

const SendStack = createStackNavigator()

const SendNavigator = () => {
  return (
    <SendStack.Navigator headerMode="none">
      <SendStack.Screen name="Send" component={SendScreen} />
      <SendStack.Screen name="SendScan" component={ScanScreen} />
      <SendStack.Screen name="SendComplete" component={SendCompleteScreen} />
    </SendStack.Navigator>
  )
}

export default SendNavigator
