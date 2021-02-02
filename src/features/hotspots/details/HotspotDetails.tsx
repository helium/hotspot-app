import React, { useEffect, useState } from 'react'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import animalName from 'angry-purple-tiger'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { random, times } from 'lodash'
import { Linking, Share } from 'react-native'
import { useActionSheet } from '@expo/react-native-action-sheet'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import { HotspotStackParamList } from '../root/hotspotTypes'
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
} from '../../../store/hotspotDetails/hotspotDetailsSlice'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import MoreMenu from '../../../assets/images/moreMenu.svg'
import BackButton from '../../../components/BackButton'

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

type HotspotDetailsRouteProp = RouteProp<
  HotspotStackParamList,
  'HotspotDetails'
>

const HotspotDetails = () => {
  const route = useRoute<HotspotDetailsRouteProp>()
  const navigation = useNavigation()
  const { hotspot } = route.params
  const { t } = useTranslation()
  const colors = useColors()
  const dispatch = useAppDispatch()

  const navBack = () => {
    navigation.goBack()
  }

  const {
    hotspotDetails: {
      numDays,
      rewards,
      rewardSum,
      percentChange,
      loadingRewards,
      witnesses,
    },
  } = useSelector((state: RootState) => state)

  const [timelineIndex, setTimelineIndex] = useState(2)
  const onTimelineChanged = (_value: string, index: number) => {
    setTimelineIndex(index)
  }

  useEffect(() => {
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
  }, [dispatch, hotspot.address, timelineIndex])

  const { showActionSheetWithOptions } = useActionSheet()

  type SettingsOption = { label: string; action?: () => void }
  const onMoreMenuSelected = () => {
    const explorerUrl = `https://explorer.helium.com/hotspots/${hotspot.address}`
    const opts: SettingsOption[] = [
      {
        label: t('hotspot_details.options.settings'),
        action: () =>
          dispatch(hotspotDetailsSlice.actions.toggleShowSettings()),
      },
      {
        label: t('hotspot_details.options.viewExplorer'),
        action: () => Linking.openURL(explorerUrl),
      },
      {
        label: t('hotspot_details.options.share'),
        action: () => Share.share({ message: explorerUrl }),
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

  return (
    <BottomSheetScrollView>
      <Box
        paddingHorizontal="l"
        flexDirection="row"
        alignItems="flex-end"
        justifyContent="space-between"
      >
        <BackButton
          onPress={navBack}
          color="grayLightText"
          fontSize={12}
          paddingHorizontal="none"
        />

        <TouchableOpacityBox
          onPress={onMoreMenuSelected}
          paddingVertical="s"
          paddingLeft="l"
        >
          <MoreMenu />
        </TouchableOpacityBox>
      </Box>

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
          number={rewardSum?.total?.toString(2)?.replace('HNT', '')?.trim()}
          change={percentChange}
          color={colors.greenOnline}
          data={getRewardChartData(rewards, numDays)}
          loading={loadingRewards}
        />
        <HotspotDetailChart
          title={t('hotspot_details.witness_title')}
          number={witnesses?.length?.toString()}
          change={1.2}
          color={colors.purpleMain}
          data={data[1]}
        />
        <HotspotDetailChart
          title={t('hotspot_details.challenge_title')}
          percentage={78}
          color={colors.purpleMain}
          data={data[2]}
        />
      </Box>
    </BottomSheetScrollView>
  )
}

export default HotspotDetails
