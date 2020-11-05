import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import AccountDescriptionScreen from './accountDescription/AccountDescriptionScreen'
import WelcomeScreen from './welcome/WelcomeScreen'
import { OnboardingStackParamList } from './onboardingTypes'

const OnboardingStack = createStackNavigator<OnboardingStackParamList>()

const Onboarding = () => {
  return (
    <OnboardingStack.Navigator headerMode="none">
      <OnboardingStack.Screen name="Welcome" component={WelcomeScreen} />
      <OnboardingStack.Screen
        name="AccountDescription"
        component={AccountDescriptionScreen}
      />
    </OnboardingStack.Navigator>
  )
}

export default Onboarding
