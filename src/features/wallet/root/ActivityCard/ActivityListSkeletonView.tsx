/* eslint-disable @typescript-eslint/naming-convention */
import React, { useCallback, memo, useMemo } from 'react'
import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { times } from 'lodash'
import { useSpacing } from '../../../../theme/themeHooks'
import SkeletonActivityItem from './SkeletonActivityItem'
import { ACTIVITY_ITEM_ROW_HEIGHT } from './ActivityItem'

export type SkeletonTxn = {
  hash: string
  status: string
  time: number
  type: string
}

const SKELETON_DATA = times(14).map((v) => ({
  hash: v.toString(),
  status: 'skeleton',
  time: 0,
  type: 'skeleton',
}))

const ActivityListSkeletonView = () => {
  const { m } = useSpacing()

  type Item = {
    item: SkeletonTxn
    index: number
  }

  const renderItem = useCallback(({ index }: Item) => {
    const isLast = () => {
      return !!SKELETON_DATA && index === SKELETON_DATA?.length - 1
    }

    return <SkeletonActivityItem isFirst={index === 0} isLast={isLast()} />
  }, [])

  const keyExtractor = useCallback((item: SkeletonTxn) => {
    return item.hash
  }, [])

  const getItemLayout = useCallback(
    (_data, index) => ({
      length: ACTIVITY_ITEM_ROW_HEIGHT,
      offset: ACTIVITY_ITEM_ROW_HEIGHT * index,
      index,
    }),
    [],
  )

  const contentContainerStyle = useMemo(() => {
    return { paddingHorizontal: m }
  }, [m])

  return (
    <BottomSheetFlatList
      data={SKELETON_DATA}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={contentContainerStyle}
      getItemLayout={getItemLayout}
    />
  )
}

export default memo(ActivityListSkeletonView)
