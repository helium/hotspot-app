import React from 'react'
import { useTranslation } from 'react-i18next'
import { ImageSourcePropType } from 'react-native'
import Box from './Box'
import Card from './Card'
import ImageBox from './ImageBox'
import Text from './Text'

export type CarouselItemData = {
  title: string
  desc: string
  image: ImageSourcePropType
}

const CarouselItem = ({ item }: { item: CarouselItemData }) => {
  const { t } = useTranslation()
  return (
    <Card
      marginHorizontal="s"
      variant="elevated"
      flex={1}
      overflow="hidden"
      height={500}
    >
      <ImageBox source={item.image} width="100%" flex={1} />
      <Box
        backgroundColor="white"
        paddingHorizontal="m"
        justifyContent="center"
        height={175}
      >
        <Text
          variant="body2Bold"
          paddingBottom={{ smallPhone: 'xs', phone: 'm' }}
          color="blueDark"
          textAlign="center"
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {t(item.title)}
        </Text>
        <Text
          numberOfLines={5}
          variant="body2Light"
          textAlign="center"
          color="blueDark"
          adjustsFontSizeToFit
        >
          {t(item.desc)}
        </Text>
      </Box>
    </Card>
  )
}

export default CarouselItem
