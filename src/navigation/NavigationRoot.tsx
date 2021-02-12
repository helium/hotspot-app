import React, { useEffect, useCallback, memo } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import changeNavigationBarColor from 'react-native-navigation-bar-color'
import Onboarding from '../features/onboarding/OnboardingNavigator'
import { RootState } from '../store/rootReducer'
import defaultScreenOptions from './defaultScreenOptions'
import RootNav from './main/HomeNavigator'
import { useColors } from '../theme/themeHooks'

const RootStack = createStackNavigator()

const NavigationRoot = () => {
  const { isBackedUp } = useSelector((state: RootState) => state.app)
  const colors = useColors()

  useEffect(() => {
    changeNavigationBarColor(colors.primaryBackground, true, false)
  }, [colors.primaryBackground])

  const currentScreen = useCallback(() => {
    if (!isBackedUp)
      return (
        <RootStack.Screen
          name="Onboarding"
          component={Onboarding}
          options={{ gestureEnabled: false }}
        />
      )

    return <RootStack.Screen name="MainTab" component={RootNav} />
  }, [isBackedUp])

  return (
    <NavigationContainer>
      <RootStack.Navigator
        headerMode="none"
        screenOptions={defaultScreenOptions}
      >
        {currentScreen()}
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

export default memo(NavigationRoot)
