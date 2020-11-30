import { StackNavigationProp } from '@react-navigation/stack'

export type MainTabType = 'Hotspots' | 'Network' | 'Account' | 'More'

export type TabBarIconType = {
  focused: boolean
  color: string
  size: number
}

export type LockScreenRequestType =
  | 'disablePin'
  | 'enablePinForPayments'
  | 'disablePinForPayments'
  | 'resetPin'
  | 'unlock'

export type RootStackParamList = {
  MainTabs: undefined | { pinVerifiedFor: LockScreenRequestType }
  LockScreen: { requestType: LockScreenRequestType; lock?: boolean }
}

export type RootNavigationProp = StackNavigationProp<RootStackParamList>
