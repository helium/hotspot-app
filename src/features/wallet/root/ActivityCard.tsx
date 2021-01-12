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
import { useAsync } from 'react-async-hook'
import { LayoutAnimation, FlatList, ActivityIndicator } from 'react-native'
import { useTranslation } from 'react-i18next'
import animalHash from 'angry-purple-tiger'
import {
  AnyTransaction,
  RewardsV1,
  AddGatewayV1,
  AssertLocationV1,
  PaymentV2,
  PaymentV1,
  PendingTransaction,
  TransferHotspotV1,
} from '@helium/http'
import { formatDistanceToNow, fromUnixTime } from 'date-fns'
import ActivityItem from './ActivityItem'
import { WalletAnimationPoints } from './walletLayout'
import ActivityCardHeader from './ActivityCardHeader'
import { RootState } from '../../../store/rootReducer'
import { getSecureItem } from '../../../utils/secureAccount'
import { isPayer, isPendingTransaction } from '../../../utils/transactions'
import { FilterType } from './walletTypes'
import { fetchTxns } from '../../../store/account/accountSlice'
import { useAppDispatch } from '../../../store/store'
import { useColors, useSpacing } from '../../../theme/themeHooks'
import Text from '../../../components/Text'
import shortLocale from '../../../utils/formatDistance'
import Rewards from '../../../assets/images/rewards.svg'
import SentHnt from '../../../assets/images/sentHNT.svg'
import HotspotAdded from '../../../assets/images/hotspotAdded.svg'
import ReceivedHnt from '../../../assets/images/receivedHNT.svg'
import Location from '../../../assets/images/location.svg'

const TxnTypeKeys = [
  'rewards_v1',
  'payment_v1',
  'payment_v2',
  'add_gateway_v1',
  'assert_location_v1',
  'transfer_hotspot_v1',
] as const
type TxnType = typeof TxnTypeKeys[number]

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
    const colors = useColors()
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

    const isSending = useCallback(
      (item: AnyTransaction | PendingTransaction) => {
        return isPayer(address, item)
      },
      [address],
    )

    const amount = useCallback(
      (item: AnyTransaction | PendingTransaction) => {
        if (item instanceof AddGatewayV1) {
          return animalHash(item.gateway)
        }
        if (
          item instanceof AssertLocationV1 ||
          item instanceof TransferHotspotV1
        ) {
          return `${
            item.fee && item.fee !== 0 ? '-' : ''
          }${item.fee?.toLocaleString()}`
        }
        if (item instanceof RewardsV1) {
          return `+${item.totalAmount.toString()}`
        }
        if (item instanceof PaymentV1) {
          return `${
            isSending(item) ? '-' : '+'
          }${item.amount.floatBalance.toString()}`
        }
        if (item instanceof PaymentV2) {
          return `${
            isSending(item) ? '-' : '+'
          }${item.totalAmount.floatBalance.toString()}`
        }
        const pendingTxn = item as PendingTransaction
        if (pendingTxn.txn !== undefined) {
          if (pendingTxn.txn.type === 'add_gateway_v1') {
            return animalHash((pendingTxn.txn as AddGatewayV1).gateway)
          }
          return `-${pendingTxn.txn.fee.toLocaleString()}`
        }

        return ''
      },
      [isSending],
    )

    const time = useCallback((item: AnyTransaction | PendingTransaction) => {
      let val: Date
      const pending = item as PendingTransaction
      if (pending.txn !== undefined) {
        val = new Date(pending.createdAt)
      } else {
        val = fromUnixTime((item as AddGatewayV1).time)
      }

      if (val) {
        return formatDistanceToNow(val, {
          locale: shortLocale,
          addSuffix: true,
        })
      }

      return undefined
    }, [])

    const titles = useCallback(
      (item: AnyTransaction | PendingTransaction) => {
        if (!TxnTypeKeys.find((k) => k === item.type)) {
          return item.type
        }

        switch (item.type as TxnType) {
          case 'add_gateway_v1':
            return t('transactions.added')
          case 'payment_v1':
          case 'payment_v2':
            return isSending(item)
              ? t('transactions.sent')
              : t('transactions.received')
          case 'assert_location_v1':
            return t('transactions.location')
          case 'transfer_hotspot_v1':
            return t('transactions.transfer')
          case 'rewards_v1':
            return t('transactions.mining')
        }
      },
      [isSending, t],
    )

    const iconBackgroundColor = useCallback(
      (item: AnyTransaction | PendingTransaction) => {
        if (!TxnTypeKeys.find((k) => k === item.type)) {
          return colors.primaryBackground
        }

        switch (item.type as TxnType) {
          case 'transfer_hotspot_v1':
          case 'add_gateway_v1':
            return colors.purple100
          case 'payment_v1':
          case 'payment_v2':
            return isSending(item) ? colors.blueBright : colors.greenMain
          case 'assert_location_v1':
            return colors.purpleMuted
          case 'rewards_v1':
            return colors.purpleBright
        }
      },
      [isSending, colors],
    )

    const icon = useCallback(
      (item: AnyTransaction | PendingTransaction) => {
        if (!TxnTypeKeys.find((k) => k === item.type)) {
          return null
        }

        const size = 24
        switch (item.type as TxnType) {
          case 'transfer_hotspot_v1':
          case 'add_gateway_v1':
            return <HotspotAdded width={size} height={size} />
          case 'payment_v1':
          case 'payment_v2':
            return isSending(item) ? (
              <SentHnt width={size} height={size} />
            ) : (
              <ReceivedHnt width={size} height={size} />
            )
          case 'assert_location_v1':
            return <Location width={size} height={size} />
          case 'rewards_v1':
            return <Rewards width={size} height={size} />
        }
      },
      [isSending],
    )

    type Item = {
      item: AnyTransaction | PendingTransaction
      index: number
    }
    const renderItem = useCallback(
      ({ item, index }: Item) => {
        return (
          <ActivityItem
            isFirst={index === 0}
            isLast={index === transactionData.length - 1}
            backgroundColor={iconBackgroundColor(item)}
            icon={icon(item)}
            title={titles(item)}
            amount={amount(item)}
            time={time(item)}
          />
        )
      },
      [amount, icon, iconBackgroundColor, time, titles, transactionData.length],
    )

    const { dragMax, dragMid, dragMin } = animationPoints

    const onFilterChanged = (f: FilterType) => {
      flatListRef?.current?.scrollToOffset({ animated: false, offset: 0 })
      setFilter(f)
    }

    useEffect(() => {
      if (!transactionData.length) {
      }
    }, [transactionData.length])

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
          ListFooterComponent: () => {
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
