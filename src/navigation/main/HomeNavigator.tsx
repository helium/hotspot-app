import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import LockScreen from '../../features/lock/LockScreen'
import defaultScreenOptions from '../defaultScreenOptions'
import HotspotSetup from '../../features/hotspots/setup/HotspotSetupNavigator'
import MainTabs from './MainTabNavigator'

const HomeStack = createStackNavigator()

const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator
      mode="modal"
      screenOptions={({ route }) => {
        if (route.name === 'LockScreen')
          return { ...defaultScreenOptions, gestureEnabled: false }

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
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="LockScreen"
        component={LockScreen}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  )
}

export default HomeStackScreen
