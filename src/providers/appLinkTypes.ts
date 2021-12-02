import { WalletLink } from '@helium/react-native-sdk'

export const AppLinkCategories = [
  'payment',
  'dc_burn',
  'transfer',
  'hotspot',
  'validator',
  'add_gateway',
  'hotspot_location',
  'link_wallet',
  'sign_hotspot',
] as const
export type AppLinkCategoryType = typeof AppLinkCategories[number]

export const AppLinkFields = ['type', 'address', 'amount', 'memo'] as const
export type AppLinkFieldType = typeof AppLinkFields[number]
export type AppLink = {
  type: AppLinkCategoryType
  address: string
  amount?: string | number
  memo?: string
  [key: string]: string | number | undefined
}

export type AppLinkPayment = {
  type: AppLinkCategoryType
  senderAddress?: string
  payees: Array<Payee>
}

// Used by AppLink to represent multiple payees within a single blockchain transaction
export type Payee = {
  address: string
  amount?: string | number
  memo?: string
}

export type AppLinkLocation = {
  type: AppLinkCategoryType
  hotspotAddress: string
  latitude: number
  longitude: number
}

export type LinkWalletRequest = {
  type: AppLinkCategoryType
} & WalletLink.LinkWalletRequest

export type SignHotspotRequest = {
  type: AppLinkCategoryType
} & WalletLink.SignHotspotRequest
