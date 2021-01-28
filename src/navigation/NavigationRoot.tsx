import React, { useState, useEffect, useCallback } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import changeNavigationBarColor from 'react-native-navigation-bar-color'
import Onboarding from '../features/onboarding/OnboardingNavigator'
import Education from '../features/educationSetup/EducationNavigator'
import SplashScreen from '../features/splash/SplashScreen'
import { restoreUser } from '../store/user/appSlice'
import { useAppDispatch } from '../store/store'
import { RootState } from '../store/rootReducer'
import defaultScreenOptions from './defaultScreenOptions'
import RootNav from './main/HomeNavigator'
import { useColors } from '../theme/themeHooks'

const RootStack = createStackNavigator()

const NavigationRoot = () => {
  const [showSplash, setShowSplash] = useState(true)
  const { isBackedUp, isEducated, isRestored } = useSelector(
    (state: RootState) => state.app,
  )
  const dispatch = useAppDispatch()
  const colors = useColors()

  useEffect(() => {
    changeNavigationBarColor(colors.primaryBackground, true, false)
  }, [colors.primaryBackground])

  useEffect(() => {
    dispatch(restoreUser())
    setTimeout(() => {
      setShowSplash(false)
    }, 1250)
  }, [dispatch])

  const currentScreen = useCallback(() => {
    if (showSplash || !isRestored)
      return <RootStack.Screen name="Splash" component={SplashScreen} />

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
  }, [showSplash, isEducated, isBackedUp, isRestored])

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
