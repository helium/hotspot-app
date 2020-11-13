import { RouteProp, useRoute } from '@react-navigation/native'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Carousel from 'react-native-snap-carousel'
import Box from '../../../components/Box'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import ImageBox from '../../../components/ImageBox'
import SafeAreaBox from '../../../components/SafeAreaBox'
import Text from '../../../components/Text'
import { wp } from '../../../utils/layout'
import { OnboardingStackParamList } from '../onboardingTypes'
import { SlideItem, slides } from './slides'
import ProgressBar from '../../../components/ProgressBar'

type Route = RouteProp<OnboardingStackParamList, 'HotspotEducationScreen'>
const HotspotEducationScreen = () => {
  const { t } = useTranslation()
  const { params: { showButton } = { showButton: true } } = useRoute<Route>()
  const carouselRef = useRef<Carousel<SlideItem>>(null)
  const [slideIndex, setSlideIndex] = useState(0)
  const [viewedSlides, setViewedSlides] = useState(false)

  const onSnapToItem = (index: number) => {
    setSlideIndex(index)
    if (index === slides.length - 1) {
      setViewedSlides(true)
    }
  }

  const renderButton = () => {
    if (viewedSlides) {
      return (
        <Button
          // onPress={this.navNext}
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
        // onPress={this.navNext}
        title={t('generic.skip')}
      />
    )
  }

  const renderItem = ({ item }: { item: SlideItem }) => (
    <Card margin="s" variant="elevated" flex={1}>
      <ImageBox source={item.image} width="100%" flex={1} />
      <Box flex={1} paddingHorizontal="m">
        <Text
          paddingVertical="m"
          variant="bodyBold"
          color="darkestBlue"
          textAlign="center"
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {t(item.title)}
        </Text>
        <Text
          variant="body"
          textAlign="center"
          color="darkestBlue"
          numberOfLines={3}
          adjustsFontSizeToFit
        >
          {t(item.desc)}
        </Text>
      </Box>
    </Card>
  )

  return (
    <SafeAreaBox backgroundColor="mainBackground" flex={1} paddingBottom="s">
      <Text
        variant="header"
        textAlign="center"
        padding={{ smallPhone: 'm', phone: 'l' }}
        flex={2}
      >
        {t('learn.title')}
      </Text>

      <Box flex={9}>
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
      </Box>
      <Box flex={3} flexDirection="column" justifyContent="space-between">
        <ProgressBar
          marginTop={{ phone: 'l', smallPhone: 'm' }}
          progress={(slideIndex + 1) / slides.length}
        />
        {showButton && renderButton()}
      </Box>
    </SafeAreaBox>
  )
}

export default HotspotEducationScreen
