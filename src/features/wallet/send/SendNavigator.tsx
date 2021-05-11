import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import SendScreen from './SendScreen'
import ScanScreen from '../scan/ScanScreen'
import SendCompleteScreen from './SendCompleteScreen'
import { RootStackParamList } from '../../../navigation/main/tabTypes'

const SendStack = createStackNavigator()

type Route = RouteProp<RootStackParamList, 'SendStack'>

type Props = {
  route: Route
}
const SendNavigator = ({ route }: Props) => {
  return (
    <SendStack.Navigator headerMode="none">
      <SendStack.Screen
        name="Send"
        component={SendScreen}
        initialParams={route.params}
      />
      <SendStack.Screen name="SendScan" component={ScanScreen} />
      <SendStack.Screen name="SendComplete" component={SendCompleteScreen} />
    </SendStack.Navigator>
  )
}

export default SendNavigator
