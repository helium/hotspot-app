import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import animalName from 'angry-purple-tiger'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Hotspot } from '@helium/http'
import { LayoutChangeEvent } from 'react-native'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import StatusBadge from './StatusBadge'
import TimelinePicker from './TimelinePicker'
import HotspotDetailChart from './HotspotDetailChart'
import { RootState } from '../../../store/rootReducer'
import { getRewardChartData } from './RewardsHelper'
import { useAppDispatch } from '../../../store/store'
import { fetchHotspotDetails } from '../../../store/hotspotDetails/hotspotDetailsSlice'
import HexBadge from './HexBadge'
import HotspotChecklist from '../checklist/HotspotChecklist'
import animateTransition from '../../../utils/animateTransition'
import HeliumSelect from '../../../components/HeliumSelect'
import { HeliumSelectItemType } from '../../../components/HeliumSelectItem'
import HotspotStatusBanner from './HotspotStatusBanner'
import useToggle from '../../../utils/useToggle'
import { getSyncStatus } from '../../../utils/hotspotUtils'
import ShareHotspot from '../../../components/ShareHotspot'

const HotspotDetails = ({
  hotspot,
  onLayoutHeader,
}: {
  hotspot?: Hotspot
  onLayoutHeader?: ((event: LayoutChangeEvent) => void) | undefined
}) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const {
    hotspot: hotspotDetailsHotspot,
    numDays,
    rewards,
    rewardSum,
    rewardsChange,
    loading,
    witnessSums,
    witnessAverage,
    witnessChange,
    challengeSums,
    challengeSum,
    challengeChange,
    witnesses,
  } = useSelector((state: RootState) => state.hotspotDetails)
  const blockHeight = useSelector(
    (state: RootState) => state.heliumData.blockHeight,
  )

  const [showStatusBanner, toggleShowStatusBanner] = useToggle(false)

  const rewardChartData = useMemo(() => {
    const data = getRewardChartData(rewards, numDays)
    return data || []
  }, [numDays, rewards])

  const [timelineValue, setTimelineValue] = useState(14)

  const syncStatus = useMemo(() => {
    if (!hotspot?.status) return

    return getSyncStatus(hotspot.status?.height, blockHeight)
  }, [blockHeight, hotspot])

  useEffect(() => {
    if (!hotspot) return

    dispatch(
      fetchHotspotDetails({ address: hotspot.address, numDays: timelineValue }),
    )
  }, [dispatch, hotspot, timelineValue])

  const witnessChartData = useMemo(() => {
    return (
      witnessSums?.map((w) => ({
        up: Math.round(w.avg),
        down: 0,
        label: w.timestamp,
        showTime: numDays === 1,
        id: `witness-${numDays}-${w.timestamp}`,
      })) || []
    )
  }, [numDays, witnessSums])

  const challengeChartData = useMemo(() => {
    return (
      challengeSums?.map((w) => ({
        up: Math.round(w.sum),
        down: 0,
        label: w.timestamp,
        showTime: numDays === 1,
        id: `challenge-${numDays}-${w.timestamp}`,
      })) || []
    )
  }, [numDays, challengeSums])

  const formattedHotspotName = useMemo(() => {
    if (!hotspot) return ''

    const name = animalName(hotspot.address)
    const pieces = name.split(' ')
    if (pieces.length < 3) return name

    return [`${pieces[0]} ${pieces[1]}`, pieces[2]]
  }, [hotspot])

  const selectData = useMemo(() => {
    return [
      {
        label: t('hotspot_details.overview'),
        value: 'overview',
        color: 'purpleMain',
      } as HeliumSelectItemType,
      {
        label: t('hotspot_details.checklist'),
        value: 'checklist',
        color: 'purpleMain',
      } as HeliumSelectItemType,
    ]
  }, [t])

  const [selectedOption, setSelectedOption] = useState(selectData[0].value)

  const handleSelectValueChanged = useCallback(
    (value: string | number, _index: number) => {
      animateTransition()
      setSelectedOption(value)
    },
    [],
  )

  if (!hotspot) return null

  return (
    <BottomSheetScrollView keyboardShouldPersistTaps="always">
      <Box paddingBottom="l">
        <Box onLayout={onLayoutHeader}>
          <Box
            marginBottom="lm"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text
              variant="regular"
              fontSize={29}
              lineHeight={31}
              color="black"
              textAlign="center"
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {formattedHotspotName[0]}
            </Text>
            <Box flexDirection="row" alignItems="center">
              <Box width={40} />
              <Text
                variant="regular"
                fontSize={29}
                lineHeight={31}
                color="black"
                textAlign="center"
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {formattedHotspotName[1]}
              </Text>

              <ShareHotspot hotspot={hotspot} />
            </Box>
          </Box>
          <Box
            flexDirection="row"
            justifyContent="center"
            marginBottom="lx"
            height={30}
          >
            {(hotspot?.status || hotspotDetailsHotspot?.status) && (
              <StatusBadge
                online={
                  hotspot?.status?.online ||
                  hotspotDetailsHotspot?.status?.online
                }
                syncStatus={syncStatus?.status}
                onPress={toggleShowStatusBanner}
              />
            )}
            <HexBadge
              rewardScale={
                hotspot.rewardScale || hotspotDetailsHotspot?.rewardScale
              }
            />
          </Box>
        </Box>

        <HotspotStatusBanner
          hotspot={hotspot}
          marginBottom="l"
          visible={showStatusBanner}
          onDismiss={toggleShowStatusBanner}
        />

        <Box width="100%" justifyContent="center" flexDirection="row">
          <HeliumSelect
            showGradient={false}
            marginTop="m"
            data={selectData}
            selectedValue={selectedOption}
            onValueChanged={handleSelectValueChanged}
          />
        </Box>
        <HotspotChecklist
          marginTop="lx"
          visible={selectedOption === 'checklist'}
          hotspot={hotspot}
          witnesses={witnesses}
        />

        {selectedOption === 'overview' && (
          <>
            <TimelinePicker index={2} onTimelineChanged={setTimelineValue} />
            <HotspotDetailChart
              title={t('hotspot_details.reward_title')}
              number={rewardSum?.total.toFixed(2)}
              change={rewardsChange}
              data={rewardChartData}
              loading={loading}
            />
            <HotspotDetailChart
              title={t('hotspot_details.witness_title')}
              number={witnessAverage?.toFixed(0)}
              change={witnessChange}
              data={witnessChartData}
              loading={loading}
            />
            <HotspotDetailChart
              title={t('hotspot_details.challenge_title')}
              number={challengeSum?.toFixed(0)}
              change={challengeChange}
              data={challengeChartData}
              loading={loading}
            />
          </>
        )}
      </Box>
    </BottomSheetScrollView>
  )
}

export default HotspotDetails
