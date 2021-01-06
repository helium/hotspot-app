export const FilterKeys = [
  'all',
  'mining',
  'payment',
  'hotspot',
  'pending',
] as const
export type FilterType = typeof FilterKeys[number]
