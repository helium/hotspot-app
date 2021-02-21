export type ScanType = 'payment' | 'dc_burn' | 'transfer'

export interface QrScanResult {
  type: ScanType
  address: string
  amount?: string
  memo?: string
}

export type ScanStackParamList = {
  Scan: {
    type?: ScanType
    showBottomSheet?: boolean
  }
}
