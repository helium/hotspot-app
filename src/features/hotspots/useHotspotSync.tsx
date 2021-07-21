import { useCallback, useMemo } from 'react'
import { Hotspot, Witness } from '@helium/http'
import { formatDistanceToNow } from 'date-fns'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { round } from 'lodash'
import { RootState } from '../../store/rootReducer'
import shortLocale from '../../utils/formatDistance'
import hotspotsSlice from '../../store/hotspots/hotspotsSlice'
import { useAppDispatch } from '../../store/store'
import { hasValidCache } from '../../utils/cacheUtils'
import { HotspotSyncStatus } from './root/hotspotTypes'

const useHotspotSync = (hotspot?: Hotspot | Witness) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const syncStatuses = useSelector(
    (state: RootState) => state.hotspots.syncStatuses,
  )
  const hotspotSyncBuffer = useSelector(
    (state: RootState) => state.features.hotspotSyncBuffer,
  )
  const currentBlockHeight = useSelector(
    (state: RootState) => state.heliumData.blockHeight,
  )

  const hotspotSyncStatus = useMemo(() => {
    if (!hotspot) return

    return syncStatuses[hotspot.address]
  }, [hotspot, syncStatuses])

  const getStatusMessage = useCallback(() => {
    if (
      !hotspot ||
      !hotspotSyncStatus ||
      hotspotSyncStatus.status === undefined
    ) {
      return ''
    }
    if (hotspot.status?.online !== 'online') {
      return t('checklist.blocks.not')
    }

    const timeAgo = hotspot.status?.timestamp
      ? formatDistanceToNow(new Date(hotspot.status.timestamp), {
          locale: shortLocale,
          addSuffix: true,
        })
      : null

    if (hotspotSyncStatus.status === 'full') {
      if (!timeAgo) {
        return t('checklist.blocks.full')
      }
      return t('checklist.blocks.full_with_date', {
        timeAgo,
      })
    }
    if (!timeAgo) {
      return t('checklist.blocks.partial')
    }
    return t('checklist.blocks.partial_with_date', { timeAgo })
  }, [hotspot, hotspotSyncStatus, t])

  const getSyncPercentage = useCallback(
    ({
      hotspotBlockHeight,
      blockHeight,
    }: {
      hotspotBlockHeight: number
      blockHeight?: number
    }) => {
      const baseHeight = blockHeight || currentBlockHeight

      if (!baseHeight) return 0

      const syncedRatio = hotspotBlockHeight / baseHeight
      return round(syncedRatio * 100, 2)
    },
    [currentBlockHeight],
  )

  const getSyncStatus = useCallback(
    ({
      hotspotBlockHeight,
      blockHeight,
    }: {
      hotspotBlockHeight: number
      blockHeight?: number
    }): HotspotSyncStatus | undefined => {
      if (!hotspotSyncBuffer) return

      const baseHeight = blockHeight || currentBlockHeight

      if (!baseHeight) return

      const withinBlockBuffer = hotspotBlockHeight
        ? baseHeight - hotspotBlockHeight <= hotspotSyncBuffer
        : false

      if (withinBlockBuffer) {
        return 'full'
      }

      return 'partial'
    },
    [currentBlockHeight, hotspotSyncBuffer],
  )

  const updateSyncStatus = useCallback(async () => {
    if (
      !hotspot ||
      !hotspot.status?.timestamp ||
      !hotspot.status?.height ||
      !hotspotSyncBuffer ||
      hasValidCache(hotspotSyncStatus)
    )
      return

    const response = await fetch(
      `https://api.helium.io/v1/blocks/height/?max_time=${hotspot.status.timestamp}`,
    )
    const body = await response.json()

    const status = getSyncStatus({
      hotspotBlockHeight: hotspot.status.height,
      blockHeight: body.data.height,
    })

    if (!status) return

    dispatch(
      hotspotsSlice.actions.updateSyncStatus({
        status,
        address: hotspot.address,
      }),
    )
  }, [dispatch, getSyncStatus, hotspot, hotspotSyncBuffer, hotspotSyncStatus])

  return {
    getStatusMessage,
    hotspotSyncStatus,
    updateSyncStatus,
    getSyncStatus,
    getSyncPercentage,
  }
}

export default useHotspotSync
