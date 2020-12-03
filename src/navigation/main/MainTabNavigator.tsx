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
import { useAppDispatch } from '../../store/store'
import userSlice from '../../store/user/userSlice'

const MainTab = createBottomTabNavigator()

const MainTabs = () => {
  const { secondaryBackground } = useColors()
  const navigation = useNavigation<RootNavigationProp>()
  const {
    user: { isLocked, isSettingUpHotspot },
  } = useSelector((state: RootState) => state)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!isLocked) return
    navigation.push('LockScreen', { requestType: 'unlock', lock: true })
  }, [isLocked, navigation])

  useEffect(() => {
    if (!isSettingUpHotspot) return

    dispatch(userSlice.actions.startHotspotSetup())
    navigation.push('HotspotSetup')
  }, [isSettingUpHotspot, dispatch, navigation])

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
