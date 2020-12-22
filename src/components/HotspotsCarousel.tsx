import { Hotspot } from '@helium/http'
import animalName from 'angry-purple-tiger'
import React from 'react'
import Carousel from 'react-native-snap-carousel'
import { HotspotRewardData } from '@helium/http/build/models/HotspotReward'
import { useTranslation } from 'react-i18next'
import Box from './Box'
import CheckCircle from '../assets/images/check-circle.svg'
import Text from './Text'
import CircleProgress from './CircleProgress'
import { wp } from '../utils/layout'

type HotspotsCarouselProps = {
  hotspots: Hotspot[]
  rewards: Record<string, HotspotRewardData>
}

type HotspotsItemProps = {
  hotspot: Hotspot
  reward: HotspotRewardData
}

const HotspotItem = ({ hotspot, reward = { total: 0 } }: HotspotsItemProps) => {
  return (
    <Box
      backgroundColor="grayBox"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      padding="m"
      borderRadius="m"
      marginStart="l"
      height={75}
    >
      <Box flexDirection="column">
        <Box flexDirection="row">
          <CheckCircle width={17} height={17} />
          <Text variant="body2" color="black" fontWeight="500" paddingStart="s">
            {animalName(hotspot.address)}
          </Text>
        </Box>
        <Text variant="body2" color="purpleMain" paddingTop="s">
          {`+${reward.total.toFixed(2)} HNT`}
        </Text>
      </Box>
      <CircleProgress percentage={50} centerColor="#F6F7FE" />
    </Box>
  )
}

const HotspotsCarousel = ({ hotspots, rewards }: HotspotsCarouselProps) => {
  const { t } = useTranslation()

  const renderItem = ({ item }: { item: Hotspot }) => (
    <HotspotItem hotspot={item} reward={rewards[item.address]} />
  )

  return (
    <Box>
      <Text
        variant="body1"
        color="black"
        fontWeight="600"
        paddingBottom="m"
        paddingStart="l"
      >
        {t('hotspots.owned.your_hotspots')}
      </Text>
      <Carousel
        layout="default"
        activeSlideAlignment="start"
        vertical={false}
        data={hotspots}
        renderItem={renderItem}
        sliderWidth={wp(100)}
        itemWidth={wp(75)}
        inactiveSlideScale={1}
        onSnapToItem={(i) => console.log(i)}
      />
    </Box>
  )
}

export default HotspotsCarousel
