import { Hotspot, Validator, Witness } from '@helium/http'
import { GlobalOpt, GLOBAL_OPTS } from '../features/hotspots/root/hotspotTypes'
import { Colors } from '../theme/theme'

export const generateRewardScaleColor = (rewardScale: number): Colors => {
  if (rewardScale >= 0.75) {
    return 'greenOnline'
  }
  if (rewardScale >= 0.5) {
    return 'yellow'
  }
  if (rewardScale >= 0.25) {
    return 'orangeDark'
  }
  return 'redMain'
}

export const isRelay = (listenAddrs: string[] | undefined) => {
  if (!listenAddrs) return false
  const IP = /ip4/g
  return listenAddrs.length > 0 && !listenAddrs.find((a) => a.match(IP))
}

export const isHotspot = (item: unknown): item is Hotspot =>
  (item as Hotspot).location !== undefined &&
  (item as Witness).witnessFor === undefined

export const isWitness = (
  item: GlobalOpt | Hotspot | Witness | Validator,
): item is Hotspot => (item as Witness).witnessFor !== undefined

export const isGlobalOption = (item: unknown): item is GlobalOpt =>
  typeof item === 'string' && GLOBAL_OPTS.includes(item as GlobalOpt)
