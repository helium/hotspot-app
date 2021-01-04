import { StackNavigationProp } from '@react-navigation/stack'

export type OnboardingStackParamList = {
  Welcome: undefined
  AccountPassphraseWarning: undefined
  AccountPassphraseGeneration: undefined
  AccountCreatePassphraseScreen: undefined
  AccountEnterPassphraseScreen: undefined
  AccountCreatePinScreen:
    | { fromImport?: boolean; pinReset?: boolean }
    | undefined
  AccountConfirmPinScreen: {
    pin: string
    fromImport?: boolean
    pinReset?: boolean
  }
  AccountImportScreen: undefined
  ImportAccountConfirmScreen: { words: Array<string> }
  AccountImportCompleteScreen: { words: Array<string> }
}

export type OnboardingNavigationProp = StackNavigationProp<OnboardingStackParamList>
