import { StackNavigationProp } from '@react-navigation/stack'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { Hotspot } from '@helium/http'
import { AppLink, AppLinkCategoryType } from '../../providers/appLinkTypes'

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
    lock?: boolean
  }
  HotspotSetup: undefined
  ScanStack: undefined
  SendStack:
    | undefined
    | {
        scanResult?: AppLink
        type?: AppLinkCategoryType
        hotspot?: Hotspot
        isSeller?: boolean
        pinVerified?: 'fail' | 'pass'
      }
}

export type RootNavigationProp = StackNavigationProp<RootStackParamList>

export type MainTabParamList = {
  Hotspots: undefined
  Wallet: undefined
  Notifications: undefined
  More: undefined
}

export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>
