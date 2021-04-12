import React, { memo, useEffect, useMemo, useState } from 'react'
import { Hotspot } from '@helium/http'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import { RootState } from '../../../store/rootReducer'
import { useAppDispatch } from '../../../store/store'
import { fetchChecklistActivity } from '../../../store/hotspotDetails/hotspotChecklistSlice'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import CarotDown from '../../../assets/images/carot-down.svg'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import animateTransition from '../../../utils/animateTransition'
import { useSpacing } from '../../../theme/themeHooks'
import HotspotChecklistCarousel, {
  ChecklistItem,
} from './HotspotChecklistCarousel'
import { wp } from '../../../utils/layout'

type Props = {
  hotspot: Hotspot
  witnesses?: Hotspot[]
}

const HotspotChecklist = ({ hotspot, witnesses }: Props) => {
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
  const checklistEnabled = useSelector(
    (state: RootState) => state.features.checklistEnabled,
  )
  const [hidden, setHidden] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    if (checklistEnabled && !hidden && !hasLoaded) {
      setHasLoaded(true)
      dispatch(fetchChecklistActivity(hotspot.address))
    }
  }, [hidden, checklistEnabled, dispatch, hotspot.address, hasLoaded])

  const syncStatus = useMemo(() => {
    if (!hotspot?.status?.height || !blockHeight) {
      return t('checklist.blocks.not')
    }
    if (blockHeight - hotspot.status.height < 500) {
      return t('checklist.blocks.full')
    }
    return t('checklist.blocks.partial', {
      count: blockHeight - hotspot.status.height,
      percent: ((hotspot.status.height / blockHeight) * 100).toFixed(2),
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

  const checklistData: ChecklistItem[] = [
    {
      key: 'checklist.blocks',
      title: t('checklist.blocks.title'),
      description: syncStatus,
      complete:
        (blockHeight &&
          hotspot?.status?.height &&
          blockHeight - hotspot.status.height < 500) ||
        false,
      showAuto: true,
      background: 1,
    },
    {
      key: 'checklist.status',
      title: t('checklist.status.title'),
      description: hotspotStatus,
      complete: hotspot?.status?.online === 'online',
      showAuto: false,
      completeText: t('checklist.online'),
      background: 1,
    },
    {
      key: 'checklist.challenger',
      title: t('checklist.challenger.title'),
      description: challengerStatus,
      complete: challengerTxn !== undefined,
      showAuto: true,
      background: 2,
    },
    {
      key: 'checklist.challenge_witness',
      title: t('checklist.challenge_witness.title'),
      description: challengeWitnessStatus,
      complete: witnessTxn !== undefined,
      showAuto: true,
      background: 4,
    },
    {
      key: 'checklist.witness',
      title: t('checklist.witness.title'),
      description: witnessStatus,
      complete: witnesses && witnesses.length > 0,
      showAuto: true,
      background: 4,
    },
    {
      key: 'checklist.challengee',
      title: t('checklist.challengee.title'),
      description: challengeeStatus,
      complete: challengeeTxn !== undefined,
      showAuto: true,
      autoText: t('checklist.auto_hours'),
      background: 3,
    },
    {
      key: 'checklist.challengee',
      title: t('checklist.data_transfer.title'),
      description: dataTransferStatus,
      complete: dataTransferTxn !== undefined,
      showAuto: true,
      background: 3,
    },
  ]

  checklistData.sort((a, b) => Number(b.complete) - Number(a.complete))

  const toggleHidden = () => {
    animateTransition()
    setHidden(!hidden)
  }

  if (!checklistEnabled) {
    return null
  }

  return (
    <Box>
      <Box
        flexDirection="row"
        marginStart="l"
        marginBottom="m"
        alignItems="center"
      >
        <TouchableOpacityBox
          flexDirection="row"
          alignItems="center"
          onPress={toggleHidden}
        >
          <>
            <Text variant="h5" color="black" paddingTop="xs">
              {t('checklist.title')}
            </Text>
            <Box marginStart="s">
              <CarotDown
                color="black"
                style={{
                  transform: [{ rotateX: hidden ? '0deg' : '180deg' }],
                }}
              />
            </Box>
          </>
        </TouchableOpacityBox>
      </Box>
      {!hidden && loadingActivity && (
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item flexDirection="row">
            <SkeletonPlaceholder.Item
              width={wp(80)}
              height={150}
              marginStart={spacing.l}
              borderRadius={8}
            />
            <SkeletonPlaceholder.Item
              width={wp(80)}
              height={150}
              marginStart={spacing.s}
              borderRadius={8}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      )}
      {!hidden && !loadingActivity && hasLoaded && (
        <HotspotChecklistCarousel checklistData={checklistData} />
      )}
    </Box>
  )
}

export default memo(HotspotChecklist)
