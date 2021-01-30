import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Hotspot, HotspotRewardSum } from '@helium/http'
import BottomSheet from 'react-native-holy-sheet/src/index'
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated'
import { useNavigation } from '@react-navigation/native'
import Balance, { CurrencyType } from '@helium/currency'
import { FlatList } from 'react-native'
import { GeoJsonProperties } from 'geojson'
import Text from '../../../components/Text'
import Box from '../../../components/Box'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import Add from '../../../assets/images/add.svg'
import { hp } from '../../../utils/layout'
import { getHotspotRewardsSum } from '../../../utils/appDataClient'
import Map from '../../../components/Map'
import { hotspotsToFeatures } from '../../../utils/mapUtils'
import HotspotListItem from '../../../components/HotspotListItem'
import Handle from '../../../assets/images/handle.svg'

type Props = {
  ownedHotspots: Hotspot[]
}

const TimeOfDayHeader = ({ date }: { date: Date }) => {
  const { t } = useTranslation()
  const hours = date.getHours()
  let timeOfDay = t('time.afternoon')
  if (hours >= 4 && hours < 12) {
    timeOfDay = t('time.morning')
  }
  if (hours >= 17 || hours < 4) {
    timeOfDay = t('time.evening')
  }
  return <Text variant="h1">{t('time.day_header', { timeOfDay })}</Text>
}

const HotspotsView = ({ ownedHotspots }: Props) => {
  const navigation = useNavigation()
  const dragMid = hp(40)
  const dragMax = hp(75)
  const dragMin = 40
  const { t } = useTranslation()
  const flatListRef = useRef<FlatList<Hotspot>>(null)

  const [date, setDate] = useState(new Date())
  useEffect(() => {
    const dateTimer = setInterval(() => setDate(new Date()), 300000) // update every 5 min
    return () => clearInterval(dateTimer)
  })

  const [hotspotRewards, setHotspotRewards] = useState<
    Record<string, HotspotRewardSum>
  >({})
  const [totalRewards, setTotalRewards] = useState(
    new Balance(0, CurrencyType.networkToken),
  )
  useEffect(() => {
    const fetchRewards = async () => {
      let total = new Balance(0, CurrencyType.networkToken)
      const rewards: Record<string, HotspotRewardSum> = {}
      const results = await Promise.all(
        ownedHotspots.map((hotspot) =>
          getHotspotRewardsSum(hotspot.address, 1),
        ),
      )
      results.forEach((reward, i) => {
        const { address } = ownedHotspots[i]
        rewards[address] = reward
        total = total.plus(reward.total)
      })
      setHotspotRewards(rewards)
      setTotalRewards(total)
    }
    fetchRewards()
  }, [ownedHotspots, date])

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

  const onMapHotspotSelected = (properties: GeoJsonProperties) => {
    const hotspot = {
      ...properties,
    } as Hotspot
    navigation.navigate('HotspotDetails', { hotspot })
  }

  const ownedHotspotFeatures = hotspotsToFeatures(ownedHotspots)

  const renderHeader = () => (
    <Box paddingVertical="m" borderTopRightRadius="m" borderTopLeftRadius="m">
      <Box alignItems="center">
        <Handle />
      </Box>
      <Text
        variant="subtitleBold"
        color="black"
        paddingVertical="m"
        paddingStart="l"
      >
        {t('hotspots.owned.your_hotspots')}
      </Text>
    </Box>
  )

  return (
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
          ownedHotspots={ownedHotspotFeatures}
          zoomLevel={14}
          mapCenter={[ownedHotspots[0].lng || 0, ownedHotspots[0].lat || 0]}
          animationMode="flyTo"
          offsetCenterRatio={1.5}
          onFeatureSelected={onMapHotspotSelected}
        />
      </Box>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        backgroundColor="primaryBackground"
        padding="m"
      >
        <Text variant="h3">{t('hotspots.owned.title')}</Text>

        <Box flexDirection="row" justifyContent="space-between">
          {/* TODO: Hotspot Search */}
          {/* <TouchableOpacityBox padding="s"> */}
          {/*  <Search width={22} height={22} /> */}
          {/* </TouchableOpacityBox> */}
          <TouchableOpacityBox
            onPress={() => navigation.navigate('HotspotSetup')}
            padding="s"
          >
            <Add width={22} height={22} />
          </TouchableOpacityBox>
        </Box>
      </Box>

      <Animated.View style={animatedStyles}>
        <Box padding="l" style={{ marginBottom: dragMid }}>
          <TimeOfDayHeader date={date} />
          <Text variant="body1" paddingTop="m">
            {t('hotspots.owned.reward_summary', {
              count: ownedHotspots.length,
              hntAmount: totalRewards.toString(2),
            })}
          </Text>
        </Box>
      </Animated.View>

      <BottomSheet
        containerStyle={{ paddingLeft: 0, paddingRight: 0 }}
        snapPoints={[dragMin, dragMid, dragMax]}
        initialSnapIndex={1}
        renderHeader={renderHeader}
        snapProgress={snapProgress}
        flatListProps={{
          data: ownedHotspots,
          ref: flatListRef,
          keyExtractor: (item: Hotspot) => item.address,
          renderItem: ({ item }: { item: Hotspot }) => (
            <Box marginHorizontal="l" marginBottom="s">
              <HotspotListItem
                hotspot={item}
                showCarot
                totalReward={hotspotRewards[item.address]?.total || 0}
              />
            </Box>
          ),
        }}
      />
    </Box>
  )
}

export default HotspotsView
