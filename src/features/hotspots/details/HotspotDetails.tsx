import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import animalName from 'angry-purple-tiger'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
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
import { useAppDispatch } from '../../../store/store'
import hotspotDetailsSlice, {
  fetchHotspotDetails,
} from '../../../store/hotspotDetails/hotspotDetailsSlice'
import HotspotSettingsProvider from '../settings/HotspotSettingsProvider'
import HotspotSettings from '../settings/HotspotSettings'
import TouchableOpacityBox from '../../../components/BSTouchableOpacityBox'
import HexBadge from './HexBadge'
import HotspotMoreMenuButton from './HotspotMoreMenuButton'
import Button from '../../../components/Button'
import HotspotChecklist from '../checklist/HotspotChecklist'

const shortAddress = (address?: string) => `${address?.slice(0, 5)}...`

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
      loading,
      witnessSums,
      witnessAverage,
      witnessChange,
      challengeSums,
      challengeSum,
      challengeChange,
      witnesses,
    },
  } = useSelector((state: RootState) => state)

  const [timelineValue, setTimelineValue] = useState(14)

  useEffect(() => {
    if (!hotspot) return

    dispatch(
      fetchHotspotDetails({ address: hotspot.address, numDays: timelineValue }),
    )
  }, [dispatch, hotspot, timelineValue])

  const openExplorerOwner = useCallback(() => {
    if (!hotspot) return
    Linking.openURL(`https://explorer.helium.com/accounts/${hotspot.owner}`)
  }, [hotspot])

  const handleToggleSettings = useCallback(() => {
    dispatch(hotspotDetailsSlice.actions.toggleShowSettings())
  }, [dispatch])

  const witnessChartData = useMemo(() => {
    let options: Intl.DateTimeFormatOptions
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
    return (
      witnessSums?.map((w) => ({
        up: Math.round(w.avg),
        down: 0,
        day: new Date(w.timestamp).toLocaleDateString(undefined, options),
        id: `witness-${numDays}-${w.timestamp}`,
      })) || []
    )
  }, [numDays, witnessSums])

  const challengeChartData = useMemo(() => {
    let options: Intl.DateTimeFormatOptions
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
    return (
      challengeSums?.map((w) => ({
        up: Math.round(w.sum),
        down: 0,
        day: new Date(w.timestamp).toLocaleDateString(undefined, options),
        id: `challenge-${numDays}-${w.timestamp}`,
      })) || []
    )
  }, [numDays, challengeSums])

  if (!hotspot) return null

  return (
    <BottomSheetScrollView>
      <Box paddingBottom="l">
        <Box
          marginBottom="m"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          paddingHorizontal="l"
        >
          <Text
            variant="h2"
            color="black"
            numberOfLines={1}
            adjustsFontSizeToFit
            flex={1}
          >
            {animalName(hotspot.address)}
          </Text>

          <HotspotMoreMenuButton hotspot={hotspot} />
        </Box>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="xl"
          paddingHorizontal="l"
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
        <HotspotChecklist hotspot={hotspot} witnesses={witnesses} />
        <TimelinePicker index={2} onTimelineChanged={setTimelineValue} />
        <HotspotDetailChart
          title={t('hotspot_details.reward_title')}
          number={rewardSum?.total.toFixed(2)}
          change={rewardsChange}
          color={colors.greenOnline}
          data={getRewardChartData(rewards, numDays)}
          loading={loading}
        />
        <HotspotDetailChart
          title={t('hotspot_details.witness_title')}
          number={witnessAverage?.toFixed(0)}
          change={witnessChange}
          color={colors.purpleMain}
          data={witnessChartData}
          loading={loading}
        />
        <HotspotDetailChart
          title={t('hotspot_details.challenge_title')}
          subTitle={t('hotspot_details.challenge_sub_title')}
          number={challengeSum?.toFixed(0)}
          change={challengeChange}
          color={colors.purpleMain}
          data={challengeChartData}
          loading={loading}
        />

        <Box marginTop="m" paddingHorizontal="l">
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
