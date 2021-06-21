import React, { memo, useCallback, useState } from 'react'
import { Carousel, Pagination } from 'react-native-snap-carousel'
import { Dimensions, Platform } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import HotspotChecklistItem from './HotspotChecklistItem'
import { wp } from '../../../utils/layout'
import { useColors } from '../../../theme/themeHooks'
import Box from '../../../components/Box'

export type ChecklistItem = {
  key: string
  title: string
  description: string
  complete?: boolean
  showAuto?: boolean
  autoText?: string
}

type Props = {
  checklistData: ChecklistItem[]
  percentComplete: number
}

const HotspotChecklistCarousel = ({
  checklistData,
  percentComplete,
}: Props) => {
  const [slideIndex, setSlideIndex] = useState(0)
  const colors = useColors()
  const isAndroid = Platform.OS === 'android'

  const keyExtractor = useCallback((item: ChecklistItem, index: number) => {
    return `${item.key}.${index}`
  }, [])

  const onScrollEnd = useCallback(
    (e) => {
      const windowWidth = Dimensions.get('window').width
      const pageNum = Math.min(
        Math.max(
          Math.floor(e.nativeEvent.contentOffset.x / windowWidth + 0.5),
          0,
        ),
        checklistData.length,
      )
      if (slideIndex !== pageNum) {
        setSlideIndex(pageNum)
      }
    },
    [checklistData.length, slideIndex],
  )

  type ListItem = { index: number; item: ChecklistItem }
  const renderItem = useCallback(
    ({ index, item }: ListItem) => {
      return (
        <HotspotChecklistItem
          index={index}
          title={item.title}
          description={item.description}
          complete={item.complete}
          showAuto={item.showAuto}
          autoText={item.autoText}
          itemKey={item.key}
          percentComplete={percentComplete}
          isAndroid={isAndroid}
          totalCount={checklistData.length}
        />
      )
    },
    [isAndroid, percentComplete, checklistData.length],
  )

  return (
    <Box height="75%">
      {isAndroid ? (
        <FlatList
          data={checklistData}
          renderItem={renderItem}
          horizontal
          keyExtractor={keyExtractor}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScrollEnd}
        />
      ) : (
        <Carousel
          layout="default"
          firstItem={0}
          activeSlideAlignment="center"
          vertical={false}
          data={checklistData}
          renderItem={renderItem}
          sliderWidth={wp(100)}
          itemWidth={wp(90)}
          inactiveSlideScale={1}
          onScrollIndexChanged={setSlideIndex}
        />
      )}
      <Box height="25%">
        <Pagination
          dotsLength={checklistData.length}
          activeDotIndex={slideIndex}
          inactiveDotOpacity={0.2}
          inactiveDotScale={1}
          dotColor={colors.purpleMain}
          inactiveDotColor={colors.grayText}
        />
      </Box>
    </Box>
  )
}

export default memo(HotspotChecklistCarousel)
