import React, { useEffect } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import Hotspots from '../../features/hotspots/HotspotsNavigator'
import {
  TabBarIconType,
  MainTabType,
  RootNavigationProp,
  RootStackParamList,
} from './tabTypes'
import TabBarIcon from './TabBarIcon'
import More from '../../features/moreTab/MoreNavigator'
import { RootState } from '../../store/rootReducer'
import LockScreen from '../../features/lock/LockScreen'
import { useAppDispatch } from '../../store/store'
import userSlice from '../../store/user/userSlice'
import defaultScreenOptions from '../defaultScreenOptions'
import { useColors } from '../../theme/themeHooks'
import Box from '../../components/Box'

const MainTab = createBottomTabNavigator()
type Route = RouteProp<RootStackParamList, 'MainTabs'>
const MainTabs = () => {
  const { secondaryBackground } = useColors()
  const navigation = useNavigation<RootNavigationProp>()
  const { params } = useRoute<Route>()
  const {
    user: { isLocked },
  } = useSelector((state: RootState) => state)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!isLocked) return
    navigation.push('LockScreen', { requestType: 'unlock', lock: true })
  }, [isLocked, navigation])

  useEffect(() => {
    if (!params?.pinVerifiedFor) return

    const { pinVerifiedFor } = params

    switch (pinVerifiedFor) {
      case 'unlock':
        dispatch(userSlice.actions.lock(false))
        break
    }
  }, [dispatch, params, navigation])

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
      <MainTab.Screen name="Wallet" component={Hotspots} />
      <MainTab.Screen name="Notifications" component={Hotspots} />
      <MainTab.Screen name="More" component={More} />
    </MainTab.Navigator>
  )
}

const RootStack = createStackNavigator()
const RootStackScreen = () => {
  return (
    <RootStack.Navigator
      mode="modal"
      screenOptions={{ ...defaultScreenOptions, gestureEnabled: false }}
    >
      <RootStack.Screen name="MainTabs" options={{ headerShown: false }}>
        {() => <MainTabs />}
      </RootStack.Screen>
      <RootStack.Screen
        name="LockScreen"
        component={LockScreen}
        options={{ headerShown: false }}
      />
    </RootStack.Navigator>
  )
}

export default RootStackScreen
