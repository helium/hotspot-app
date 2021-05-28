import { round } from 'lodash'
import { HotspotType } from '../store/connectedHotspot/connectedHotspotSlice'
import { Colors } from '../theme/theme'

export enum SyncStatus {
  full,
  partial,
  none,
}

export const getSyncStatus = (hotspotHeight: number, blockHeight?: number) => {
  if (!blockHeight) return { status: SyncStatus.none, percent: 0 }

  const syncedRatio = hotspotHeight / blockHeight
  const percentSynced = round(syncedRatio * 100, 2)
  const within500Blocks = hotspotHeight
    ? blockHeight - hotspotHeight <= 500
    : false
  if (percentSynced === 100 || within500Blocks) {
    return { status: SyncStatus.full, percent: 100 }
  }
  if (percentSynced === 0) {
    return { status: SyncStatus.none, percent: 0 }
  }
  return { status: SyncStatus.partial, percent: percentSynced }
}

export const generateRewardScaleColor = (rewardScale: number): Colors => {
  if (rewardScale >= 0.75) {
    return 'greenMain'
  }
  if (rewardScale >= 0.5) {
    return 'yellow'
  }
  if (rewardScale >= 0.25) {
    return 'orangeDark'
  }
  return 'redMain'
}

export const isRelay = (listen_addrs: string[]) => {
  return !!(
    listen_addrs &&
    listen_addrs.length > 0 &&
    listen_addrs[0].match('p2p-circuit')
  )
}

export const isOnboardedWithQR = (hotspotType: HotspotType) =>
  (['QR_MAKER', 'LONGAPPRO'] as HotspotType[]).includes(hotspotType)
