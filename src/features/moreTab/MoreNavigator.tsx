import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Platform } from 'react-native'
import { MoreStackParamList } from './moreTypes'
import DefaultScreenOptions from '../../navigation/defaultScreenOptions'
import MoreScreen from './more/MoreScreen'
import VerifyPinScreen from './verifyPin/VerifyPinScreen'
import AccountCreatePinScreen from '../onboarding/accountCreatePin/AccountCreatePinScreen'
import AccountConfirmPinScreen from '../onboarding/accountConfirmPin/AccountConfirmPinScreen'

const MoreStack = createStackNavigator<MoreStackParamList>()

const More = () => {
  return (
    <MoreStack.Navigator
      headerMode="none"
      screenOptions={
        Platform.OS === 'android' ? DefaultScreenOptions : undefined
      }
      mode={Platform.OS === 'android' ? 'modal' : undefined}
    >
      <MoreStack.Screen name="MoreScreen" component={MoreScreen} />
      <MoreStack.Screen name="VerifyPinScreen" component={VerifyPinScreen} />
      <MoreStack.Screen
        name="AccountCreatePinScreen"
        component={AccountCreatePinScreen}
      />
      <MoreStack.Screen
        name="AccountConfirmPinScreen"
        component={AccountConfirmPinScreen}
      />
    </MoreStack.Navigator>
  )
}

export default More
