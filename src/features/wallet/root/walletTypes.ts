export const FilterKeys = [
  'all',
  'mining',
  'payment',
  'hotspot',
  'pending',
] as const
export type FilterType = typeof FilterKeys[number]

export const FilterPagingKeys = ['mining', 'payment', 'hotspot'] as const
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
  pending: [],
} as Record<FilterType, string[]>

export type ActivityViewState = 'undetermined' | 'no_activity' | 'activity'
