export const AppLinkCategories = [
  'payment',
  'dc_burn',
  'transfer',
  'hotspot',
] as const
export type AppLinkCategoryType = typeof AppLinkCategories[number]

export const AppLinkFields = ['type', 'address', 'amount', 'memo'] as const
export type AppLinkFieldType = typeof AppLinkFields[number]
export type AppLink = {
  type: AppLinkCategoryType
  payees: Array<Payee>
}

// Used by AppLink to represent multiple payees within a single blockchain transaction
type Payee = {
  address: string
  amount?: string
  memo?: string
}
