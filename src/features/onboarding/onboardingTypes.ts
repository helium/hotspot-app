import { StackNavigationProp } from '@react-navigation/stack'

export type OnboardingStackParamList = {
  Welcome: undefined
  AccountPassphraseWarning: undefined
  AccountPassphraseGeneration: undefined
  AccountCreatePassphraseScreen: undefined
  AccountEnterPassphraseScreen: undefined
  AccountSecureScreen: undefined
  AccountCreatePinScreen: undefined
}

export type OnboardingNavigationProp = StackNavigationProp<
  OnboardingStackParamList
>
