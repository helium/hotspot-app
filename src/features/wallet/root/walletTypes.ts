export const FilterKeys = [
  'all',
  'mining',
  'payment',
  'hotspot',
  'burn',
  'validator',
  'pending',
] as const
export type FilterType = typeof FilterKeys[number]

export const FilterPagingKeys = [
  'mining',
  'payment',
  'hotspot',
  'burn',
  'validator',
] as const
export type FilterPagingType = typeof FilterPagingKeys[number]

export const Filters = {
  all: ['all'],
  mining: ['rewards_v1', 'rewards_v2'],
  payment: ['payment_v1', 'payment_v2'],
  hotspot: [
    'add_gateway_v1',
    'assert_location_v1',
    'assert_location_v2',
    'transfer_hotspot_v1',
  ],
  validator: [
    'unstake_validator_v1',
    'stake_validator_v1',
    'transfer_validator_stake_v1',
  ],
  burn: ['token_burn_v1'],
  pending: [],
} as Record<FilterType, string[]>

export type ActivityViewState = 'undetermined' | 'no_activity' | 'activity'
