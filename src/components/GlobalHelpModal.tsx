import React, { useRef, useState } from 'react'
import { Modal } from 'react-native'
import { useTranslation } from 'react-i18next'
import Carousel from 'react-native-snap-carousel'
import Box from './Box'
import Button from './Button'
import Text from './Text'
import Card from './Card'
import SafeAreaBox from './SafeAreaBox'
import { wp } from '../utils/layout'
import { useSpacing } from '../theme/themeHooks'

type CarouselItem = {
  topTitle: string
  topBody: string
  bottomTitle: string
  bottomBody: string
}
type Props = { visible: boolean; onClose: () => void }
const GlobalHelpModal = ({ visible, onClose }: Props) => {
  const { t } = useTranslation()
  const carouselRef = useRef<Carousel<CarouselItem>>(null)
  const [viewedSlides, setViewedSlides] = useState(false)
  const { lx } = useSpacing()

  // TODO: Fill out slide content in en.ts when it's ready
  const slides: Array<CarouselItem> = t('learn.slides', { returnObjects: true })

  const onSnapToItem = (index: number) => {
    if (index === slides.length - 1) {
      setViewedSlides(true)
    }
  }

  const renderButton = () => {
    if (viewedSlides) {
      return (
        <Button
          onPress={onClose}
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
        onPress={onClose}
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
    <Modal
      presentationStyle="overFullScreen"
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
    >
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
        {renderButton()}
      </SafeAreaBox>
    </Modal>
  )
}

export default GlobalHelpModal
