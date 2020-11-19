import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme/theme'
import Hotspots from '../../features/hotspots/HotspotsNavigator'
import { TabBarIconType, MainTabType } from './tabTypes'
import TabBarIcon from './TabBarIcon'

const MainTab = createBottomTabNavigator()

const Main = () => {
  const {
    colors: { mainBackground },
  } = useTheme<Theme>()

  return (
    <MainTab.Navigator
      tabBarOptions={{
        showLabel: false,
        style: {
          backgroundColor: mainBackground,
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
      <MainTab.Screen name="More" component={Hotspots} />
    </MainTab.Navigator>
  )
}

export default Main
