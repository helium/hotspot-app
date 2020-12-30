import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Platform } from 'react-native'
import AccountPassphraseWarningScreen from './accountPassphraseWarning/AccountPassphraseWarningScreen'
import AccountPassphraseGenerationScreen from './accountPassphraseGeneration/AccountPassphraseGenerationScreen'
import AccountCreatePassphraseScreen from './accountCreatePassphrase/AccountCreatePassphraseScreen'
import AccountEnterPassphraseScreen from './accountEnterPassphrase/AccountEnterPassphraseScreen'
import WelcomeScreen from './welcome/WelcomeScreen'
import { OnboardingStackParamList } from './onboardingTypes'
import AccountCreatePinScreen from './accountCreatePin/AccountCreatePinScreen'
import AccountConfirmPinScreen from './accountConfirmPin/AccountConfirmPinScreen'
import AccountImportScreen from './accountImport/AccountImportScreen'
import ImportAccountConfirmScreen from './importAccountConfirm/ImportAccountConfirmScreen'
import AccountImportCompleteScreen from './accountImportComplete/AccountImportCompleteScreen'
import DefaultScreenOptions from '../../navigation/defaultScreenOptions'

const OnboardingStack = createStackNavigator<OnboardingStackParamList>()
const Onboarding = () => {
  return (
    <OnboardingStack.Navigator
      headerMode="none"
      screenOptions={
        Platform.OS === 'android' ? DefaultScreenOptions : undefined
      }
      mode={Platform.OS === 'android' ? 'modal' : undefined}
    >
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
        name="AccountCreatePinScreen"
        component={AccountCreatePinScreen}
      />
      <OnboardingStack.Screen
        name="AccountConfirmPinScreen"
        component={AccountConfirmPinScreen}
      />
      <OnboardingStack.Screen
        name="AccountImportScreen"
        component={AccountImportScreen}
      />
      <OnboardingStack.Screen
        name="ImportAccountConfirmScreen"
        component={ImportAccountConfirmScreen}
      />
      <OnboardingStack.Screen
        name="AccountImportCompleteScreen"
        component={AccountImportCompleteScreen}
      />
    </OnboardingStack.Navigator>
  )
}

export default Onboarding
