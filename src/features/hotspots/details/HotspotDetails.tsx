import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import animalName from 'angry-purple-tiger'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import {
  LayoutChangeEvent,
  Alert,
  Linking,
  ActivityIndicator,
  Insets,
} from 'react-native'
import { Hotspot, Witness } from '@helium/http'
import Animated from 'react-native-reanimated'
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
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import Articles from '../../../constants/articles'
import HotspotListItem from '../../../components/HotspotListItem'
import Info from '../../../assets/images/info-hollow.svg'
import Location from '../../../assets/images/location.svg'
import Signal from '../../../assets/images/signal.svg'
import { distance } from '../../../utils/location'
import { useColors, useSpacing } from '../../../theme/themeHooks'
import TouchableHighlightBox from '../../../components/TouchableHighlightBox'
import HotspotSheetHandle from '../root/HotspotSheetHandle'
import { hp } from '../../../utils/layout'
import sleep from '../../../utils/sleep'

const hitSlop = { top: 24, bottom: 24 } as Insets

export type HotspotSnapPoints = { collapsed: number; expanded: number }
type Props = {
  hotspot?: Hotspot | Witness
  onLayoutSnapPoints?: ((snapPoints: HotspotSnapPoints) => void) | undefined
  onFailure: () => void
  onSelectHotspot: (hotspot: Hotspot | Witness) => void
  onChangeHeight: (height: number) => void
  visible: boolean
  toggleSettings: () => void
  animatedPosition: Animated.SharedValue<number>
}
const HotspotDetails = ({
  hotspot: propsHotspot,
  onLayoutSnapPoints,
  onSelectHotspot,
  onFailure,
  visible,
  toggleSettings,
  animatedPosition,
  onChangeHeight,
}: Props) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const colors = useColors()
  const spacing = useSpacing()
  const address = propsHotspot?.address || ''
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
  const listRef = useRef<BottomSheet>(null)
  const [isRelayed, setIsRelayed] = useState(false)
  const [timelineValue, setTimelineValue] = useState(14)
  const [snapPoints, setSnapPoints] = useState([0, 0])
  const [listIndex, setListIndex] = useState(0)

  const {
    rewards,
    rewardSum,
    rewardsChange,
    loading = true,
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
    if (!visible) return

    setIsRelayed(isRelay(hotspot?.status?.listenAddrs || []))
  }, [hotspot, visible])

  const rewardChartData = useMemo(() => {
    if (!visible) return []

    const data = getRewardChartData(rewards, timelineValue)
    return data || []
  }, [timelineValue, rewards, visible])

  const syncStatus = useMemo(() => {
    if (!hotspot?.status) return

    return getSyncStatus(hotspot.status?.height, blockHeight)
  }, [blockHeight, hotspot])

  useEffect(() => {
    if (!visible) return
    if (hotspotDetailsData.loading === false && !hotspotDetailsData.hotspot) {
      // hotspot couldn't be found - likely a bad app link or qr scan
      onFailure()
    }
  }, [
    visible,
    hotspotDetailsData.hotspot,
    hotspotDetailsData.loading,
    onFailure,
  ])

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
      animateTransition('HotspotDetails.HandleSelectValueChanged', {
        enabledOnAndroid: false,
      })
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
    (otherHotspot: Hotspot | Witness) => {
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
        return t('generic.meters', { distance: (distanceKM * 1000).toFixed(0) })
      }
      return t('generic.kilometers', { distance: distanceKM.toFixed(1) })
    },
    [hotspot?.lat, hotspot?.lng, t],
  )

  const renderWitnessItem = useCallback(
    (witness: Witness) => {
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

  const showWitnessAlert = useCallback(() => {
    Alert.alert(
      t('hotspot_details.witness_prompt.title'),
      t('hotspot_details.witness_prompt.message', {
        hotspotName: animalName(hotspot?.address || ''),
      }),
      [
        {
          text: t('generic.ok'),
        },
        {
          text: t('generic.readMore'),
          style: 'cancel',
          onPress: () => {
            if (Linking.canOpenURL(Articles.Witnesses))
              Linking.openURL(Articles.Witnesses)
          },
        },
      ],
    )
  }, [hotspot?.address, t])

  const cardHandle = useCallback(() => {
    return (
      <HotspotSheetHandle hotspot={hotspot} toggleSettings={toggleSettings} />
    )
  }, [hotspot, toggleSettings])

  const handleHeaderLayout = (event: LayoutChangeEvent) => {
    const nextSnapPoints = [event.nativeEvent.layout.height, hp(55)]
    onLayoutSnapPoints?.({
      collapsed: nextSnapPoints[0],
      expanded: nextSnapPoints[1],
    })
    setSnapPoints(nextSnapPoints)
  }

  const handleChange = useCallback(
    (index: number) => {
      setListIndex(index)
      onChangeHeight(snapPoints[index])
    },
    [onChangeHeight, snapPoints],
  )

  const handleToggleStatus = useCallback(async () => {
    if (listIndex === 0) {
      listRef.current?.snapTo(1)
      if (showStatusBanner) {
        return // banner is already showing, but was out of sight
      }
    }
    if (listIndex === 0) {
      await sleep(300) // Add a little delay to avoid animation jank
    }
    toggleShowStatusBanner()
  }, [listIndex, showStatusBanner, toggleShowStatusBanner])

  const contentContainerStyle = useMemo(() => ({ paddingLeft: spacing.m }), [
    spacing.m,
  ])

  if (!hotspot) return null

  return (
    <BottomSheet
      snapPoints={snapPoints}
      ref={listRef}
      index={0}
      onChange={handleChange}
      handleComponent={cardHandle}
      animatedIndex={animatedPosition}
    >
      <BottomSheetScrollView keyboardShouldPersistTaps="always">
        <Box paddingBottom="l">
          <Box onLayout={handleHeaderLayout}>
            <Box marginBottom="lm" alignItems="flex-start" marginHorizontal="m">
              <Text
                variant="light"
                fontSize={29}
                lineHeight={31}
                color="black"
                numberOfLines={1}
                width="100%"
                adjustsFontSizeToFit
              >
                {formattedHotspotName[0]}
              </Text>
              <Box flexDirection="row" alignItems="flex-start">
                <Text
                  variant="regular"
                  fontSize={29}
                  lineHeight={31}
                  width="100%"
                  color="black"
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {formattedHotspotName[1]}
                </Text>
              </Box>
            </Box>
            <Box
              flexDirection="row"
              justifyContent="flex-start"
              alignItems="center"
              marginBottom="m"
              marginLeft="m"
            >
              <Location width={10} height={10} color={colors.grayText} />
              <Text
                variant="body2"
                color="grayText"
                marginLeft="xs"
                marginRight="m"
              >
                {`${hotspot?.geocode?.longCity}, ${hotspot?.geocode?.shortCountry}`}
              </Text>
              <Signal width={10} height={10} color={colors.grayText} />
              <Text variant="body2" color="grayText" marginLeft="xs">
                {t('generic.meters', { distance: hotspot?.elevation || 0 })}
              </Text>
              {hotspot?.gain !== undefined && (
                <Text variant="body2" color="grayText" marginLeft="xs">
                  {(hotspot.gain / 10).toFixed(1) +
                    t('antennas.onboarding.dbi')}
                </Text>
              )}
            </Box>
            <Box
              flexDirection="row"
              justifyContent="flex-start"
              marginBottom="lx"
              marginLeft="m"
              height={24}
            >
              {hotspot?.status && (
                <StatusBadge
                  hitSlop={hitSlop}
                  online={hotspot?.status?.online}
                  syncStatus={syncStatus?.status}
                  onPress={handleToggleStatus}
                />
              )}
              {isRelayed && (
                <TouchableOpacityBox
                  hitSlop={hitSlop}
                  borderColor="orangeMedium"
                  borderWidth={1}
                  paddingHorizontal="s"
                  borderRadius="l"
                  alignItems="center"
                  justifyContent="center"
                  marginLeft="xs"
                  onPress={handleRelayedPress}
                >
                  <Text color="orangeMedium" variant="medium" fontSize={14}>
                    {t('hotspot_details.relayed')}
                  </Text>
                </TouchableOpacityBox>
              )}
              <HexBadge
                hitSlop={hitSlop}
                rewardScale={hotspot.rewardScale}
                backgroundColor="grayBox"
              />
            </Box>
          </Box>

          <HotspotStatusBanner
            hotspot={hotspot}
            marginBottom="l"
            visible={showStatusBanner}
            onDismiss={toggleShowStatusBanner}
          />

          <Box
            justifyContent="flex-start"
            flexDirection="row"
            backgroundColor="grayBox"
          >
            <HeliumSelect
              showGradient={false}
              marginTop="m"
              contentContainerStyle={contentContainerStyle}
              data={selectData}
              backgroundColor="grayBox"
              selectedValue={selectedOption}
              onValueChanged={handleSelectValueChanged}
            />
          </Box>
          <HotspotChecklist
            paddingTop="lx"
            backgroundColor="grayBox"
            visible={selectedOption === 'checklist'}
            hotspot={hotspot}
            witnesses={witnesses}
          />

          {selectedOption === 'overview' && (
            <Box backgroundColor="grayBox">
              <TimelinePicker index={2} onTimelineChanged={setTimelineValue} />
              <HotspotDetailChart
                title={t('hotspot_details.reward_title')}
                number={rewardSum?.total.toFixed(2)}
                change={rewardsChange}
                data={rewardChartData}
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
          )}

          {selectedOption === 'witnesses' && (
            <>
              {hotspotDetailsData.loading ? (
                <Box paddingTop="xl" backgroundColor="grayBox" height="100%">
                  <ActivityIndicator color={colors.grayMain} />
                </Box>
              ) : (
                <>
                  <TouchableHighlightBox
                    alignItems="center"
                    backgroundColor="grayBox"
                    marginBottom="xxs"
                    paddingTop="m"
                    flexDirection="row"
                    underlayColor={colors.grayHighlight}
                    onPress={showWitnessAlert}
                  >
                    <>
                      <Text
                        variant="body1Medium"
                        color="grayDarkText"
                        paddingLeft="m"
                        paddingRight="s"
                        paddingVertical="m"
                      >
                        {t('hotspot_details.num_witnesses', {
                          count: witnesses?.length || 0,
                        })}
                      </Text>
                      <Info color={colors.blueMain} />
                    </>
                  </TouchableHighlightBox>
                  {witnesses?.map((witness) => renderWitnessItem(witness))}
                </>
              )}
            </>
          )}
        </Box>
      </BottomSheetScrollView>
    </BottomSheet>
  )
}

export default HotspotDetails
