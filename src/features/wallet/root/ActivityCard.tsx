import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  ElementRef,
  Ref,
  useEffect,
  useState,
} from 'react'
import BottomSheet from 'react-native-holy-sheet'
import Animated from 'react-native-reanimated'
import { useSelector } from 'react-redux'
import {
  AnyTransaction,
  AddGatewayV1,
  PendingTransaction,
  GenericDataModel,
} from '@helium/http'
import { useAsync } from 'react-async-hook'
import { LayoutAnimation } from 'react-native'
import ActivityItem from './ActivityItem'
import { WalletAnimationPoints } from './walletLayout'
import ActivityCardHeader from './ActivityCardHeader'
import { RootState } from '../../../store/rootReducer'
import { getSecureItem } from '../../../utils/secureAccount'

type Props = {
  animationPoints: WalletAnimationPoints
  snapProgress?: Animated.SharedValue<number>
}

type ActivityCardHandle = {
  snapTo: (index?: number) => void
}

const ActivityCard = forwardRef(
  (props: Props, ref: Ref<ActivityCardHandle>) => {
    const { animationPoints, snapProgress } = props
    const [transactionData, setTransactionData] = useState<
      (AnyTransaction | PendingTransaction)[]
    >([])
    const { result: address } = useAsync(getSecureItem, ['address'])

    const {
      account: { transactions, pendingTransactions },
    } = useSelector((state: RootState) => state)

    useEffect(() => {
      const data = [...transactions, ...pendingTransactions]
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      setTransactionData(data)
    }, [transactions, pendingTransactions])

    type BottomSheetHandle = ElementRef<typeof BottomSheet>
    const sheet = useRef<BottomSheetHandle>(null)

    useImperativeHandle(ref, () => ({
      snapTo(index?: number): void {
        sheet.current?.snapTo(index)
      },
    }))

    const renderItem = ({
      item,
      index,
    }: {
      item: AnyTransaction | PendingTransaction
      index: number
    }) => {
      if (item instanceof GenericDataModel) return null

      return (
        <ActivityItem
          item={item}
          isFirst={index === 0}
          isLast={index === transactionData.length - 1}
          address={address}
        />
      )
    }

    const { dragMax, dragMid, dragMin } = animationPoints

    return (
      <BottomSheet
        ref={sheet}
        snapPoints={[dragMin, dragMid, dragMax]}
        initialSnapIndex={1}
        snapProgress={snapProgress}
        renderHeader={() => <ActivityCardHeader />}
        flatListProps={{
          data: transactionData,
          keyExtractor: (item: AnyTransaction | PendingTransaction) => {
            if (item instanceof GenericDataModel) {
              // Just return a random number.
              return (
                Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15)
              )
            }

            const pending = item as PendingTransaction
            if (pending.createdAt !== undefined) {
              return `${pending.createdAt}.${item.type}`
            }

            const key = `${(item as AddGatewayV1).time}.${item.type}`
            return key
          },
          renderItem,
        }}
      />
    )
  },
)

export default ActivityCard
