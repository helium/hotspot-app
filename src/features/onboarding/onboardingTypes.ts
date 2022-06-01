import { StackNavigationProp } from '@react-navigation/stack'
import { NetTypes } from '@helium/address'

export type OnboardingStackParamList = {
  Welcome: undefined
  AccountPassphraseWarning: undefined
  AccountPassphraseGeneration: {
    netType: NetTypes.NetType
    wordCount: 12 | 24
  }
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
