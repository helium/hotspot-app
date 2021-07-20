import { round } from 'lodash'
import { Colors } from '../theme/theme'

export type HotspotSyncStatus = 'full' | 'partial' | 'none'

export const getSyncStatus = ({
  hotspotBlockHeight,
  blockHeight,
  hotspotSyncBuffer,
}: {
  hotspotBlockHeight: number
  blockHeight?: number
  hotspotSyncBuffer?: number
}): HotspotSyncStatus => {
  if (!blockHeight || !hotspotSyncBuffer) {
    return 'none'
  }

  const syncedRatio = hotspotBlockHeight / blockHeight
  const percentSynced = round(syncedRatio * 100, 2)

  const withinBlockBuffer = hotspotBlockHeight
    ? blockHeight - hotspotBlockHeight <= hotspotSyncBuffer
    : false

  if (percentSynced === 100 || withinBlockBuffer) {
    return 'full'
  }

  if (percentSynced === 0) {
    return 'none'
  }
  return 'partial'
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
