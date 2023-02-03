import React, { useEffect, memo, useMemo, useCallback } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { Alert, Linking } from 'react-native'
import { useTranslation } from 'react-i18next'
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
import { hasSentinelTimePassed } from '../../utils/timeUtils'
import Articles from '../../constants/articles'

const MainTab = createBottomTabNavigator()

const MainTabs = () => {
  const { primaryBackground } = useColors()
  const { t } = useTranslation()
  const navigation = useNavigation<RootNavigationProp>()
  const tabNavigation = useNavigation<MainTabNavigationProp>()
  const {
    isLocked,
    isSettingUpHotspot,
    lastSolanaNotification,
    hideSolanaNotification,
    isPinRequired,
    lastSeenSentinel,
  } = useSelector((state: RootState) => state.app)
  const pushNotification = useSelector(
    (state: RootState) => state.notifications.pushNotification,
  )
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (hasSentinelTimePassed(lastSeenSentinel)) {
      dispatch(appSlice.actions.updateLastSeenSentinel())
      navigation.navigate('SentinelScreen')
    }

    if (!isLocked) return
    navigation.navigate('LockScreen', { requestType: 'unlock', lock: true })
  }, [dispatch, isLocked, lastSeenSentinel, navigation])

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

  const showSolanaAlert = useCallback(() => {
    if (
      !hideSolanaNotification &&
      hasSentinelTimePassed(lastSolanaNotification)
    ) {
      Alert.alert(t('solana.alert.title'), t('solana.alert.message'), [
        {
          text: t('solana.alert.button1'),
          onPress: () => Linking.openURL(Articles.Wallet_Site),
        },
        {
          text: t('solana.alert.button2'),
          onPress: () => {
            dispatch(appSlice.actions.updateHideSolanaNotification(true))
            if (isPinRequired) {
              navigation.navigate('LockScreen', {
                requestType: 'revealPrivateKey',
              })
            } else {
              navigation.navigate('MainTabs', {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                screen: 'More',
                params: {
                  screen: 'RevealPrivateKeyScreen',
                },
              })
            }
          },
        },
      ])
    }
  }, [
    dispatch,
    hideSolanaNotification,
    isPinRequired,
    lastSolanaNotification,
    navigation,
    t,
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
      <MainTab.Screen
        name="Wallet"
        component={WalletNavigator}
        listeners={() => ({
          tabPress: showSolanaAlert,
        })}
      />
      <MainTab.Screen name="Notifications" component={NotificationsScreen} />
      <MainTab.Screen name="More" component={More} />
    </MainTab.Navigator>
  )
}

export default memo(MainTabs)
