import { StackNavigationProp } from '@react-navigation/stack'
import { QrScanResult } from '../scan/scanTypes'

export type SendType = 'payment' | 'dc_burn'

export type SendStackParamList = {
  Send: {
    scanResult?: QrScanResult
  }
}

export type SendNavigationProps = StackNavigationProp<SendStackParamList>
