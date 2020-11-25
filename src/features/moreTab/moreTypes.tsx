import { StackNavigationProp } from '@react-navigation/stack'
import { VerifyPinRequestType } from '../../navigation/mainTabs/tabTypes'

export type MoreStackParamList = {
  MoreScreen: undefined | { pinVerifiedFor: VerifyPinRequestType }
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
