import { StackNavigationProp } from '@react-navigation/stack'

export type ScanStackParamList = {
  Scan: {
    fromSend?: boolean
  }
}

export type ScanNavigationProps = StackNavigationProp<ScanStackParamList>

export type QrScanResult = {
  type: 'payment' | 'dc_burn'
  address: string
  amount?: string
  memo?: string
}
