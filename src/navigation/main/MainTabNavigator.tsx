import React, { useEffect, memo, useMemo, useCallback } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import Hotspots from '../../features/hotspots/root/HotspotsNavigator'
import {
  TabBarIconType,
  MainTabType,
  RootNavigationProp,
  MainTabNavigationProp,
} from './tabTypes'
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
import { fetchHotspotsData } from '../../store/hotspots/hotspotsSlice'

const MainTab = createBottomTabNavigator()

const MainTabs = () => {
  const { primaryBackground } = useColors()
  const navigation = useNavigation<RootNavigationProp>()
  const tabNavigation = useNavigation<MainTabNavigationProp>()
  const {
    app: { isLocked, isSettingUpHotspot },
  } = useSelector((state: RootState) => state)
  const pushNotification = useSelector(
    (state: RootState) => state.notifications.pushNotification,
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
    if (!isLocked && pushNotification) {
      // TODO: use pushNotification.additionalData.type to navigate to specific screens
      tabNavigation.navigate('Notifications')
      dispatch(notificationSlice.actions.pushNotificationHandled())
    }
  }, [tabNavigation, isLocked, pushNotification, dispatch])

  const sceneContainerStyle = useMemo(
    () => ({
      opacity: isLocked ? 0 : 1,
    }),
    [isLocked],
  )

  const tabBarOptions = useMemo(
    () => ({
      showLabel: false,
      style: {
        backgroundColor: primaryBackground,
        borderTopWidth: 0,
        paddingHorizontal: wp(12),
      },
    }),
    [primaryBackground],
  )

  const screenOptions = useCallback(
    ({ route }) => ({
      tabBarIcon: ({ focused, color, size }: TabBarIconType) => {
        return (
          <TabBarIcon
            name={route.name as MainTabType}
            focused={focused}
            color={color}
            size={Math.min(size, 22)}
          />
        )
      },
    }),
    [],
  )

  const fetchHotspotData = useCallback(() => dispatch(fetchHotspotsData()), [
    dispatch,
  ])

  return (
    <MainTab.Navigator
      sceneContainerStyle={sceneContainerStyle}
      initialRouteName="Hotspots"
      tabBarOptions={tabBarOptions}
      screenOptions={screenOptions}
    >
      <MainTab.Screen
        name="Hotspots"
        component={Hotspots}
        listeners={{
          tabPress: fetchHotspotData,
        }}
      />
      <MainTab.Screen name="Wallet" component={WalletNavigator} />
      <MainTab.Screen name="Notifications" component={NotificationsScreen} />
      <MainTab.Screen name="More" component={More} />
    </MainTab.Navigator>
  )
}

export default memo(MainTabs)
