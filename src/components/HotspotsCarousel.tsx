import { Hotspot, Sum } from '@helium/http'
import React from 'react'
import Carousel from 'react-native-snap-carousel'
import { useTranslation } from 'react-i18next'
import Balance, { CurrencyType } from '@helium/currency'
import Box from './Box'
import Text from './Text'
import { wp } from '../utils/layout'
import HotspotListItem from './HotspotListItem'

type HotspotsCarouselProps = {
  hotspots: Hotspot[]
  rewards: Record<string, Sum>
  onHotspotFocused: (hotspot: Hotspot) => void
}

const HotspotsCarousel = ({
  hotspots,
  rewards,
  onHotspotFocused,
}: HotspotsCarouselProps) => {
  const { t } = useTranslation()

  const renderItem = ({ item }: { item: Hotspot }) => (
    <HotspotListItem
      hotspot={item}
      totalReward={
        rewards[item.address]?.balanceTotal ||
        new Balance(0, CurrencyType.networkToken)
      }
    />
  )

  return (
    <Box>
      <Text
        variant="subtitleBold"
        color="black"
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
        itemWidth={wp(80)}
        inactiveSlideScale={1}
        onSnapToItem={(i) => onHotspotFocused(hotspots[i])}
      />
    </Box>
  )
}

export default HotspotsCarousel
