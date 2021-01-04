import { StackNavigationProp } from '@react-navigation/stack'
import { LockScreenRequestType } from '../../navigation/main/tabTypes'

export type MoreStackParamList = {
  MoreScreen: undefined | { pinVerifiedFor: LockScreenRequestType }
  AccountCreatePinScreen:
    | { fromImport?: boolean; pinReset?: boolean }
    | undefined
  AccountConfirmPinScreen: {
    pin: string
    fromImport?: boolean
    pinReset?: boolean
  }
  RevealWordsScreen: undefined
}

export type MoreNavigationProp = StackNavigationProp<MoreStackParamList>
