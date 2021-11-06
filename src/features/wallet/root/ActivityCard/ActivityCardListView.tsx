/* eslint-disable @typescript-eslint/naming-convention */
import React, { useCallback, memo, useMemo } from 'react'
import { useAsync } from 'react-async-hook'
import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import ActivityItem, { ACTIVITY_ITEM_ROW_HEIGHT } from './ActivityItem'
import { getSecureItem } from '../../../../utils/secureAccount'
import activitySlice, {
  HttpTransaction,
  HttpPendingTransaction,
} from '../../../../store/activity/activitySlice'
import { useAppDispatch } from '../../../../store/store'
import { useSpacing } from '../../../../theme/themeHooks'
import ActivityCardLoading from './ActivityCardLoading'
import WalletChart from '../../../../components/BarChart/WalletChart'
import SkeletonActivityItem from './SkeletonActivityItem'

type Props = {
  hasNoResults: boolean
  data: (HttpTransaction | HttpPendingTransaction)[]
  showSkeleton: boolean
}

const ActivityCardListView = ({
  data: propsData,
  hasNoResults,
  showSkeleton,
}: Props) => {
  const { m } = useSpacing()
  const dispatch = useAppDispatch()
  const { result: address } = useAsync(getSecureItem, ['address'])

  const data = useMemo((): (
    | HttpTransaction
    | HttpPendingTransaction
    | false
  )[] => {
    if (showSkeleton) return new Array(10).map(() => false)

    return propsData
  }, [propsData, showSkeleton])

  const handleActivityItemPressed = useCallback(
    (item: HttpTransaction | HttpPendingTransaction) => () => {
      dispatch(activitySlice.actions.setDetailTxn(item))
    },
    [dispatch],
  )

  const requestMore = useCallback(() => {
    dispatch(activitySlice.actions.requestMoreActivity())
  }, [dispatch])

  type Item = {
    item: HttpTransaction | HttpPendingTransaction | false
    index: number
  }

  const renderItem = useCallback(
    ({ item, index }: Item) => {
      const isLast = () => {
        return !!data && index === data?.length - 1
      }

      if (!item) {
        return <SkeletonActivityItem isFirst={index === 0} isLast={isLast()} />
      }

      return (
        <ActivityItem
          handlePress={handleActivityItemPressed(item)}
          isFirst={index === 0}
          isLast={isLast()}
          address={address || ''}
          item={item}
        />
      )
    },
    [address, data, handleActivityItemPressed],
  )

  const keyExtractor = useCallback(
    (item: HttpTransaction | HttpPendingTransaction | false, index: number) => {
      if (!item) return `${index}`
      const txn = item as HttpPendingTransaction
      return `${txn.hash}${txn.status}`
    },
    [],
  )

  const getItemLayout = useCallback(
    (_data, index) => ({
      length: ACTIVITY_ITEM_ROW_HEIGHT,
      offset: ACTIVITY_ITEM_ROW_HEIGHT * index,
      index,
    }),
    [],
  )

  const contentContainerStyle = useMemo(() => {
    return {
      paddingHorizontal: m,
      paddingBottom: 100,
    }
  }, [m])

  const footer = useMemo(() => {
    return (
      <ActivityCardLoading
        hasNoResults={hasNoResults}
        showSkeleton={showSkeleton}
      />
    )
  }, [hasNoResults, showSkeleton])

  const header = useMemo(() => {
    return (
      <WalletChart
        showSkeleton={showSkeleton}
        height={222}
        marginHorizontal="l"
        marginBottom="s"
      />
    )
  }, [showSkeleton])

  return (
    <BottomSheetFlatList
      ListHeaderComponent={header}
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={contentContainerStyle}
      ListFooterComponent={footer}
      getItemLayout={getItemLayout}
      onEndReached={requestMore}
    />
  )
}

export default memo(ActivityCardListView)
