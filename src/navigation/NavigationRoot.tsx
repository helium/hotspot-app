import React, { memo, useEffect, useMemo } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import changeNavigationBarColor from 'react-native-navigation-bar-color'
import Onboarding from '../features/onboarding/OnboardingNavigator'
import { RootState } from '../store/rootReducer'
import defaultScreenOptions from './defaultScreenOptions'
import HomeNav from './main/HomeNavigator'
import { useColors } from '../theme/themeHooks'
import SendScreen from '../features/wallet/send/SendScreen'
import SendCompleteScreen from '../features/wallet/send/SendCompleteScreen'

const OnboardingStack = createStackNavigator()
const MainStack = createStackNavigator()

const NavigationRoot = () => {
  const { isBackedUp } = useSelector((state: RootState) => state.app)
  const colors = useColors()

  useEffect(() => {
    changeNavigationBarColor(colors.primaryBackground, true, false)
  }, [colors.primaryBackground])

  const currentScreen = useMemo(() => {
    if (!isBackedUp)
      return (
        <OnboardingStack.Navigator
          headerMode="none"
          screenOptions={defaultScreenOptions}
        >
          <OnboardingStack.Screen
            name="Onboarding"
            component={Onboarding}
            options={{ gestureEnabled: false }}
          />
        </OnboardingStack.Navigator>
      )

    return (
      <MainStack.Navigator
        headerMode="none"
        screenOptions={defaultScreenOptions}
      >
        <MainStack.Screen name="MainTab" component={HomeNav} />
        <MainStack.Screen name="Send" component={SendScreen} />
        <MainStack.Screen name="SendComplete" component={SendCompleteScreen} />
      </MainStack.Navigator>
    )
  }, [isBackedUp])

  return currentScreen
}

export default memo(NavigationRoot)
