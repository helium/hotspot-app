import React, { useEffect, useState } from 'react'
import animalName from 'angry-purple-tiger'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated'
import BottomSheet from 'react-native-holy-sheet/src/index'
import { random, times } from 'lodash'
import { useTranslation } from 'react-i18next'
import { HotspotRewardSum } from '@helium/http'
import SafeAreaBox from '../../../components/SafeAreaBox'
import Text from '../../../components/Text'
import { HotspotStackParamList } from '../root/hotspotTypes'
import Box from '../../../components/Box'
import Map from '../../../components/Map'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import CarotLeft from '../../../assets/images/carot-left.svg'
import HexCircleButton from '../../../assets/images/hex-circle-button.svg'
import EyeCircleButton from '../../../assets/images/eye-circle-button.svg'
import { hp } from '../../../utils/layout'
import { hotspotsToFeatures } from '../../../utils/mapUtils'
import { ChartData } from '../../../components/BarChart/types'
import { useColors } from '../../../theme/themeHooks'
import HotspotDetailChart from './HotspotDetailChart'
import StatusBadge from './StatusBadge'
import TimelinePicker from './TimelinePicker'
import HotspotDetailCardHeader from './HotspotDetailCardHeader'
import { getHotspotRewardsSum } from '../../../utils/appDataClient'
import { calculatePercentChange, getRewardChartData } from './RewardsHelper'

type HotspotDetailsRouteProp = RouteProp<
  HotspotStackParamList,
  'HotspotDetails'
>

const shortAddress = (address?: string) =>
  `${address?.slice(0, 5)}...${address?.slice(
    address?.length - 5,
    address?.length,
  )}`

const onFollowHotspot = () => {
  // TODO: follow hotspot
}

const onMoreMenuSelected = () => {
  // TODO: more menu
}

const HotspotDetails = () => {
  const route = useRoute<HotspotDetailsRouteProp>()
  const { hotspot } = route.params
  const navigation = useNavigation()
  const { t } = useTranslation()
  const selectedHotspots = hotspotsToFeatures([hotspot])
  const { purpleMain, greenOnline } = useColors()

  const dragMid = hp(25)
  const dragMax = hp(75)
  const dragMin = 50
  const snapProgress = useSharedValue(dragMid / dragMax)

  const opacity = useDerivedValue(() => {
    return interpolate(
      snapProgress.value,
      [dragMid / dragMax, dragMin / dragMax],
      [1, 0],
      Extrapolate.CLAMP,
    )
  })

  const translateY = useDerivedValue(() => {
    return interpolate(
      snapProgress.value,
      [dragMid / dragMax, dragMin / dragMax],
      [0, dragMid - dragMin],
      Extrapolate.CLAMP,
    )
  })

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        {
          translateY: translateY.value,
        },
      ],
    }
  })

  const [timelineIndex, setTimelineIndex] = useState(2)
  const [totalRewards, setTotalRewards] = useState<HotspotRewardSum>()
  const [rewardChange, setRewardChange] = useState<number>()
  const [rewardChatData, setRewardChatData] = useState<ChartData[]>([])
  const [chartPadding, setChartPadding] = useState(20)
  useEffect(() => {
    const fetchRewards = async () => {
      let numDays
      let padding
      switch (timelineIndex) {
        default:
        case 0:
          numDays = 1
          padding = 20
          break
        case 1:
          numDays = 7
          padding = 10
          break
        case 2:
          numDays = 14
          padding = 5
          break
        case 3:
          numDays = 30
          padding = 0
          break
      }
      const rewardsSum = await getHotspotRewardsSum(hotspot.address, numDays)
      const previousStart = new Date()
      previousStart.setDate(previousStart.getDate() - numDays)
      const rewardsSumPastPeriod = await getHotspotRewardsSum(
        hotspot.address,
        numDays,
        previousStart,
      )
      setTotalRewards(rewardsSum)
      setRewardChange(
        calculatePercentChange(
          rewardsSum.total.floatBalance,
          rewardsSumPastPeriod.total.floatBalance,
        ),
      )
      const rewardChartData = await getRewardChartData(hotspot.address, numDays)
      setRewardChatData(rewardChartData)
      setChartPadding(padding)
    }
    fetchRewards()
  }, [hotspot.address, timelineIndex])

  const onTimelineChanged = (_value: string, index: number) => {
    setTimelineIndex(index)
  }

  return (
    <SafeAreaBox backgroundColor="primaryBackground" flex={1} edges={['top']}>
      <Box flex={1} flexDirection="column" justifyContent="space-between">
        <Box
          position="absolute"
          height="100%"
          width="100%"
          borderTopLeftRadius="xl"
          borderTopRightRadius="xl"
          style={{ marginTop: 70 }}
          overflow="hidden"
        >
          <Map
            zoomLevel={14}
            mapCenter={[hotspot.lng || 0, hotspot.lat || 0]}
            animationDuration={0}
            selectedHotspots={selectedHotspots}
            offsetCenterRatio={2}
          />
        </Box>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          backgroundColor="primaryBackground"
          padding="m"
        >
          <TouchableOpacityBox
            flexDirection="row"
            alignItems="center"
            onPress={() => navigation.goBack()}
          >
            <CarotLeft width={22} height={22} stroke="white" strokeWidth={2} />
            <Text variant="h3" marginStart="xs">
              {t('hotspot_details.title')}
            </Text>
          </TouchableOpacityBox>
        </Box>

        <Animated.View style={animatedStyles}>
          <Box
            padding="m"
            flexDirection="row"
            style={{ marginBottom: dragMid }}
          >
            <TouchableOpacityBox>
              <EyeCircleButton />
            </TouchableOpacityBox>
            <TouchableOpacityBox marginStart="s">
              <HexCircleButton />
            </TouchableOpacityBox>
          </Box>
        </Animated.View>

        <BottomSheet
          containerStyle={{ paddingLeft: 0, paddingRight: 0 }}
          snapPoints={[dragMin, dragMid, dragMax]}
          initialSnapIndex={1}
          snapProgress={snapProgress}
          renderHeader={() => (
            <HotspotDetailCardHeader
              onFollowSelected={onFollowHotspot}
              onMoreSelected={onMoreMenuSelected}
            />
          )}
        >
          <Box padding="l">
            <Text variant="h2" color="black" marginBottom="m">
              {animalName(hotspot.address)}
            </Text>
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
              number={totalRewards?.total
                ?.toString(0)
                ?.replace('HNT', '')
                ?.trim()}
              change={rewardChange}
              color={greenOnline}
              data={rewardChatData}
              paddingTop={chartPadding}
            />
            <HotspotDetailChart
              title={t('hotspot_details.witness_title')}
              number="12"
              change={-1.2}
              color={purpleMain}
              data={data[1]}
            />
            <HotspotDetailChart
              title={t('hotspot_details.challenge_title')}
              percentage={78}
              color={purpleMain}
              data={data[2]}
            />
          </Box>
        </BottomSheet>
      </Box>
    </SafeAreaBox>
  )
}

const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const data: Record<string, ChartData[]> = {
  0: times(14).map((v, i) => ({
    up: random(0, 100),
    down: 0,
    day: weekdays[i % 7],
    id: [0, i].join('-'),
  })),
  1: times(30).map((v, i) => ({
    up: random(0, 100),
    down: 0,
    day: weekdays[i % 7],
    id: [1, i].join('-'),
  })),
  2: times(14).map((v, i) => ({
    up: random(0, 100),
    down: 0,
    day: weekdays[i % 7],
    id: [2, i].join('-'),
  })),
}

export default HotspotDetails
