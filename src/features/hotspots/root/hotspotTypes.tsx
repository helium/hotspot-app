import { StackNavigationProp } from '@react-navigation/stack'
import { Hotspot } from '@helium/http'

export type HotspotStackParamList = {
  HotspotsScreen: undefined
  HotspotDetails: { hotspot: Hotspot }
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
  rewards: ['rewards_v1'],
  challenge_activity: ['poc_receipts_v1'],
  data_transfer: ['state_channel_close_v1'],
  challenge_construction: ['poc_request_v1'],
  consensus_group: ['consensus_group_v1'],
} as Record<HotspotActivityType, string[]>
