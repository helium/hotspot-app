/* eslint-disable @typescript-eslint/naming-convention */
import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  Ref,
  useEffect,
  useState,
  useCallback,
  memo,
} from 'react'
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import Animated from 'react-native-reanimated'
import { useSelector } from 'react-redux'
import { useAsync } from 'react-async-hook'
import { LayoutAnimation } from 'react-native'
import {
  AnyTransaction,
  AddGatewayV1,
  PendingTransaction,
  AssertLocationV1,
} from '@helium/http'
import animalName from 'angry-purple-tiger'
import ActivityItem from './ActivityItem'
import { WalletAnimationPoints } from '../walletLayout'
import ActivityCardHeader from './ActivityCardHeader'
import { RootState } from '../../../../store/rootReducer'
import { getSecureItem } from '../../../../utils/secureAccount'
import { isPendingTransaction } from '../../../../utils/transactions'
import activitySlice, {
  fetchTxns,
} from '../../../../store/activity/activitySlice'
import { useAppDispatch } from '../../../../store/store'
import { useSpacing } from '../../../../theme/themeHooks'
import useActivityItem from '../useActivityItem'
import ActivityCardLoading from './ActivityCardLoading'
import useVisible from '../../../../utils/useVisible'

type Props = {
  animationPoints: WalletAnimationPoints
  animatedIndex?: Animated.Value<number>
  onChange?: (index: number) => void
}

const ActivityCard = forwardRef((props: Props, ref: Ref<BottomSheet>) => {
  const { animationPoints, animatedIndex, onChange } = props
  const { dragMax, dragMid, dragMin } = animationPoints
  const { m } = useSpacing()
  const dispatch = useAppDispatch()

  const [transactionData, setTransactionData] = useState<
    (AnyTransaction | PendingTransaction)[]
  >([])

  const { result: address } = useAsync(getSecureItem, ['address'])
  const { backgroundColor, title, listIcon, amount, time } = useActivityItem(
    address || '',
  )

  const {
    activity: { txns, filter },
    heliumData: { blockHeight },
  } = useSelector((state: RootState) => state)

  const sheet = useRef<BottomSheet>(null)
  const interval = useRef<NodeJS.Timeout>()

  useVisible({
    onAppear: () => {
      dispatch(fetchTxns({ filter, resetLists: true }))
      dispatch(fetchTxns({ filter: 'pending' }))
      interval.current = setInterval(() => {
        dispatch(fetchTxns({ filter: 'pending' }))
      }, 5000)
    },
    onDisappear: () => {
      if (!interval.current) return
      clearInterval(interval.current)
    },
  })

  useAsync(async () => {
    dispatch(fetchTxns({ filter, resetLists: true }))
  }, [blockHeight, dispatch, filter])

  useEffect(() => {
    let data: (PendingTransaction | AnyTransaction)[]
    data = txns[filter].data
    if (filter === 'all') {
      data = [...txns.pending.data, ...data]
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setTransactionData(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txns[filter]])

  // TODO is there an easier way to copy/forward these methods?
  useImperativeHandle(ref, () => ({
    snapTo(index: number, force?: boolean): void {
      sheet.current?.snapTo(index, force)
    },
    expand() {
      sheet.current?.expand()
    },
    collapse() {
      sheet.current?.collapse()
    },
    close() {
      sheet.current?.close()
    },
  }))

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

  type Item = {
    item: AnyTransaction | PendingTransaction
    index: number
  }

  const renderItem = useCallback(
    ({ item, index }: Item) => {
      return (
        <ActivityItem
          hash={(item as AddGatewayV1).hash}
          handlePress={handleActivityItemPressed(item)}
          isFirst={index === 0}
          isLast={!!transactionData && index === transactionData.length - 1}
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
      transactionData,
    ],
  )

  return (
    <BottomSheet
      handleComponent={ActivityCardHeader}
      snapPoints={[dragMin, dragMid, dragMax]}
      index={1}
      animateOnMount={false}
      ref={sheet}
      onChange={onChange}
      animatedIndex={animatedIndex}
    >
      <BottomSheetFlatList
        data={transactionData}
        renderItem={renderItem}
        keyExtractor={(item: AnyTransaction | PendingTransaction) => {
          if (isPendingTransaction(item)) {
            return `${filter}.${(item as PendingTransaction).hash}`
          }

          return `${filter}.${(item as AddGatewayV1).hash}`
        }}
        contentContainerStyle={{ paddingHorizontal: m }}
        maxToRenderPerBatch={30}
        initialNumToRender={30}
        ListFooterComponent={
          <ActivityCardLoading
            isLoading={
              txns[filter].status === 'pending' && !transactionData?.length
            }
            hasNoResults={
              txns[filter].status === 'fulfilled' &&
              transactionData &&
              transactionData.length === 0
            }
          />
        }
        onEndReached={() => dispatch(fetchTxns({ filter }))}
      />
    </BottomSheet>
  )
})

export default memo(ActivityCard)
