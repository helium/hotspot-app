import React, { useEffect, useMemo, useState } from 'react'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import animalName from 'angry-purple-tiger'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { random, times } from 'lodash'
import { Hotspot } from '@helium/http'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import StatusBadge from './StatusBadge'
import TimelinePicker from './TimelinePicker'
import HotspotDetailChart from './HotspotDetailChart'
import { RootState } from '../../../store/rootReducer'
import { useColors } from '../../../theme/themeHooks'
import { getRewardChartData } from './RewardsHelper'
import { ChartData } from '../../../components/BarChart/types'
import { useAppDispatch } from '../../../store/store'
import {
  fetchHotspotRewards,
  fetchHotspotWitnesses,
  fetchHotspotWitnessSums,
} from '../../../store/hotspotDetails/hotspotDetailsSlice'
import HotspotSettingsProvider from '../settings/HotspotSettingsProvider'
import HotspotSettings from '../settings/HotspotSettings'

const shortAddress = (address?: string) =>
  `${address?.slice(0, 5)}...${address?.slice(
    address?.length - 5,
    address?.length,
  )}`

const data: Record<string, ChartData[]> = {
  1: times(14).map((v, i) => ({
    up: random(0, 100),
    down: 0,
    day: '',
    id: [1, i].join('-'),
  })),
  2: times(14).map((v, i) => ({
    up: random(0, 100),
    down: 0,
    day: '',
    id: [2, i].join('-'),
  })),
}

const formatDate = (timestamp: string, numDays?: number) => {
  let options
  if (numDays === 1) {
    options = {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
    }
  } else {
    options = {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }
  }
  return new Date(timestamp).toLocaleDateString(undefined, options)
}

const HotspotDetails = ({ hotspot }: { hotspot?: Hotspot }) => {
  const { t } = useTranslation()
  const colors = useColors()
  const dispatch = useAppDispatch()

  const {
    hotspotDetails: {
      numDays,
      rewards,
      rewardSum,
      rewardsChange,
      loadingRewards,
      loadingWitnessSums,
      witnessSums,
      witnessAverage,
      witnessChange,
    },
  } = useSelector((state: RootState) => state)

  const [timelineIndex, setTimelineIndex] = useState(2)
  const onTimelineChanged = (_value: string, index: number) => {
    setTimelineIndex(index)
  }

  useEffect(() => {
    if (!hotspot) return

    let days
    switch (timelineIndex) {
      default:
      case 0:
        days = 1
        break
      case 1:
        days = 7
        break
      case 2:
        days = 14
        break
      case 3:
        days = 30
        break
    }
    dispatch(fetchHotspotRewards({ address: hotspot.address, numDays: days }))
    dispatch(fetchHotspotWitnesses(hotspot.address))
    dispatch(
      fetchHotspotWitnessSums({
        address: hotspot.address,
        numDays: days,
      }),
    )
  }, [dispatch, hotspot, timelineIndex])

  const chartData = useMemo(() => {
    return (
      witnessSums?.map((w) => ({
        up: Math.round(w.avg),
        down: 0,
        day: formatDate(w.timestamp, numDays),
        id: `witness-${numDays}-${w.timestamp}`,
      })) || []
    )
  }, [witnessSums, numDays])

  if (!hotspot) {
    return null
  }

  return (
    <BottomSheetScrollView>
      <Box paddingHorizontal="l" paddingBottom="l">
        <Box marginBottom="m">
          <Text variant="h2" color="black">
            {animalName(hotspot.address)}
          </Text>
        </Box>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="xl"
        >
          <StatusBadge online={hotspot.status?.online} />
          <Text color="grayLightText">
            {t('hotspot_details.owner', {
              address: shortAddress(hotspot.owner),
            })}
          </Text>
        </Box>
        <TimelinePicker
          index={timelineIndex}
          onTimelineChanged={onTimelineChanged}
        />
        <HotspotDetailChart
          title={t('hotspot_details.reward_title')}
          number={rewardSum?.total.toFixed(2)}
          change={rewardsChange}
          color={colors.greenOnline}
          data={getRewardChartData(rewards, numDays)}
          loading={loadingRewards}
        />
        <HotspotDetailChart
          title={t('hotspot_details.witness_title')}
          number={witnessAverage?.toFixed(0)}
          change={witnessChange}
          color={colors.purpleMain}
          data={chartData}
          loading={loadingWitnessSums}
        />
        <HotspotDetailChart
          title={t('hotspot_details.challenge_title')}
          percentage={78}
          color={colors.purpleMain}
          data={data[2]}
        />
      </Box>
      <HotspotSettingsProvider>
        <HotspotSettings />
      </HotspotSettingsProvider>
    </BottomSheetScrollView>
  )
}

export default HotspotDetails
