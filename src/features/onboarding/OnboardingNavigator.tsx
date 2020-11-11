import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import AccountPassphraseWarningScreen from './accountPassphraseWarning/AccountPassphraseWarningScreen'
import AccountPassphraseGenerationScreen from './accountPassphraseGeneration/AccountPassphraseGenerationScreen'
import AccountCreatePassphraseScreen from './accountCreatePassphrase/AccountCreatePassphraseScreen'
import AccountEnterPassphraseScreen from './accountEnterPassphrase/AccountEnterPassphraseScreen'
import AccountSecureScreen from './accountSecure/AccountSecureScreen'
import WelcomeScreen from './welcome/WelcomeScreen'
import { OnboardingStackParamList } from './onboardingTypes'
import AccountCreatePinScreen from './accountCreatePin/AccountCreatePinScreen'

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
      <OnboardingStack.Screen
        name="AccountSecureScreen"
        component={AccountSecureScreen}
      />
      <OnboardingStack.Screen
        name="AccountCreatePinScreen"
        component={AccountCreatePinScreen}
      />
    </OnboardingStack.Navigator>
  )
}

export default Onboarding
