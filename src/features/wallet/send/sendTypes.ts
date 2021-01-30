import { StackNavigationProp } from '@react-navigation/stack'
import { Hotspot } from '@helium/http'
import { QrScanResult } from '../scan/scanTypes'

export type SendType = 'payment' | 'dc_burn' | 'transfer'

export type SendStackParamList = {
  Send: {
    scanResult?: QrScanResult
    type?: SendType
    hotspot?: Hotspot
    isSeller?: boolean
  }
}

export type SendNavigationProps = StackNavigationProp<SendStackParamList>
