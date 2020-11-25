import { StackNavigationProp } from '@react-navigation/stack'

export type RequestType =
  | 'disablePin'
  | 'enablePinForPayments'
  | 'disablePinForPayments'

export type MoreStackParamList = {
  MoreScreen: undefined | { pinVerifiedFor: RequestType }
  VerifyPinScreen: { requestType: RequestType }
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
