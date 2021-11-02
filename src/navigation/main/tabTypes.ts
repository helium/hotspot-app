import { StackNavigationProp } from '@react-navigation/stack'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { SendRouteType } from '../../features/wallet/send/sendTypes'
import { LinkWalletRequest } from '../../providers/appLinkTypes'

export type MainTabType = 'Hotspots' | 'Wallet' | 'Notifications' | 'More'

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
  | 'revealWords'
  | 'send'

export type RootStackParamList = {
  MainTabs: undefined | { pinVerifiedFor: LockScreenRequestType }
  LockScreen: {
    requestType: LockScreenRequestType
    sendParams?: undefined | SendRouteType
    lock?: boolean
  }
  HotspotSetup: undefined
  ScanStack: undefined
  SendStack: undefined | SendRouteType
  LinkWallet: LinkWalletRequest
}

export type RootNavigationProp = StackNavigationProp<RootStackParamList>

export type MainTabParamList = {
  Hotspots: undefined
  Wallet: undefined
  Notifications: undefined
  More: undefined
}

export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>
