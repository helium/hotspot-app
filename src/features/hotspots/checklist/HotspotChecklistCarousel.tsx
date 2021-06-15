import React, { memo, ReactElement, useCallback, useState } from 'react'
import { Carousel, Pagination } from 'react-native-snap-carousel'
import { Platform } from 'react-native'
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

  const keyExtractor = useCallback((item: ChecklistItem, index: number) => {
    return `${item.key}.${index}`
  }, [])

  const isAndroid = Platform.OS === 'android'
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
  if (isAndroid) {
    return (
      <FlatList
        data={checklistData}
        renderItem={renderItem}
        horizontal
        keyExtractor={keyExtractor}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      />
    )
  }

  return (
    <>
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
