import React, { memo, useEffect } from 'react'
import { Platform } from 'react-native'
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack'
import OneSignal from 'react-native-onesignal'
import LockScreen from '../../features/lock/LockScreen'
import defaultScreenOptions from '../defaultScreenOptions'
import HotspotSetup from '../../features/hotspots/setup/HotspotSetupNavigator'
import MainTabs from './MainTabNavigator'
import SendNavigator from '../../features/wallet/send/SendNavigator'
import ScanNavigator from '../../features/wallet/scan/ScanNavigator'
import SignHotspot from '../../features/txnDelegatation/SignHotspot'
import LinkWallet from '../../features/txnDelegatation/LinkWallet'

const HomeStack = createStackNavigator()

const HomeStackScreen = () => {
  useEffect(() => {
    if (Platform.OS === 'android') return

    OneSignal.promptForPushNotificationsWithUserResponse(() => {})
  }, [])

  const isIOS = Platform.OS === 'ios'
  const modalTransition = isIOS
    ? TransitionPresets.ModalPresentationIOS
    : TransitionPresets.FadeFromBottomAndroid

  return (
    <HomeStack.Navigator
      mode="modal"
      screenOptions={({ route }) => {
        if (route.name === 'LockScreen')
          return { ...defaultScreenOptions, gestureEnabled: false }

        if (Platform.OS === 'android') return defaultScreenOptions
        return {}
      }}
    >
      <HomeStack.Screen
        name="MainTabs"
        options={{ headerShown: false }}
        component={MainTabs}
      />
      <HomeStack.Screen
        name="HotspotSetup"
        component={HotspotSetup}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <HomeStack.Screen
        name="ScanStack"
        component={ScanNavigator}
        options={{
          headerShown: false,
          cardOverlayEnabled: isIOS,
          ...modalTransition,
        }}
      />
      <HomeStack.Screen
        name="SendStack"
        component={SendNavigator}
        options={{
          headerShown: false,
          cardOverlayEnabled: isIOS,
          ...modalTransition,
        }}
      />
      <HomeStack.Screen
        name="LockScreen"
        component={LockScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="LinkWallet"
        component={LinkWallet}
        options={{
          headerShown: false,
          cardOverlayEnabled: isIOS,
          ...modalTransition,
        }}
      />
      <HomeStack.Screen
        name="SignHotspot"
        component={SignHotspot}
        options={{
          headerShown: false,
          cardOverlayEnabled: isIOS,
          ...modalTransition,
        }}
      />
    </HomeStack.Navigator>
  )
}

export default memo(HomeStackScreen)
