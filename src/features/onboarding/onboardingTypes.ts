import { StackNavigationProp } from '@react-navigation/stack'

export type OnboardingStackParamList = {
  Welcome: undefined
  AccountPassphraseWarning: undefined
}

export type WelcomeScreenNavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  'Welcome'
>
