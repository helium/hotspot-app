import { StackNavigationProp } from '@react-navigation/stack'
import { QrScanResult } from '../../features/wallet/scan/scanTypes'

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
    scanResult?: QrScanResult
  }
  HotspotSetup: undefined
  Scan: undefined
  Send: {
    scanResult?: QrScanResult
  }
}

export type RootNavigationProp = StackNavigationProp<RootStackParamList>
