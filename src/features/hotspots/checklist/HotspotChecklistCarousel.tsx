import React, { memo, ReactElement, useCallback, useState } from 'react'
import { Carousel, Pagination } from 'react-native-snap-carousel'
import { Dimensions, Platform } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import HotspotChecklistItem from './HotspotChecklistItem'
import { wp } from '../../../utils/layout'
import { useColors } from '../../../theme/themeHooks'

export type ChecklistItem = {
  key: string
  title: string
  description: string
  complete?: boolean
  showAuto?: boolean
  autoText?: string
  Icon?: ReactElement
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

  const renderItem = useCallback(
    (item: { index: number; item: ChecklistItem }) => {
      return (
        <HotspotChecklistItem
          index={item.index}
          title={item.item.title}
          description={item.item.description}
          complete={item.item.complete}
          showAuto={item.item.showAuto}
          autoText={item.item.autoText}
          itemKey={item.item.key}
          percentComplete={percentComplete}
          isAndroid={isAndroid}
          totalCount={checklistData.length}
        />
      )
    },
    [isAndroid, percentComplete, checklistData.length],
  )

  return (
    <>
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
          onScrollIndexChanged={(i) => setSlideIndex(i)}
        />
      )}
      <Pagination
        dotsLength={checklistData.length}
        activeDotIndex={slideIndex}
        inactiveDotOpacity={0.2}
        inactiveDotScale={1}
        dotColor={colors.purpleMain}
        inactiveDotColor={colors.grayText}
      />
    </>
  )
}

export default memo(HotspotChecklistCarousel)
