import React, { useState } from 'react'
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
import { useActionSheet } from '@expo/react-native-action-sheet'
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
import HotspotSettings from '../settings/HotspotSettings'

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

const onTimelineChanged = (_value: string, _index: number) => {
  // TODO: load different timelines
}

const HotspotDetails = () => {
  const route = useRoute<HotspotDetailsRouteProp>()
  const { hotspot } = route.params
  const navigation = useNavigation()
  const { t } = useTranslation()
  const selectedHotspots = hotspotsToFeatures([hotspot])
  const { purpleMain, greenOnline } = useColors()
  const { showActionSheetWithOptions } = useActionSheet()
  const [showSettings, setShowSettings] = useState(false)

  type SettingsOption = { label: string; action?: () => void }
  const onMoreMenuSelected = () => {
    const opts: SettingsOption[] = [
      {
        label: t('hotspot_details.options.settings'),
        action: () => setShowSettings(true),
      },
      {
        label: t('hotspot_details.options.viewExplorer'),
        action: () => setShowSettings(true),
      },
      {
        label: t('hotspot_details.options.share'),
        action: () => setShowSettings(true),
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
            <TimelinePicker onTimelineChanged={onTimelineChanged} />
            <HotspotDetailChart
              title={t('hotspot_details.reward_title')}
              number="12,345"
              change="+3.4%"
              color={greenOnline}
              data={data[0]}
            />
            <HotspotDetailChart
              title={t('hotspot_details.witness_title')}
              number="12"
              change="-1.2%"
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

      <HotspotSettings
        visible={showSettings}
        onClose={() => setShowSettings(false)}
      />
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
  1: times(14).map((v, i) => ({
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
