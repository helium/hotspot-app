import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useTheme } from '@shopify/restyle'
import { createStackNavigator } from '@react-navigation/stack'
import { Theme } from '../../theme/theme'
import Hotspots from '../../features/hotspots/HotspotsNavigator'
import { TabBarIconType, MainTabType } from './tabTypes'
import TabBarIcon from './TabBarIcon'
import More from '../../features/moreTab/MoreNavigator'
import VerifyPinScreen from '../../features/moreTab/verifyPin/VerifyPinScreen'

const MainTab = createBottomTabNavigator()

const MainTabs = () => {
  const {
    colors: { secondaryBackground },
  } = useTheme<Theme>()

  return (
    <MainTab.Navigator
      tabBarOptions={{
        showLabel: false,
        style: {
          backgroundColor: secondaryBackground,
          borderTopWidth: 0,
        },
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }: TabBarIconType) => {
          return (
            <TabBarIcon
              name={route.name as MainTabType}
              focused={focused}
              color={color}
              size={size}
            />
          )
        },
      })}
    >
      <MainTab.Screen name="Account" component={Hotspots} />
      <MainTab.Screen name="Hotspots" component={Hotspots} />
      <MainTab.Screen name="Network" component={Hotspots} />
      <MainTab.Screen name="More" component={More} />
    </MainTab.Navigator>
  )
}

const RootStack = createStackNavigator()
const RootStackScreen = () => {
  return (
    <RootStack.Navigator mode="modal">
      <RootStack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="VerifyPinScreen"
        component={VerifyPinScreen}
        options={{ headerShown: false }}
      />
    </RootStack.Navigator>
  )
}

export default RootStackScreen
