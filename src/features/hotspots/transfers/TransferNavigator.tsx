import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { Hotspot } from '@helium/http'
import SendScreen from '../../wallet/send/SendScreen'
import ScanScreen from '../../wallet/scan/ScanScreen'
import SendCompleteScreen from '../../wallet/send/SendCompleteScreen'

const TransferStack = createStackNavigator()

type TransferRouteParams = {
  transfer: {
    hotspot: Hotspot
    isSeller: boolean
  }
}

type Route = RouteProp<TransferRouteParams, 'transfer'>

type Props = {
  route: Route
}

const TransferNavigator = ({ route }: Props) => {
  const { hotspot, isSeller } = route.params
  return (
    <TransferStack.Navigator headerMode="none">
      <TransferStack.Screen
        name="Send"
        component={SendScreen}
        initialParams={{ type: 'transfer', hotspot, isSeller }}
      />
      <TransferStack.Screen
        name="SendScan"
        component={ScanScreen}
        initialParams={{ type: 'transfer', showBottomSheet: false }}
      />
      <TransferStack.Screen
        name="SendComplete"
        component={SendCompleteScreen}
      />
    </TransferStack.Navigator>
  )
}

export default TransferNavigator
