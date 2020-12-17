import React, { useState, useRef } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import BackScreen from '../../../components/BackScreen'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import slides from './hotspotSetupSlides'
import { wp } from '../../../utils/layout'
import Button from '../../../components/Button'
import CarouselItem, {
  CarouselItemData,
} from '../../../components/CarouselItem'
import {
  HotspotSetupNavigationProp,
  HotspotSetupStackParamList,
} from './hotspotSetupTypes'
import { useColors, useSpacing } from '../../../theme/themeHooks'

type Route = RouteProp<
  HotspotSetupStackParamList,
  'HotspotSetupEducationScreen'
>

const HotspotEducationScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  const carouselRef = useRef<Carousel<CarouselItemData>>(null)
  const [slideIndex, setSlideIndex] = useState(0)
  const [viewedSlides, setViewedSlides] = useState(false)
  const { params } = useRoute<Route>()
  const spacing = useSpacing()
  const colors = useColors()

  const navNext = () => navigation.push('HotspotSetupDiagnosticsScreen', params)

  const renderButton = () => {
    if (viewedSlides) {
      return (
        <Button
          onPress={navNext}
          variant="primary"
          mode="contained"
          title={t('learn.next')}
        />
      )
    }
    return (
      <Button
        variant="secondary"
        mode="text"
        onPress={navNext}
        title={t('generic.skip_for_now')}
      />
    )
  }

  const onSnapToItem = (index: number) => {
    setSlideIndex(index)
    if (index === slides.length - 1) {
      setViewedSlides(true)
    }
  }
  const renderItem = ({ item }: { item: CarouselItemData }) => (
    <CarouselItem item={item} />
  )

  return (
    <BackScreen
      backgroundColor="primaryBackground"
      padding="none"
      justifyContent="space-evenly"
    >
      <Text
        variant="h1"
        numberOfLines={2}
        paddingHorizontal="lx"
        marginVertical={{ smallPhone: 's', phone: 'lx' }}
        adjustsFontSizeToFit
      >
        {t('hotspot_setup.education.title')}
      </Text>

      <Box flex={1} maxHeight={473}>
        <Carousel
          layout="default"
          ref={carouselRef}
          vertical={false}
          data={slides}
          renderItem={renderItem}
          sliderWidth={wp(100)}
          itemWidth={wp(90)}
          inactiveSlideScale={1}
          onSnapToItem={(i) => onSnapToItem(i)}
        />
        <Pagination
          dotsLength={slides.length}
          activeDotIndex={slideIndex}
          dotStyle={{
            width: 6,
            height: 6,
            borderRadius: 3,
            marginHorizontal: spacing.s,
            backgroundColor: colors.white,
          }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={1}
        />
      </Box>
      <Box flexDirection="column" marginHorizontal="lx" marginBottom="s">
        {renderButton()}
      </Box>
    </BackScreen>
  )
}

export default HotspotEducationScreen
