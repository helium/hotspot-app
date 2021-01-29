import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import SendScreen from '../send/SendScreen'
import ScanScreen from './ScanScreen'
import SendCompleteScreen from '../send/SendCompleteScreen'

const ScanStack = createStackNavigator()

const ScanNavigator = () => {
  return (
    <ScanStack.Navigator headerMode="none">
      <ScanStack.Screen name="Scan" component={ScanScreen} />
      <ScanStack.Screen name="Send" component={SendScreen} />
      <ScanStack.Screen name="SendComplete" component={SendCompleteScreen} />
    </ScanStack.Navigator>
  )
}

export default ScanNavigator
