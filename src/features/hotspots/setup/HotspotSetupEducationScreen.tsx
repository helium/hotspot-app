import React, { useState, useRef } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import Carousel from 'react-native-snap-carousel'
import BackScreen from '../../../components/BackScreen'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import slides from './hotspotSetupSlides'
import { wp } from '../../../utils/layout'
import ProgressBar from '../../../components/ProgressBar'
import Button from '../../../components/Button'
import CarouselItem, {
  CarouselItemData,
} from '../../../components/CarouselItem'
import {
  HotspotSetupNavigationProp,
  HotspotSetupStackParamList,
} from './hotspotSetupTypes'

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

  const navNext = () => navigation.push('HotspotSetupDiagnosticsScreen', params)

  const renderButton = () => {
    if (viewedSlides) {
      return (
        <Button
          onPress={navNext}
          marginHorizontal="m"
          variant="primary"
          mode="contained"
          title={t('learn.next')}
        />
      )
    }
    return (
      <Button
        marginHorizontal="m"
        variant="secondary"
        mode="text"
        onPress={navNext}
        title={t('generic.skip')}
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
      backgroundColor="mainBackground"
      paddingBottom="s"
      justifyContent="space-between"
    >
      <Text
        variant="header"
        textAlign="center"
        padding={{ smallPhone: 'm', phone: 'l' }}
        numberOfLines={2}
        adjustsFontSizeToFit
      >
        {t('hotspot_setup.education.title')}
      </Text>

      <Box flex={1} maxHeight={500}>
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
        <ProgressBar
          margin={{ phone: 'l', smallPhone: 'm' }}
          progress={(slideIndex + 1) / slides.length}
        />
      </Box>
      <Box flexDirection="column" justifyContent="space-between">
        {renderButton()}
      </Box>
    </BackScreen>
  )
}

export default HotspotEducationScreen
