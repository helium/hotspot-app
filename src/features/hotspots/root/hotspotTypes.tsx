import { StackNavigationProp } from '@react-navigation/stack'

export type HotspotStackParamList = {
  HotspotsScreen:
    | undefined
    | { address: string; resource: 'validator' | 'hotspot' }
}

export type HotspotNavigationProp = StackNavigationProp<HotspotStackParamList>

export const HotspotActivityKeys = [
  'all',
  'rewards',
  'challenge_activity',
  'data_transfer',
  'challenge_construction',
  'consensus_group',
] as const
export type HotspotActivityType = typeof HotspotActivityKeys[number]

export const HotspotActivityFilters = {
  all: [],
  rewards: ['rewards_v1', 'rewards_v2'],
  challenge_activity: ['poc_receipts_v1'],
  data_transfer: ['state_channel_close_v1'],
  challenge_construction: ['poc_request_v1'],
  consensus_group: ['consensus_group_v1'],
} as Record<HotspotActivityType, string[]>

export type HotspotSyncStatus = 'full' | 'partial'

export const GLOBAL_OPTS = ['explore', 'search', 'home'] as const
export type GlobalOpt = typeof GLOBAL_OPTS[number]
