import React, { useRef, useState } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { Platform } from 'react-native'
import { useTranslation } from 'react-i18next'
import Carousel from 'react-native-snap-carousel'
import OneSignal from 'react-native-onesignal'
import Box from '../../../components/Box'
import Button from '../../../components/Button'
import SafeAreaBox from '../../../components/SafeAreaBox'
import Text from '../../../components/Text'
import { wp } from '../../../utils/layout'
import {
  EducationNavigationProp,
  EducationStackParamList,
} from '../educationTypes'
import slides from './slides'
import ProgressBar from '../../../components/ProgressBar'
import CarouselItem, {
  CarouselItemData,
} from '../../../components/CarouselItem'

type Route = RouteProp<EducationStackParamList, 'HotspotEducationScreen'>

const HotspotEducationScreen = () => {
  const { t } = useTranslation()
  const { params: { showButton } = { showButton: true } } = useRoute<Route>()
  const carouselRef = useRef<Carousel<CarouselItemData>>(null)
  const [slideIndex, setSlideIndex] = useState(0)
  const [viewedSlides, setViewedSlides] = useState(false)
  const navigation = useNavigation<EducationNavigationProp>()

  const onSnapToItem = (index: number) => {
    setSlideIndex(index)
    if (index === slides.length - 1) {
      setViewedSlides(true)
    }
  }

  const navNext = async () => {
    if (Platform.OS === 'android') {
      navigation.push('AccountEndSetupScreen')
    }

    const deviceState = await OneSignal.getDeviceState()
    if (!deviceState.isSubscribed) {
      navigation.push('EnableNotificationsScreen')
    } else {
      navigation.push('AccountEndSetupScreen')
    }
  }

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

  const renderItem = ({ item }: { item: CarouselItemData }) => (
    <CarouselItem item={item} />
  )

  return (
    <SafeAreaBox
      backgroundColor="primaryBackground"
      flex={1}
      paddingBottom="s"
      justifyContent="space-evenly"
    >
      <Text
        variant="h1"
        textAlign="center"
        numberOfLines={2}
        adjustsFontSizeToFit
        padding={{ smallPhone: 'm', phone: 'l' }}
      >
        {t('learn.title')}
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
        {showButton && renderButton()}
      </Box>
    </SafeAreaBox>
  )
}

export default HotspotEducationScreen
