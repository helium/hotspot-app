import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import animalName from 'angry-purple-tiger'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { LayoutChangeEvent, Alert, Linking } from 'react-native'
import { Hotspot } from '@helium/http'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import StatusBadge from './StatusBadge'
import TimelinePicker from './TimelinePicker'
import HotspotDetailChart from './HotspotDetailChart'
import { RootState } from '../../../store/rootReducer'
import { getRewardChartData } from './RewardsHelper'
import { useAppDispatch } from '../../../store/store'
import {
  fetchHotspotChartData,
  fetchHotspotData,
} from '../../../store/hotspotDetails/hotspotDetailsSlice'
import HexBadge from './HexBadge'
import HotspotChecklist from '../checklist/HotspotChecklist'
import animateTransition from '../../../utils/animateTransition'
import HeliumSelect from '../../../components/HeliumSelect'
import { HeliumSelectItemType } from '../../../components/HeliumSelectItem'
import HotspotStatusBanner from './HotspotStatusBanner'
import useToggle from '../../../utils/useToggle'
import { getSyncStatus, isRelay } from '../../../utils/hotspotUtils'
import ShareHotspot from '../../../components/ShareHotspot'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import Articles from '../../../constants/articles'
import HotspotListItem from '../../../components/HotspotListItem'
import { distance } from '../../../utils/location'

type Props = {
  hotspotAddress?: string
  hotspot?: Hotspot
  onLayoutHeader?: ((event: LayoutChangeEvent) => void) | undefined
  onFailure: () => void
  onSelectHotspot: (hotspot: Hotspot) => void
}
const HotspotDetails = ({
  hotspot: propsHotspot,
  hotspotAddress,
  onLayoutHeader,
  onSelectHotspot,
  onFailure,
}: Props) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const address = hotspotAddress || propsHotspot?.address || ''
  const hotspotChatData =
    useSelector(
      (state: RootState) => state.hotspotDetails.chartData[address],
    ) || {}
  const hotspotDetailsData =
    useSelector(
      (state: RootState) => state.hotspotDetails.hotspotData[address],
    ) || {}
  const blockHeight = useSelector(
    (state: RootState) => state.heliumData.blockHeight,
  )
  const [isRelayed, setIsRelayed] = useState(false)
  const [timelineValue, setTimelineValue] = useState(14)
  const {
    rewards,
    rewardSum,
    rewardsChange,
    loading = true,
    witnessSums,
    witnessAverage,
    witnessChange,
    challengeSums,
    challengeSum,
    challengeChange,
  } = hotspotChatData[timelineValue] || {}
  const { hotspot: hotspotDetailsHotspot, witnesses } = hotspotDetailsData || {}
  const [showStatusBanner, toggleShowStatusBanner] = useToggle(false)

  const hotspot = useMemo(() => hotspotDetailsHotspot || propsHotspot, [
    hotspotDetailsHotspot,
    propsHotspot,
  ])

  useEffect(() => {
    setIsRelayed(isRelay(hotspot?.status?.listenAddrs || []))
  }, [hotspot])

  const rewardChartData = useMemo(() => {
    const data = getRewardChartData(rewards, timelineValue)
    return data || []
  }, [timelineValue, rewards])

  const syncStatus = useMemo(() => {
    if (!hotspot?.status) return

    return getSyncStatus(hotspot.status?.height, blockHeight)
  }, [blockHeight, hotspot])

  useEffect(() => {
    if (hotspotDetailsData.loading === false && !hotspotDetailsData.hotspot) {
      // hotspot couldn't be found - likely a bad app link or qr scan
      onFailure()
    }
  }, [hotspotDetailsData.hotspot, hotspotDetailsData.loading, onFailure])

  // load hotspot & witness details
  useEffect(() => {
    if (!address) return

    dispatch(fetchHotspotData(address))
  }, [address, dispatch])

  // load chart data
  useEffect(() => {
    if (!hotspot?.address) return

    dispatch(
      fetchHotspotChartData({
        address: hotspot?.address,
        numDays: timelineValue,
      }),
    )
  }, [dispatch, hotspot?.address, timelineValue])

  const witnessChartData = useMemo(() => {
    return (
      witnessSums?.map((w) => ({
        up: Math.round(w.avg),
        down: 0,
        label: w.timestamp,
        showTime: timelineValue === 1,
        id: `witness-${timelineValue}-${w.timestamp}`,
      })) || []
    )
  }, [timelineValue, witnessSums])

  const challengeChartData = useMemo(() => {
    return (
      challengeSums?.map((w) => ({
        up: Math.round(w.sum),
        down: 0,
        label: w.timestamp,
        showTime: timelineValue === 1,
        id: `challenge-${timelineValue}-${w.timestamp}`,
      })) || []
    )
  }, [timelineValue, challengeSums])

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
      {
        label: t('map_filter.witness.title'),
        value: 'witnesses',
        color: 'purpleMain',
      } as HeliumSelectItemType,
    ]
  }, [t])

  const [selectedOption, setSelectedOption] = useState(selectData[0].value)

  const handleSelectValueChanged = useCallback(
    (value: string | number, _index: number) => {
      animateTransition('HotspotDetails.HandleSelectValueChanged')
      setSelectedOption(value)
    },
    [],
  )

  const handleRelayedPress = useCallback(() => {
    Alert.alert(
      t('hotspot_details.relay_prompt.title'),
      t('hotspot_details.relay_prompt.message'),
      [
        {
          text: t('generic.ok'),
        },
        {
          text: t('discovery.troubleshooting_guide'),
          style: 'cancel',
          onPress: () => {
            if (Linking.canOpenURL(Articles.Relay))
              Linking.openURL(Articles.Relay)
          },
        },
      ],
    )
  }, [t])

  const getDistance = useCallback(
    (otherHotspot: Hotspot) => {
      if (
        !hotspot?.lat ||
        !hotspot?.lng ||
        !otherHotspot?.lat ||
        !otherHotspot?.lng
      )
        return undefined
      const distanceKM = distance(
        {
          latitude: hotspot?.lat,
          longitude: hotspot?.lng,
        },
        { latitude: otherHotspot?.lat, longitude: otherHotspot?.lng },
      )
      if (distanceKM < 1) {
        return `${(distanceKM * 1000).toFixed(0)}m`
      }
      return `${distanceKM.toFixed(1)}km`
    },
    [hotspot?.lat, hotspot?.lng],
  )

  const renderWitnessItem = useCallback(
    (witness: Hotspot) => {
      return (
        <HotspotListItem
          key={witness.address}
          onPress={onSelectHotspot}
          hotspot={witness}
          showCarot
          showAddress={false}
          distanceAway={getDistance(witness)}
          showRewardScale
          showRelayStatus
        />
      )
    },
    [getDistance, onSelectHotspot],
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
            {hotspot?.status && (
              <StatusBadge
                online={hotspot?.status?.online}
                syncStatus={syncStatus?.status}
                onPress={toggleShowStatusBanner}
              />
            )}
            <HexBadge
              rewardScale={hotspot.rewardScale}
              backgroundColor="grayBox"
            />
            {isRelayed && (
              <TouchableOpacityBox
                backgroundColor="yellow"
                paddingHorizontal="s"
                borderRadius="ms"
                alignItems="center"
                justifyContent="center"
                marginLeft="xs"
                onPress={handleRelayedPress}
              >
                <Text color="white" variant="regular" fontSize={13}>
                  {t('hotspot_details.relayed')}
                </Text>
              </TouchableOpacityBox>
            )}
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

        {selectedOption === 'witnesses' && (
          <>
            <Box backgroundColor="grayBox" marginBottom="xxs" marginTop="m">
              <Text variant="body1Medium" color="grayDarkText" padding="m">
                {t('hotspot_details.num_witnesses', {
                  count: witnesses?.length || 0,
                })}
              </Text>
            </Box>
            {witnesses?.map((witness) => renderWitnessItem(witness))}
          </>
        )}
      </Box>
    </BottomSheetScrollView>
  )
}

export default HotspotDetails
