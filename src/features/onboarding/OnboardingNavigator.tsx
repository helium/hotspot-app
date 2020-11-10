import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import AccountPassphraseWarningScreen from './accountPassphraseWarning/AccountPassphraseWarningScreen'
import AccountPassphraseGenerationScreen from './accountPassphraseGeneration/AccountPassphraseGenerationScreen'
import AccountCreatePassphraseScreen from './accountCreatePassphrase/AccountCreatePassphraseScreen'
import AccountEnterPassphraseScreen from './AccountEnterPassphrase/AccountEnterPassphraseScreen'
import WelcomeScreen from './welcome/WelcomeScreen'
import { OnboardingStackParamList } from './onboardingTypes'

const OnboardingStack = createStackNavigator<OnboardingStackParamList>()

const Onboarding = () => {
  return (
    <OnboardingStack.Navigator headerMode="none">
      <OnboardingStack.Screen name="Welcome" component={WelcomeScreen} />
      <OnboardingStack.Screen
        name="AccountPassphraseWarning"
        component={AccountPassphraseWarningScreen}
      />
      <OnboardingStack.Screen
        name="AccountPassphraseGeneration"
        component={AccountPassphraseGenerationScreen}
      />
      <OnboardingStack.Screen
        name="AccountCreatePassphraseScreen"
        component={AccountCreatePassphraseScreen}
      />
      <OnboardingStack.Screen
        name="AccountEnterPassphraseScreen"
        component={AccountEnterPassphraseScreen}
      />
    </OnboardingStack.Navigator>
  )
}

export default Onboarding
