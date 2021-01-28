import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import SendScreen from '../../wallet/send/SendScreen'
import ScanScreen from '../../wallet/scan/ScanScreen'
import SendCompleteScreen from '../../wallet/send/SendCompleteScreen'

const TransferStack = createStackNavigator()

const TransferNavigator = () => {
  return (
    <TransferStack.Navigator headerMode="none">
      <TransferStack.Screen name="Send" component={SendScreen} />
      <TransferStack.Screen name="SendScan" component={ScanScreen} />
      <TransferStack.Screen
        name="SendComplete"
        component={SendCompleteScreen}
      />
    </TransferStack.Navigator>
  )
}

export default TransferNavigator
