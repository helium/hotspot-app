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
import activitySlice from '../../../../store/activity/activitySlice'
import { useAppDispatch } from '../../../../store/store'
import { useSpacing } from '../../../../theme/themeHooks'
import useActivityItem from '../useActivityItem'
import ActivityCardLoading from './ActivityCardLoading'

type Props = {
  hasNoResults: boolean
  data: (AnyTransaction | PendingTransaction)[]
}

const ActivityCardListView = ({ data, hasNoResults }: Props) => {
  const { m } = useSpacing()
  const dispatch = useAppDispatch()
  const { result: address, loading } = useAsync(getSecureItem, ['address'])
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

  const requestMore = useCallback(() => {
    dispatch(activitySlice.actions.requestMoreActivity())
  }, [dispatch])

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
      data,
      getSubtitle,
      handleActivityItemPressed,
      listIcon,
      time,
      title,
    ],
  )

  const keyExtractor = useCallback(
    (item: AnyTransaction | PendingTransaction) => {
      const txn = item as PendingTransaction
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
    return { paddingHorizontal: m, paddingBottom: 100 }
  }, [m])

  const footer = useMemo(
    () => <ActivityCardLoading hasNoResults={hasNoResults} />,
    [hasNoResults],
  )

  if (loading) return null

  return (
    <BottomSheetFlatList
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
