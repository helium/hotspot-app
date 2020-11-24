import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme/theme'
import Hotspots from '../../features/hotspots/HotspotsNavigator'
import { TabBarIconType, MainTabType } from './tabTypes'
import TabBarIcon from './TabBarIcon'
import More from '../../features/moreTab/MoreNavigator'

const MainTab = createBottomTabNavigator()

const Main = () => {
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

export default Main
