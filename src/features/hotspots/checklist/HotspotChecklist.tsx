/* eslint-disable react/jsx-props-no-spreading */
import React, { memo, useEffect, useMemo, useState } from 'react'
import { Hotspot, Witness } from '@helium/http'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import { BoxProps } from '@shopify/restyle'
import { RootState } from '../../../store/rootReducer'
import { useAppDispatch } from '../../../store/store'
import { fetchChecklistActivity } from '../../../store/hotspotDetails/hotspotChecklistSlice'
import Box from '../../../components/Box'
import animateTransition from '../../../utils/animateTransition'
import { useSpacing } from '../../../theme/themeHooks'
import HotspotChecklistCarousel, {
  ChecklistItem,
} from './HotspotChecklistCarousel'
import { wp } from '../../../utils/layout'
import { Theme } from '../../../theme/theme'
import { SYNC_BLOCK_BUFFER } from '../../../utils/hotspotUtils'

type Props = BoxProps<Theme> & {
  hotspot: Hotspot | Witness
  witnesses?: Witness[]
  visible: boolean
}

const HotspotChecklist = ({
  hotspot,
  witnesses,
  visible,
  ...boxProps
}: Props) => {
  const dispatch = useAppDispatch()
  const spacing = useSpacing()
  const { t } = useTranslation()
  const {
    challengerTxn,
    challengeeTxn,
    witnessTxn,
    dataTransferTxn,
    loadingActivity,
  } = useSelector((state: RootState) => state.hotspotChecklist)
  const blockHeight = useSelector(
    (state: RootState) => state.heliumData.blockHeight,
  )
  const [showSkeleton, setShowSkeleton] = useState(true)
  const [lastLoadedAddress, setLastLoadedAddress] = useState<string>()

  useEffect(() => {
    if (!visible) return
    if (!lastLoadedAddress || lastLoadedAddress !== hotspot.address) {
      animateTransition('HotspotChecklist.HotspotChange')
      setShowSkeleton(true)
      dispatch(fetchChecklistActivity(hotspot.address))
      setLastLoadedAddress(hotspot.address)
    }
  }, [dispatch, hotspot.address, lastLoadedAddress, visible])

  useEffect(() => {
    if (!visible) return

    if (showSkeleton && !loadingActivity) {
      animateTransition('HotspotChecklist.LoadingChange')
      setShowSkeleton(false)
    }
  }, [loadingActivity, showSkeleton, visible])

  const syncStatus = useMemo(() => {
    if (!hotspot?.status?.height || !blockHeight) {
      return t('checklist.blocks.not')
    }
    if (blockHeight - hotspot.status.height < SYNC_BLOCK_BUFFER) {
      return t('checklist.blocks.full')
    }
    return t('checklist.blocks.partial', {
      count: blockHeight - hotspot.status.height,
      percent: ((hotspot.status.height / blockHeight) * 100).toFixed(2),
      height: hotspot.status.height,
    })
  }, [blockHeight, hotspot?.status?.height, t])

  const hotspotStatus = useMemo(
    () =>
      hotspot?.status?.online === 'online'
        ? t('checklist.status.online')
        : t('checklist.status.offline'),
    [hotspot?.status?.online, t],
  )

  const challengerStatus = useMemo(
    () =>
      challengerTxn && blockHeight
        ? t('checklist.challenger.success', {
            count: blockHeight - challengerTxn.height,
          })
        : t('checklist.challenger.fail'),
    [blockHeight, challengerTxn, t],
  )

  const challengeWitnessStatus = useMemo(
    () =>
      witnessTxn
        ? t('checklist.challenge_witness.success')
        : t('checklist.challenge_witness.fail'),
    [t, witnessTxn],
  )

  const witnessStatus = useMemo(
    () =>
      witnesses && witnesses.length > 0
        ? t('checklist.witness.success', { count: witnesses?.length })
        : t('checklist.witness.fail'),
    [t, witnesses],
  )

  const challengeeStatus = useMemo(
    () =>
      challengeeTxn && blockHeight
        ? t('checklist.challengee.success', {
            count: blockHeight - challengeeTxn.height,
          })
        : t('checklist.challengee.fail'),
    [blockHeight, challengeeTxn, t],
  )

  const dataTransferStatus = useMemo(
    () =>
      dataTransferTxn
        ? t('checklist.data_transfer.success')
        : t('checklist.data_transfer.fail'),
    [dataTransferTxn, t],
  )

  const checklistData: ChecklistItem[] = useMemo(
    () => [
      {
        key: 'checklist.blocks',
        title: t('checklist.blocks.title'),
        description: syncStatus,
        complete:
          (blockHeight &&
            hotspot?.status?.height &&
            blockHeight - hotspot.status.height < SYNC_BLOCK_BUFFER) ||
          false,
        showAuto: true,
      },
      {
        key: 'checklist.status',
        title: t('checklist.status.title'),
        description: hotspotStatus,
        complete: hotspot?.status?.online === 'online',
        showAuto: false,
      },
      {
        key: 'checklist.challenger',
        title: t('checklist.challenger.title'),
        description: challengerStatus,
        complete: challengerTxn !== undefined,
        showAuto: true,
      },
      {
        key: 'checklist.challenge_witness',
        title: t('checklist.challenge_witness.title'),
        description: challengeWitnessStatus,
        complete: witnessTxn !== undefined,
        showAuto: true,
      },
      {
        key: 'checklist.witness',
        title: t('checklist.witness.title'),
        description: witnessStatus,
        complete: witnesses && witnesses.length > 0,
        showAuto: true,
        autoText: t('checklist.auto_refresh'),
      },
      {
        key: 'checklist.challengee',
        title: t('checklist.challengee.title'),
        description: challengeeStatus,
        complete: challengeeTxn !== undefined,
        showAuto: true,
        autoText: t('checklist.auto_hours'),
      },
      {
        key: 'checklist.data_transfer',
        title: t('checklist.data_transfer.title'),
        description: dataTransferStatus,
        complete: dataTransferTxn !== undefined,
        showAuto: true,
      },
    ],
    [
      blockHeight,
      challengeWitnessStatus,
      challengeeStatus,
      challengeeTxn,
      challengerStatus,
      challengerTxn,
      dataTransferStatus,
      dataTransferTxn,
      hotspot?.status?.height,
      hotspot?.status?.online,
      hotspotStatus,
      syncStatus,
      t,
      witnessStatus,
      witnessTxn,
      witnesses,
    ],
  )

  const percentComplete = useMemo(() => {
    let count = 0
    checklistData.forEach((i) => {
      if (i.complete) {
        count += 1
      }
    })
    return (count / checklistData.length) * 100
  }, [checklistData])

  if (!visible) return null

  return (
    <Box {...boxProps}>
      {loadingActivity && (
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item flexDirection="row">
            <SkeletonPlaceholder.Item
              width={115}
              height={115}
              marginLeft={spacing.xl}
              marginRight={spacing.m}
              borderRadius={60}
            />
            <SkeletonPlaceholder.Item flexDirection="column">
              <SkeletonPlaceholder.Item
                width={wp(25)}
                height={20}
                borderRadius={8}
              />
              <SkeletonPlaceholder.Item
                width={wp(45)}
                height={20}
                marginTop={spacing.s}
                borderRadius={8}
              />
              <SkeletonPlaceholder.Item
                width={wp(45)}
                height={70}
                marginTop={spacing.s}
                borderRadius={8}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      )}
      {!loadingActivity && (
        <HotspotChecklistCarousel
          checklistData={checklistData}
          percentComplete={percentComplete}
        />
      )}
    </Box>
  )
}

export default memo(HotspotChecklist)
