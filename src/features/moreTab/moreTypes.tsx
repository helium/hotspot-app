import { StackNavigationProp } from '@react-navigation/stack'

export type MoreStackParamList = {
  MoreScreen: undefined | { pinVerified: boolean }
  VerifyPinScreen: undefined
}

export type MoreNavigationProp = StackNavigationProp<MoreStackParamList>
