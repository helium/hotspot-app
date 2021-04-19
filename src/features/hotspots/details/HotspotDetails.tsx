import React, { useEffect, useMemo, useState } from 'react'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import animalName from 'angry-purple-tiger'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Hotspot } from '@helium/http'
import { Linking, Share, StyleSheet } from 'react-native'
import { useActionSheet } from '@expo/react-native-action-sheet'
import Clipboard from '@react-native-community/clipboard'
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
import ShareDots from '../../../assets/images/share-dots.svg'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import { EXPLORER_BASE_URL } from '../../../utils/config'
import useHaptic from '../../../utils/useHaptic'

const HotspotDetails = ({ hotspot }: { hotspot?: Hotspot }) => {
  const { t } = useTranslation()
  const { showActionSheetWithOptions } = useActionSheet()
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
  } = useSelector((state: RootState) => state.hotspotDetails)

  const { triggerNotification } = useHaptic()

  const rewardChartData = useMemo(() => {
    const data = getRewardChartData(rewards, numDays)
    return data || []
  }, [numDays, rewards])

  const [timelineValue, setTimelineValue] = useState(14)

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

  type SettingsOption = { label: string; action?: () => void }

  const onMoreSelected = () => {
    if (!hotspot) return

    const explorerUrl = `${EXPLORER_BASE_URL}/hotspots/${hotspot.address}`
    const opts: SettingsOption[] = [
      {
        label: t('hotspot_details.options.viewExplorer'),
        action: () => Linking.openURL(explorerUrl),
      },
      {
        label: t('hotspot_details.options.share'),
        action: () => Share.share({ message: explorerUrl }),
      },
      {
        label: `${t('generic.copy')} ${t('generic.address')}`,
        action: () => {
          Clipboard.setString(hotspot.address)
          triggerNotification('success')
        },
      },
      {
        label: t('generic.cancel'),
      },
    ]

    showActionSheetWithOptions(
      {
        options: opts.map(({ label }) => label),
        destructiveButtonIndex: opts.length - 1,
      },
      (buttonIndex) => {
        opts[buttonIndex].action?.()
      },
    )
  }

  if (!hotspot) return null

  return (
    <BottomSheetScrollView keyboardShouldPersistTaps="always">
      <Box paddingBottom="l">
        <Box
          marginTop="lm"
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
            <TouchableOpacityBox
              width={40}
              height={31}
              alignItems="center"
              onPress={onMoreSelected}
              justifyContent="center"
              style={styles.shareButton}
            >
              <ShareDots color="#C2C5E4" />
            </TouchableOpacityBox>
          </Box>
        </Box>
        <Box flexDirection="row" justifyContent="center" marginBottom="lx">
          <Box flexDirection="row">
            {hotspot?.status || hotspotDetailsHotspot?.status ? (
              <StatusBadge
                online={
                  hotspot?.status?.online ||
                  hotspotDetailsHotspot?.status?.online
                }
              />
            ) : null}
            <HexBadge
              rewardScale={
                hotspot.rewardScale || hotspotDetailsHotspot?.rewardScale
              }
            />
          </Box>
        </Box>
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
      </Box>
    </BottomSheetScrollView>
  )
}

const styles = StyleSheet.create({
  shareButton: { transform: [{ rotate: '90deg' }] },
})

export default HotspotDetails
