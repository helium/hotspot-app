export type ScanType = 'payment' | 'dc_burn' | 'transfer'

type Payee = {
  address: string
  amount?: string
  memo?: string
}

export interface QrScanResult {
  type: ScanType
  payees: Array<Payee>
}

export type ScanStackParamList = {
  Scan: {
    type?: ScanType
    showBottomSheet?: boolean
  }
}
