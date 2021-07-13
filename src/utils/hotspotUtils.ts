import { round } from 'lodash'
import { Colors } from '../theme/theme'

export enum SyncStatus {
  full,
  partial,
  none,
}

export const SYNC_BLOCK_BUFFER = 1500

export const getSyncStatus = (hotspotHeight: number, blockHeight?: number) => {
  if (!blockHeight) return { status: SyncStatus.none, percent: 0 }

  const syncedRatio = hotspotHeight / blockHeight
  const percentSynced = round(syncedRatio * 100, 2)

  const withinBlockBuffer = hotspotHeight
    ? blockHeight - hotspotHeight <= SYNC_BLOCK_BUFFER
    : false

  if (percentSynced === 100 || withinBlockBuffer) {
    return { status: SyncStatus.full, percent: 100 }
  }

  if (percentSynced === 0) {
    return { status: SyncStatus.none, percent: 0 }
  }
  return { status: SyncStatus.partial, percent: percentSynced }
}

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
