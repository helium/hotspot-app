import React, { memo, useCallback } from 'react'
import { Carousel } from 'react-native-snap-carousel'
import { Platform } from 'react-native'
import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import HotspotChecklistItem from './HotspotChecklistItem'
import { wp } from '../../../utils/layout'

export type ChecklistItem = {
  key: string
  title: string
  description: string
  complete?: boolean
  showAuto?: boolean
  autoText?: string
  completeText?: string
  background?: 1 | 2 | 3 | 4
}

type Props = {
  checklistData: ChecklistItem[]
}

const HotspotChecklistCarousel = ({ checklistData }: Props) => {
  const firstIndex = checklistData.findIndex((i) => !i.complete)

  const keyExtractor = useCallback((item: ChecklistItem, index: number) => {
    return `${item.key}.${index}`
  }, [])

  const isAndroid = Platform.OS === 'android'
  const renderItem = useCallback(
    (item: { item: ChecklistItem }) => (
      <HotspotChecklistItem
        title={item.item.title}
        description={item.item.description}
        complete={item.item.complete}
        showAuto={item.item.showAuto}
        autoText={item.item.autoText}
        completeText={item.item.completeText}
        background={item.item.background}
        isAndroid={isAndroid}
      />
    ),
    [isAndroid],
  )
  if (isAndroid) {
    return (
      <BottomSheetFlatList
        data={checklistData}
        initialScrollIndex={firstIndex}
        renderItem={renderItem}
        horizontal
        keyExtractor={keyExtractor}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      />
    )
  }

  return (
    <Carousel
      layout="default"
      firstItem={firstIndex === -1 ? 0 : firstIndex}
      activeSlideAlignment="center"
      vertical={false}
      data={checklistData}
      renderItem={renderItem}
      sliderWidth={wp(100)}
      itemWidth={wp(90)}
      inactiveSlideScale={1}
    />
  )
}

export default memo(HotspotChecklistCarousel)
