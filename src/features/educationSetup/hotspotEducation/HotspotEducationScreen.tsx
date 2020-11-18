import React, { useRef, useState } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { Platform } from 'react-native'
import { useTranslation } from 'react-i18next'
import Carousel from 'react-native-snap-carousel'
import OneSignal from 'react-native-onesignal'
import Box from '../../../components/Box'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import ImageBox from '../../../components/ImageBox'
import SafeAreaBox from '../../../components/SafeAreaBox'
import Text from '../../../components/Text'
import { wp } from '../../../utils/layout'
import {
  EducationNavigationProp,
  EducationStackParamList,
} from '../educationTypes'
import { SlideItem, slides } from './slides'
import ProgressBar from '../../../components/ProgressBar'

type Route = RouteProp<EducationStackParamList, 'HotspotEducationScreen'>

const HotspotEducationScreen = () => {
  const { t } = useTranslation()
  const { params: { showButton } = { showButton: true } } = useRoute<Route>()
  const carouselRef = useRef<Carousel<SlideItem>>(null)
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

  const renderItem = ({ item }: { item: SlideItem }) => (
    <Card marginHorizontal="s" variant="elevated" flex={1} overflow="hidden">
      <ImageBox source={item.image} width="100%" flex={1} />
      <Box backgroundColor="white" flex={1} paddingHorizontal="m">
        <Text
          variant="bodyBold"
          paddingTop={{ smallPhone: 's', phone: 'm' }}
          paddingBottom={{ smallPhone: 'xs', phone: 'm' }}
          color="darkestBlue"
          textAlign="center"
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {t(item.title)}
        </Text>
        <Text
          numberOfLines={5}
          variant="body"
          textAlign="center"
          color="darkestBlue"
          adjustsFontSizeToFit
        >
          {t(item.desc)}
        </Text>
      </Box>
    </Card>
  )

  return (
    <SafeAreaBox
      backgroundColor="mainBackground"
      flex={1}
      paddingBottom="s"
      justifyContent="space-evenly"
    >
      <Text
        variant="header"
        textAlign="center"
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
