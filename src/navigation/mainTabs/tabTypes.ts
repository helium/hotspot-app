import { StackNavigationProp } from '@react-navigation/stack'

export type MainTabType = 'Hotspots' | 'Network' | 'Account' | 'More'

export type TabBarIconType = {
  focused: boolean
  color: string
  size: number
}

export type VerifyPinRequestType =
  | 'disablePin'
  | 'enablePinForPayments'
  | 'disablePinForPayments'
  | 'resetPin'

export type RootStackParamList = {
  MainTabs: undefined
  VerifyPinScreen: { requestType: VerifyPinRequestType }
}

export type RootNavigationProp = StackNavigationProp<RootStackParamList>
