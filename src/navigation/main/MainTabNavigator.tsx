import React, { useEffect } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { StyleSheet } from 'react-native'
import Hotspots from '../../features/hotspots/root/HotspotsNavigator'
import { TabBarIconType, MainTabType, RootNavigationProp } from './tabTypes'
import TabBarIcon from './TabBarIcon'
import More from '../../features/moreTab/MoreNavigator'
import { RootState } from '../../store/rootReducer'
import { useColors } from '../../theme/themeHooks'
import Box from '../../components/Box'
import { useAppDispatch } from '../../store/store'
import WalletNavigator from '../../features/wallet/WalletNavigator'
import { wp } from '../../utils/layout'
import appSlice from '../../store/user/appSlice'
import NotificationsScreen from '../../features/notifications/NotificationsScreen'

const MainTab = createBottomTabNavigator()

const MainTabs = () => {
  const { white, grayLight } = useColors()
  const navigation = useNavigation<RootNavigationProp>()
  const {
    app: { isLocked, isSettingUpHotspot },
  } = useSelector((state: RootState) => state)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!isLocked) return
    navigation.push('LockScreen', { requestType: 'unlock', lock: true })
  }, [isLocked, navigation])

  useEffect(() => {
    if (!isSettingUpHotspot) return

    dispatch(appSlice.actions.startHotspotSetup())
    navigation.push('HotspotSetup')
  }, [isSettingUpHotspot, dispatch, navigation])

  if (isLocked) return <Box backgroundColor="primaryBackground" flex={1} />

  return (
    <MainTab.Navigator
      initialRouteName="Wallet"
      lazy={false}
      tabBarOptions={{
        showLabel: false,
        style: {
          backgroundColor: white,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: grayLight,
          paddingHorizontal: wp(12),
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
      <MainTab.Screen name="Wallet" component={WalletNavigator} />
      <MainTab.Screen name="Notifications" component={NotificationsScreen} />
      <MainTab.Screen name="More" component={More} />
    </MainTab.Navigator>
  )
}

export default MainTabs
