import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  ElementRef,
  Ref,
  useEffect,
  useState,
  useCallback,
} from 'react'
import BottomSheet from 'react-native-holy-sheet'
import Animated from 'react-native-reanimated'
import { useSelector } from 'react-redux'
import { AnyTransaction, AddGatewayV1, PendingTransaction } from '@helium/http'
import { useAsync } from 'react-async-hook'
import { LayoutAnimation, RefreshControl } from 'react-native'
import ActivityItem from './ActivityItem'
import { WalletAnimationPoints } from './walletLayout'
import ActivityCardHeader from './ActivityCardHeader'
import { RootState } from '../../../store/rootReducer'
import { getSecureItem } from '../../../utils/secureAccount'
import { isPendingTransaction } from '../../../utils/transactions'
import { FilterType } from './walletTypes'
import { fetchTxns } from '../../../store/account/accountSlice'
import { useAppDispatch } from '../../../store/store'
import { useColors } from '../../../theme/themeHooks'

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
    const { purpleMuted } = useColors()

    const dispatch = useAppDispatch()
    const {
      account: { txns, txnStatus },
    } = useSelector((state: RootState) => state)

    const loadData = useCallback(() => {
      dispatch(fetchTxns(filter))

      if (!txns.pending) {
        dispatch(fetchTxns('pending'))
      }
    }, [dispatch, filter, txns.pending])

    useEffect(() => {
      loadData()
    }, [filter, loadData])

    useEffect(() => {
      let data = []
      if (filter === 'all') {
        data = [...txns[filter], ...txns.pending]
      } else {
        data = txns[filter]
      }
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      setTransactionData(data)
    }, [filter, txns])

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

    const onFilterChanged = (f: FilterType) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      setFilter(f)
    }

    return (
      <BottomSheet
        ref={sheet}
        snapPoints={[dragMin, dragMid, dragMax]}
        initialSnapIndex={1}
        snapProgress={snapProgress}
        renderHeader={() => (
          <ActivityCardHeader
            filter={filter}
            onFilterChanged={onFilterChanged}
          />
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
          refreshControl: (
            <RefreshControl
              refreshing={txnStatus === 'pending'}
              onRefresh={loadData}
              tintColor={purpleMuted}
            />
          ),

          onEndReached: loadData,
        }}
      />
    )
  },
)

export default ActivityCard
