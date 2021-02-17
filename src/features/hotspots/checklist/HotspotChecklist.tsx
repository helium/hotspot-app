import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Hotspot } from '@helium/http'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Carousel } from 'react-native-snap-carousel'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import { RootState } from '../../../store/rootReducer'
import { useAppDispatch } from '../../../store/store'
import { fetchChecklistActivity } from '../../../store/hotspotDetails/hotspotChecklistSlice'
import HotspotChecklistItem from './HotspotChecklistItem'
import { wp } from '../../../utils/layout'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import CarotDown from '../../../assets/images/carot-down.svg'
import CircleProgress from '../../../components/CircleProgress'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import animateTransition from '../../../utils/animateTransition'
import { useSpacing } from '../../../theme/themeHooks'

type Props = {
  hotspot: Hotspot
  witnesses?: Hotspot[]
}

type ChecklistItem = {
  key: string
  title: string
  description: string
  complete?: boolean
  showAuto?: boolean
  autoText?: string
  completeText?: string
  background?: 1 | 2 | 3 | 4
}

const HotspotChecklist = ({ hotspot, witnesses }: Props) => {
  const dispatch = useAppDispatch()
  const spacing = useSpacing()
  const { t } = useTranslation()
  const {
    heliumData: { blockHeight },
    hotspotChecklist: {
      challengerTxn,
      challengeeTxn,
      witnessTxn,
      dataTransferTxn,
      loadingActivity,
    },
  } = useSelector((state: RootState) => state)

  useEffect(() => {
    dispatch(fetchChecklistActivity(hotspot.address))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  let numComplete = 0
  checklistData.forEach((i) => {
    if (i.complete) {
      numComplete += 1
    }
  })
  checklistData.sort((a, b) => Number(b.complete) - Number(a.complete))
  const firstIndex = checklistData.findIndex((i) => !i.complete)
  const [hidden, setHidden] = useState(true)

  const toggleHidden = () => {
    animateTransition()
    setHidden(!hidden)
  }

  const renderItem = useCallback(
    (item: { item: ChecklistItem }) => (
      <HotspotChecklistItem
        title={item.item.title}
        description={item.item.description}
        complete={item.item.complete}
        showAuto={item.item.showAuto}
        autoText={item.item.autoText}
        completeText={item.item.completeText}
        background={item.item.background}
      />
    ),
    [],
  )

  if (loadingActivity) {
    return (
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item
          flexDirection="row"
          alignItems="center"
          marginStart={spacing.l}
          marginBottom={spacing.m}
        >
          <SkeletonPlaceholder.Item width={32} height={32} borderRadius={32} />
          <SkeletonPlaceholder.Item marginLeft={spacing.s}>
            <SkeletonPlaceholder.Item
              width={100}
              height={20}
              borderRadius={4}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    )
  }

  return (
    <Box>
      <Box
        flexDirection="row"
        marginStart="l"
        marginBottom="m"
        alignItems="center"
      >
        <CircleProgress
          percentage={(numComplete / checklistData.length) * 100}
          centerColor="white"
        />
        <TouchableOpacityBox
          flexDirection="row"
          alignItems="center"
          onPress={toggleHidden}
        >
          <>
            <Text variant="h5" color="black" marginStart="s">
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
      {!hidden && (
        <Carousel
          layout="default"
          firstItem={firstIndex === -1 ? 0 : firstIndex}
          activeSlideAlignment="center"
          vertical={false}
          data={checklistData}
          renderItem={renderItem}
          sliderWidth={wp(100)}
          itemWidth={wp(90)}
          inactiveSlideScale={1}
        />
      )}
    </Box>
  )
}

export default memo(HotspotChecklist)
