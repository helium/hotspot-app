import { StackNavigationProp } from '@react-navigation/stack'

export type MoreStackParamList = {
  MoreScreen: undefined | { pinVerified: boolean }
  VerifyPinScreen: undefined
  AccountCreatePinScreen:
    | { fromImport?: boolean; pinReset?: boolean }
    | undefined
  AccountConfirmPinScreen: {
    pin: string
    fromImport?: boolean
    pinReset?: boolean
  }
}

export type MoreNavigationProp = StackNavigationProp<MoreStackParamList>
