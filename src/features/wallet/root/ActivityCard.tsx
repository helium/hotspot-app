/* eslint-disable @typescript-eslint/naming-convention */
import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  ElementRef,
  Ref,
  useEffect,
  useState,
  useCallback,
  memo,
} from 'react'
import BottomSheet from 'react-native-holy-sheet'
import Animated from 'react-native-reanimated'
import { useSelector } from 'react-redux'
import { AnyTransaction, AddGatewayV1, PendingTransaction } from '@helium/http'
import { useAsync } from 'react-async-hook'
import {
  LayoutAnimation,
  RefreshControl,
  FlatList,
  ActivityIndicator,
} from 'react-native'
import { useTranslation } from 'react-i18next'
import ActivityItem from './ActivityItem'
import { WalletAnimationPoints } from './walletLayout'
import ActivityCardHeader from './ActivityCardHeader'
import { RootState } from '../../../store/rootReducer'
import { getSecureItem } from '../../../utils/secureAccount'
import { isPendingTransaction } from '../../../utils/transactions'
import { FilterType } from './walletTypes'
import { fetchTxns } from '../../../store/account/accountSlice'
import { useAppDispatch } from '../../../store/store'
import { useColors, useSpacing } from '../../../theme/themeHooks'
import Text from '../../../components/Text'

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
    const flatListRef = useRef<FlatList<PendingTransaction | AnyTransaction>>(
      null,
    )
    const [hasFetchedPending, setHasFetchedPending] = useState(false)
    const [filter, setFilter] = useState<FilterType>('all')
    const { result: address } = useAsync(getSecureItem, ['address'])
    const { purpleMuted } = useColors()
    const { m, n_m } = useSpacing()
    const dispatch = useAppDispatch()
    const { t } = useTranslation()
    const {
      account: { txns, txnStatus },
    } = useSelector((state: RootState) => state)

    const loadData = useCallback(() => {
      dispatch(fetchTxns(filter))

      if (!hasFetchedPending) {
        setHasFetchedPending(true)
        dispatch(fetchTxns('pending'))
      }
    }, [dispatch, filter, hasFetchedPending])

    useEffect(() => {
      loadData()
    }, [filter, loadData])

    useEffect(() => {
      let data: (PendingTransaction | AnyTransaction)[] = txns[filter]
      if (filter === 'all') {
        data = [...txns.pending, ...data]
      }
      if (!transactionData.length) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      }
      setTransactionData(data)
    }, [filter, txns, transactionData.length])

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
      setTransactionData([])
    }

    useEffect(() => {
      if (!transactionData.length) {
        flatListRef?.current?.scrollToOffset({ animated: false, offset: 0 })
      }
    }, [transactionData.length])

    // TODO: Figure out why there is a delay after setting the filter

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
        containerStyle={{ paddingHorizontal: m }}
        flatListProps={{
          style: { marginTop: n_m },
          data: transactionData,
          ref: flatListRef,
          maxToRenderPerBatch: 50,
          keyExtractor: (item: AnyTransaction | PendingTransaction) => {
            if (isPendingTransaction(item)) {
              return `${filter}.${(item as PendingTransaction).hash}`
            }

            return `${filter}.${(item as AddGatewayV1).hash}`
          },
          renderItem,
          refreshControl: (
            <RefreshControl
              refreshing={txnStatus === 'pending' && !transactionData.length}
              onRefresh={loadData}
              tintColor={purpleMuted}
            />
          ),
          ListHeaderComponent: () => {
            if (txnStatus === 'pending' && !transactionData.length) {
              return <ActivityIndicator />
            }

            if (txnStatus === 'fulfilled' && !transactionData.length) {
              return (
                <Text
                  padding="l"
                  variant="body1"
                  color="black"
                  width="100%"
                  textAlign="center"
                >
                  {t('transactions.no_results')}
                </Text>
              )
            }

            return null
          },
          onEndReached: loadData,
        }}
      />
    )
  },
)

export default memo(ActivityCard)
