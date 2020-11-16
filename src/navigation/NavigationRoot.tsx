import React, { useState, useEffect, useCallback } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import {
  createStackNavigator,
  StackCardInterpolationProps,
} from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import Onboarding from '../features/onboarding/OnboardingNavigator'
import Education from '../features/education/EducationNavigator'
import SplashScreen from '../features/splash/SplashScreen'
import { RootState } from '../store/rootReducer'
import Stats from '../features/stats/StatsNavigator'

const RootStack = createStackNavigator()

const forFade = ({ current }: StackCardInterpolationProps) => ({
  cardStyle: {
    opacity: current.progress,
  },
})

const NavigationRoot = () => {
  const [showSplash, setShowSplash] = useState(true)
  const { isSignedIn, hasFinishedEducation } = useSelector(
    (state: RootState) => state.user,
  )

  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false)
    }, 750)
  }, [])

  const currentScreen = useCallback(() => {
    if (showSplash)
      return <RootStack.Screen name="Splash" component={SplashScreen} />

    if (!isSignedIn)
      return <RootStack.Screen name="Onboarding" component={Onboarding} />

    if (!hasFinishedEducation)
      return <RootStack.Screen name="Education" component={Education} />

    return <RootStack.Screen name="Stats" component={Stats} />
  }, [showSplash, isSignedIn, hasFinishedEducation])

  return (
    <NavigationContainer>
      <RootStack.Navigator
        headerMode="none"
        screenOptions={{
          cardStyleInterpolator: forFade,
        }}
      >
        {currentScreen()}
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

export default NavigationRoot
