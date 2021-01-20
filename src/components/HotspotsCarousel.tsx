import { Hotspot, HotspotReward } from '@helium/http'
import animalName from 'angry-purple-tiger'
import React from 'react'
import Carousel from 'react-native-snap-carousel'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import Balance, { NetworkTokens } from '@helium/currency'
import Box from './Box'
import CheckCircle from '../assets/images/check-circle.svg'
import Text from './Text'
import CircleProgress from './CircleProgress'
import { wp } from '../utils/layout'
import { useColors } from '../theme/themeHooks'
import TouchableOpacityBox from './TouchableOpacityBox'

type HotspotsCarouselProps = {
  hotspots: Hotspot[]
  rewards: Record<string, HotspotReward>
  onHotspotFocused: (hotspot: Hotspot) => void
}

type HotspotsItemProps = {
  hotspot: Hotspot
  totalReward: Balance<NetworkTokens>
}

const HotspotItem = ({ hotspot, totalReward }: HotspotsItemProps) => {
  const { grayBox } = useColors()
  const navigation = useNavigation()
  return (
    <TouchableOpacityBox
      backgroundColor="grayBox"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      padding="m"
      borderRadius="m"
      marginStart="l"
      height={75}
      onPress={() => navigation.navigate('HotspotDetails', { hotspot })}
    >
      <Box flexDirection="row">
        <Box flexDirection="column">
          <Box flexDirection="row">
            <CheckCircle width={17} height={17} />
            <Text
              variant="body2Medium"
              color="black"
              paddingStart="s"
              width="80%"
            >
              {animalName(hotspot.address)}
            </Text>
          </Box>
          <Text variant="body2" color="purpleMain" paddingTop="s">
            {`+${totalReward.toString(2)}`}
          </Text>
        </Box>
        {/* TODO: Update percentage to use hotspot on-boarding progress */}
        <CircleProgress percentage={50} centerColor={grayBox} />
      </Box>
    </TouchableOpacityBox>
  )
}

const HotspotsCarousel = ({
  hotspots,
  rewards,
  onHotspotFocused,
}: HotspotsCarouselProps) => {
  const { t } = useTranslation()

  const renderItem = ({ item }: { item: Hotspot }) => (
    <HotspotItem
      hotspot={item}
      totalReward={rewards[item.address]?.total || 0}
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
