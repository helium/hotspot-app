import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import WalletIcon from '@assets/images/walletIcon.svg'
import { Carousel, Pagination } from 'react-native-snap-carousel'
import Receive from '@assets/images/receive.svg'
import Send from '@assets/images/send.svg'
import ChartIcon from '@assets/images/chartIcon.svg'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import { wp } from '../../../utils/layout'
import { useColors } from '../../../theme/themeHooks'
import parseMarkup from '../../../utils/parseMarkup'

type CarouselItem = {
  title: string
  body: string
}

const WalletIntroCarousel = () => {
  const { t } = useTranslation()
  const colors = useColors()

  const slides: Array<CarouselItem> = t('wallet.intro_slides', {
    returnObjects: true,
  })

  const [slideIndex, setSlideIndex] = useState(0)

  const carouselRef = useRef<Carousel<CarouselItem>>(null)

  const getIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Receive width={40} height={40} color={colors.greenBright} />
      case 1:
        return <Send width={40} height={40} color={colors.blueBright} />
      case 2:
      case 3:
        return <ChartIcon />
      default:
        return null
    }
  }

  const renderItem = ({
    index,
    item,
  }: {
    index: number
    item: CarouselItem
  }) => (
    <Box borderRadius="m" marginStart="l" height={90} flexDirection="row">
      <Box
        backgroundColor="purple500"
        padding="m"
        width="70%"
        borderTopLeftRadius="m"
        borderBottomLeftRadius="m"
      >
        <Text variant="regular" paddingBottom="xs" color="white">
          {item.title}
        </Text>
        {parseMarkup(item.body, <Text variant="body2" color="grayText" />)}
      </Box>
      <Box
        backgroundColor="purple300"
        width="30%"
        borderTopRightRadius="m"
        borderBottomRightRadius="m"
        justifyContent="center"
        alignItems="center"
      >
        {getIcon(index)}
      </Box>
    </Box>
  )

  return (
    <Box flex={1} marginTop="xl">
      <Box paddingHorizontal="l">
        <WalletIcon />
      </Box>
      <Text variant="h2" paddingTop="l" paddingBottom="m" paddingHorizontal="l">
        {t('wallet.title')}
      </Text>
      <Text
        variant="body1"
        color="grayText"
        paddingHorizontal="l"
        paddingBottom="xl"
      >
        {t('wallet.intro_body')}
      </Text>
      <Box>
        <Carousel
          layout="default"
          ref={carouselRef}
          vertical={false}
          data={slides}
          renderItem={renderItem}
          sliderWidth={wp(100)}
          itemWidth={wp(80)}
          inactiveSlideScale={1}
          activeSlideAlignment="start"
          onScrollIndexChanged={(i) => setSlideIndex(i)}
        />
        <Pagination
          dotsLength={slides.length}
          activeDotIndex={slideIndex}
          dotStyle={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: colors.white,
          }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={1}
        />
      </Box>
    </Box>
  )
}

export default WalletIntroCarousel
