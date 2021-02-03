import React, { useEffect, useCallback } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import changeNavigationBarColor from 'react-native-navigation-bar-color'
import Onboarding from '../features/onboarding/OnboardingNavigator'
import Education from '../features/educationSetup/EducationNavigator'
import { RootState } from '../store/rootReducer'
import defaultScreenOptions from './defaultScreenOptions'
import RootNav from './main/HomeNavigator'
import { useColors } from '../theme/themeHooks'

const RootStack = createStackNavigator()

const NavigationRoot = () => {
  const { isBackedUp, isEducated } = useSelector(
    (state: RootState) => state.app,
  )
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

    if (!isEducated)
      return <RootStack.Screen name="Education" component={Education} />

    return <RootStack.Screen name="MainTab" component={RootNav} />
  }, [isEducated, isBackedUp])

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

export default NavigationRoot
