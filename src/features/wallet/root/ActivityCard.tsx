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
import { AnyTransaction, AddGatewayV1, PendingTransaction } from '@helium/http'
import { useAsync } from 'react-async-hook'
import { LayoutAnimation } from 'react-native'
import ActivityItem from './ActivityItem'
import { WalletAnimationPoints } from './walletLayout'
import ActivityCardHeader from './ActivityCardHeader'
import { RootState } from '../../../store/rootReducer'
import { getSecureItem } from '../../../utils/secureAccount'
import { isPendingTransaction } from '../../../utils/transactions'
import { FilterType } from './walletTypes'

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
    const [filter, setFilter] = useState<FilterType>('all')
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
        renderHeader={() => (
          <ActivityCardHeader filter={filter} onFilterChanged={setFilter} />
        )}
        flatListProps={{
          data: transactionData,
          keyExtractor: (item: AnyTransaction | PendingTransaction) => {
            if (isPendingTransaction(item)) {
              return `${(item as PendingTransaction).createdAt}.${item.type}`
            }

            return `${(item as AddGatewayV1).time}.${item.type}`
          },
          renderItem,
        }}
      />
    )
  },
)

export default ActivityCard
