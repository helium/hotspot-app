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
  TokenBurnV1,
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
import usePrevious from '../../../utils/usePrevious'
import Burn from '../../../assets/images/burn.svg'

const TxnTypeKeys = [
  'rewards_v1',
  'payment_v1',
  'payment_v2',
  'add_gateway_v1',
  'assert_location_v1',
  'transfer_hotspot_v1',
  'token_burn_v1',
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
    const [filter, setFilter] = useState<FilterType>('all')
    const prevFilter = usePrevious(filter)
    const { result: address } = useAsync(getSecureItem, ['address'])
    const colors = useColors()
    const { m, n_m } = useSpacing()
    const dispatch = useAppDispatch()
    const { t } = useTranslation()
    const {
      account: { txns },
    } = useSelector((state: RootState) => state)
    const prevStatus = usePrevious(txns[filter].status)

    useEffect(() => {
      dispatch(fetchTxns(filter))
      dispatch(fetchTxns('pending'))
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
      if (prevFilter !== filter) {
        dispatch(fetchTxns(filter))
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [prevFilter, filter])

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
          item instanceof TransferHotspotV1 ||
          item instanceof TokenBurnV1
        ) {
          if (!item.fee) return ''

          return `${
            item.fee.integerBalance !== 0 ? '-' : ''
          }${item.fee?.toString()}`
        }
        if (item instanceof RewardsV1) {
          return `+${item.totalAmount.toString()}`
        }
        if (item instanceof PaymentV1) {
          return `${isSending(item) ? '-' : '+'}${item.amount.toString()}`
        }
        if (item instanceof PaymentV2) {
          return `${isSending(item) ? '-' : '+'}${item.totalAmount.toString()}`
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
      const pending = item as PendingTransaction
      if (pending.status === 'pending') {
        return 'pending'
      }
      const val = fromUnixTime((item as AddGatewayV1).time)
      return formatDistanceToNow(val, {
        locale: shortLocale,
        addSuffix: true,
      })
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
          case 'token_burn_v1':
            return t('transactions.burnHNT')
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
          case 'token_burn_v1':
            return colors.orange
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
          case 'token_burn_v1':
            return <Burn width={size} height={size} />
        }
      },
      [isSending],
    )

    type Item = {
      item: AnyTransaction | PendingTransaction
      index: number
    }
    const renderItem = ({ item, index }: Item) => {
      return (
        <ActivityItem
          isFirst={index === 0}
          isLast={!!transactionData && index === transactionData.length - 1}
          backgroundColor={iconBackgroundColor(item)}
          icon={icon(item)}
          title={titles(item)}
          amount={amount(item)}
          time={time(item)}
        />
      )
    }

    const { dragMax, dragMid, dragMin } = animationPoints

    const onFilterChanged = useCallback((f: FilterType) => {
      setTransactionData([])
      setFilter(f)
    }, [])

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
          maxToRenderPerBatch: 30,
          initialNumToRender: 30,
          keyExtractor: (item: AnyTransaction | PendingTransaction) => {
            if (isPendingTransaction(item)) {
              return `${filter}.${(item as PendingTransaction).hash}`
            }

            return `${filter}.${(item as AddGatewayV1).hash}`
          },
          renderItem,
          ListFooterComponent: () => {
            if (txns[filter].status === 'pending' && !transactionData?.length) {
              return <ActivityIndicator />
            }
            if (
              txns[filter].status === 'fulfilled' &&
              transactionData &&
              transactionData.length === 0 &&
              prevStatus === 'fulfilled' &&
              prevFilter === filter
            ) {
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
          onEndReached: () => {
            dispatch(fetchTxns(filter))
          },
        }}
      />
    )
  },
)

export default memo(ActivityCard)
