export interface QrScanResult {
  type: 'payment' | 'dc_burn'
  address: string
  amount?: string
  memo?: string
}
