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
import Card from '../../../components/Card'
import { useSpacing } from '../../../theme/themeHooks'

type Route = RouteProp<EducationStackParamList, 'HotspotEducationScreen'>
type CarouselItem = {
  topTitle: string
  topBody: string
  bottomTitle: string
  bottomBody: string
}
const HotspotEducationScreen = () => {
  const { t } = useTranslation()
  const { params: { showButton } = { showButton: true } } = useRoute<Route>()
  const carouselRef = useRef<Carousel<CarouselItem>>(null)
  const [viewedSlides, setViewedSlides] = useState(false)
  const navigation = useNavigation<EducationNavigationProp>()
  const { lx } = useSpacing()

  // TODO: Fill out slide content in en.ts when it's ready
  const slides: Array<CarouselItem> = t('learn.slides', { returnObjects: true })

  const onSnapToItem = (index: number) => {
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
        title={t('generic.skip_for_now')}
      />
    )
  }

  const renderItem = ({ item }: { item: CarouselItem }) => (
    <Card
      marginHorizontal="s"
      variant="elevated"
      flex={1}
      backgroundColor="white"
      overflow="hidden"
      height={545}
    >
      <Box
        backgroundColor="purpleMain"
        paddingHorizontal="m"
        justifyContent="flex-end"
        padding="lx"
        flex={1}
      >
        <Text
          variant="medium"
          fontSize={28}
          color="white"
          marginBottom="xs"
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {item.topTitle}
        </Text>
        <Text variant="body2Light" color="white" marginTop="xxs">
          {item.topBody}
        </Text>
      </Box>
      <Box backgroundColor="white" paddingHorizontal="m" padding="lx" flex={1}>
        <Text
          variant="medium"
          marginBottom="xs"
          fontSize={18}
          color="blueDark"
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {item.topTitle}
        </Text>
        <Text variant="body2Light" color="blueDark" marginTop="xxs">
          {item.topBody}
        </Text>
      </Box>
    </Card>
  )

  return (
    <SafeAreaBox
      backgroundColor="primaryBackground"
      flex={1}
      justifyContent="flex-end"
    >
      <Text variant="h1" numberOfLines={2} adjustsFontSizeToFit padding="lx">
        {t('learn.title')}
      </Text>

      <Box flex={1} maxHeight={545} marginBottom="lx">
        <Carousel
          layout="default"
          ref={carouselRef}
          vertical={false}
          data={slides}
          renderItem={renderItem}
          sliderWidth={wp(100)}
          itemWidth={wp(100) - lx}
          inactiveSlideScale={1}
          onSnapToItem={(i) => onSnapToItem(i)}
        />
      </Box>
      {showButton && renderButton()}
    </SafeAreaBox>
  )
}

export default HotspotEducationScreen
