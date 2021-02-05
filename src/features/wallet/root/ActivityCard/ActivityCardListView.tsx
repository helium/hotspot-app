/* eslint-disable @typescript-eslint/naming-convention */
import React, { useCallback, memo, useMemo } from 'react'
import { useAsync } from 'react-async-hook'
import {
  AnyTransaction,
  AddGatewayV1,
  PendingTransaction,
  AssertLocationV1,
} from '@helium/http'
import animalName from 'angry-purple-tiger'
import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import ActivityItem, { ACTIVITY_ITEM_ROW_HEIGHT } from './ActivityItem'
import { getSecureItem } from '../../../../utils/secureAccount'
import activitySlice, {
  Loading,
} from '../../../../store/activity/activitySlice'
import { useAppDispatch } from '../../../../store/store'
import { useSpacing } from '../../../../theme/themeHooks'
import useActivityItem from '../useActivityItem'
import ActivityCardLoading from './ActivityCardLoading'
import { FilterType } from '../walletTypes'

type AllTxns = (AnyTransaction | PendingTransaction)[]
type Props = {
  isResetting: boolean
  filter: FilterType
  status: Loading
  data: AllTxns
}

const ActivityCardListView = ({ isResetting, filter, status, data }: Props) => {
  const { m } = useSpacing()
  const dispatch = useAppDispatch()
  const { result: address } = useAsync(getSecureItem, ['address'])
  const { backgroundColor, title, listIcon, amount, time } = useActivityItem(
    address || '',
  )

  const handleActivityItemPressed = useCallback(
    (item: AnyTransaction | PendingTransaction) => () => {
      dispatch(activitySlice.actions.setDetailTxn(item))
    },
    [dispatch],
  )

  const getSubtitle = useCallback(
    (item: AnyTransaction | PendingTransaction) => {
      if (item instanceof AssertLocationV1 || item instanceof AddGatewayV1) {
        return animalName(item.gateway)
      }
      return amount(item)
    },
    [amount],
  )

  const requestMore = useCallback(
    () => dispatch(activitySlice.actions.requestMoreActivity()),
    [dispatch],
  )

  type Item = {
    item: AnyTransaction | PendingTransaction
    index: number
  }

  const renderItem = useCallback(
    ({ item, index }: Item) => {
      const isLast = () => {
        return !!data && index === data?.length - 1
      }
      return (
        <ActivityItem
          hash={(item as AddGatewayV1).hash}
          handlePress={handleActivityItemPressed(item)}
          isFirst={index === 0}
          isLast={isLast()}
          backgroundColor={backgroundColor(item)}
          icon={listIcon(item)}
          title={title(item)}
          subtitle={getSubtitle(item)}
          time={time(item)}
        />
      )
    },
    [
      backgroundColor,
      getSubtitle,
      handleActivityItemPressed,
      listIcon,
      time,
      title,
      data,
    ],
  )

  const keyExtractor = useCallback(
    (item: AnyTransaction | PendingTransaction) => {
      return `${filter}.${(item as AddGatewayV1).hash}`
    },
    [filter],
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
    return { paddingHorizontal: m }
  }, [m])

  return (
    <BottomSheetFlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={contentContainerStyle}
      ListFooterComponent={
        <ActivityCardLoading
          isLoading={isResetting || (status === 'pending' && !data?.length)}
          hasNoResults={status === 'fulfilled' && data && data.length === 0}
        />
      }
      getItemLayout={getItemLayout}
      onEndReached={requestMore}
    />
  )
}

export default memo(ActivityCardListView, (prevProps, nextProps) => {
  const lengthEqual = prevProps.data.length === nextProps.data.length
  const filterEqual = prevProps.filter === nextProps.filter
  if (!lengthEqual || !filterEqual) return false

  prevProps.data.forEach((txn, index) => {
    const prevTxn = txn as PendingTransaction
    const nextTxn = nextProps.data[index] as PendingTransaction

    const hashEqual = nextTxn.hash !== prevTxn.hash
    const statusEqual = nextTxn.status !== prevTxn.status

    if (!hashEqual || !statusEqual) return false
  })

  return true
})
