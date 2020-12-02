import React, { useEffect } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import Hotspots from '../../features/hotspots/root/HotspotsNavigator'
import { TabBarIconType, MainTabType, RootNavigationProp } from './tabTypes'
import TabBarIcon from './TabBarIcon'
import More from '../../features/moreTab/MoreNavigator'
import { RootState } from '../../store/rootReducer'
import { useColors } from '../../theme/themeHooks'
import Box from '../../components/Box'
import StatsScreen from '../../features/stats/StatsScreen'

const MainTab = createBottomTabNavigator()

const MainTabs = () => {
  const { secondaryBackground } = useColors()
  const navigation = useNavigation<RootNavigationProp>()
  const {
    user: { isLocked },
  } = useSelector((state: RootState) => state)

  useEffect(() => {
    if (!isLocked) return
    navigation.push('LockScreen', { requestType: 'unlock', lock: true })
  }, [isLocked, navigation])

  if (isLocked) return <Box backgroundColor="secondaryBackground" flex={1} />

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
      <MainTab.Screen name="Hotspots" component={Hotspots} />
      <MainTab.Screen name="Wallet" component={StatsScreen} />
      <MainTab.Screen name="Notifications" component={StatsScreen} />
      <MainTab.Screen name="More" component={More} />
    </MainTab.Navigator>
  )
}

export default MainTabs
