import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import animalName from 'angry-purple-tiger'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { random, times } from 'lodash'
import { Hotspot } from '@helium/http'
import { Linking } from 'react-native'
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
import hotspotDetailsSlice, {
  fetchHotspotRewards,
  fetchHotspotWitnesses,
  fetchHotspotWitnessSums,
} from '../../../store/hotspotDetails/hotspotDetailsSlice'
import HotspotSettingsProvider from '../settings/HotspotSettingsProvider'
import HotspotSettings from '../settings/HotspotSettings'
import TouchableOpacityBox from '../../../components/BSTouchableOpacityBox'
import HexBadge from './HexBadge'
import HotspotMoreMenuButton from './HotspotMoreMenuButton'
import Button from '../../../components/Button'

const shortAddress = (address?: string) => `${address?.slice(0, 5)}...`

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
    account: { account },
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

  const [timelineValue, setTimelineValue] = useState(14)

  useEffect(() => {
    if (!hotspot) return

    dispatch(
      fetchHotspotRewards({ address: hotspot.address, numDays: timelineValue }),
    )
    dispatch(fetchHotspotWitnesses(hotspot.address))
    dispatch(
      fetchHotspotWitnessSums({
        address: hotspot.address,
        numDays: timelineValue,
      }),
    )
  }, [dispatch, hotspot, timelineValue])

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

  const openExplorerOwner = useCallback(() => {
    if (!hotspot) return
    Linking.openURL(`https://explorer.helium.com/accounts/${hotspot.owner}`)
  }, [hotspot])

  const handleToggleSettings = useCallback(() => {
    dispatch(hotspotDetailsSlice.actions.toggleShowSettings())
  }, [dispatch])

  if (!hotspot) {
    return null
  }

  return (
    <BottomSheetScrollView>
      <Box paddingHorizontal="l" paddingBottom="l">
        <Box
          marginBottom="m"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Text variant="h2" color="black">
            {animalName(hotspot.address)}
          </Text>

          <HotspotMoreMenuButton hotspot={hotspot} />
        </Box>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="xl"
        >
          <Box flexDirection="row">
            <StatusBadge online={hotspot.status?.online} />
            <HexBadge rewardScale={hotspot.rewardScale} />
          </Box>
          <TouchableOpacityBox onPress={openExplorerOwner}>
            <Text color="grayLightText">
              {hotspot.owner === account?.address
                ? t('hotspot_details.owner_you')
                : t('hotspot_details.owner', {
                    address: shortAddress(hotspot.owner),
                  })}
            </Text>
          </TouchableOpacityBox>
        </Box>
        <TimelinePicker index={2} onTimelineChanged={setTimelineValue} />
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

        <Box marginTop="m">
          <Button
            mode="contained"
            variant="primary"
            title="Settings"
            onPress={handleToggleSettings}
          />
        </Box>
      </Box>
      <HotspotSettingsProvider>
        <HotspotSettings hotspot={hotspot} />
      </HotspotSettingsProvider>
    </BottomSheetScrollView>
  )
}

export default HotspotDetails
