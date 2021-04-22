import React, { useEffect, memo } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { StyleSheet } from 'react-native'
import Hotspots from '../../features/hotspots/root/HotspotsNavigator'
import { TabBarIconType, MainTabType } from './tabTypes'
import TabBarIcon from './TabBarIcon'
import More from '../../features/moreTab/MoreNavigator'
import { RootState } from '../../store/rootReducer'
import { useColors } from '../../theme/themeHooks'
import { useAppDispatch } from '../../store/store'
import WalletNavigator from '../../features/wallet/WalletNavigator'
import { wp } from '../../utils/layout'
import appSlice from '../../store/user/appSlice'
import NotificationsScreen from '../../features/notifications/NotificationsScreen'
import notificationSlice from '../../store/notifications/notificationSlice'

const MainTab = createBottomTabNavigator()

const MainTabs = () => {
  const { white, grayLight } = useColors()
  const navigation = useNavigation()
  const {
    app: { isLocked, isSettingUpHotspot },
  } = useSelector((state: RootState) => state)
  const notification = useSelector(
    (state: RootState) => state.notifications.notification,
  )
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!isLocked) return
    navigation.navigate('LockScreen', { requestType: 'unlock', lock: true })
  }, [isLocked, navigation])

  useEffect(() => {
    if (!isSettingUpHotspot) return

    dispatch(appSlice.actions.startHotspotSetup())
    navigation.navigate('HotspotSetup')
  }, [isSettingUpHotspot, dispatch, navigation])

  useEffect(() => {
    if (!isLocked && notification) {
      // TODO: use event.notification.additionalData.type to navigate to specific screens
      navigation.navigate('Notifications')
      dispatch(notificationSlice.actions.notificationHandled())
    }
  }, [navigation, isLocked, notification, dispatch])

  return (
    <MainTab.Navigator
      sceneContainerStyle={{
        opacity: isLocked ? 0 : 1,
      }}
      initialRouteName="Hotspots"
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

export default memo(MainTabs)
