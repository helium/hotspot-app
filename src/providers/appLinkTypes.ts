export type AppLinkType = 'payment' | 'dc_burn' | 'transfer' | 'hotspot'
export const AppLinkKeys = ['type', 'address', 'amount', 'memo'] as const
export type AppLinkKeysType = typeof AppLinkKeys[number]
export type AppLink = {
  type: AppLinkType
  address: string
  amount?: string
  memo?: string
}
