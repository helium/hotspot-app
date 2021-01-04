import * as React from 'react'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Platform } from 'react-native'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { MoreStackParamList } from './moreTypes'
import DefaultScreenOptions from '../../navigation/defaultScreenOptions'
import MoreScreen from './more/MoreScreen'
import AccountCreatePinScreen from '../onboarding/accountCreatePin/AccountCreatePinScreen'
import AccountConfirmPinScreen from '../onboarding/accountConfirmPin/AccountConfirmPinScreen'
import { RootStackParamList } from '../../navigation/main/tabTypes'
import RevealWordsScreen from './reveal/RevealWordsScreen'

const MoreStack = createStackNavigator<MoreStackParamList>()

type Props = BottomTabScreenProps<RootStackParamList>
const More = ({ navigation, route }: Props) => {
  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route)
    navigation.setOptions({
      tabBarVisible: !routeName || routeName === 'MoreScreen',
    })
  }, [navigation, route])

  return (
    <MoreStack.Navigator
      headerMode="none"
      screenOptions={
        Platform.OS === 'android' ? DefaultScreenOptions : undefined
      }
      mode={Platform.OS === 'android' ? 'modal' : undefined}
    >
      <MoreStack.Screen name="MoreScreen" component={MoreScreen} />
      <MoreStack.Screen
        name="AccountCreatePinScreen"
        component={AccountCreatePinScreen}
      />
      <MoreStack.Screen
        name="AccountConfirmPinScreen"
        component={AccountConfirmPinScreen}
      />
      <MoreStack.Screen
        name="RevealWordsScreen"
        component={RevealWordsScreen}
      />
    </MoreStack.Navigator>
  )
}

export default More
