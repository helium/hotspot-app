import React, { useCallback } from 'react'
import { formatDistanceToNow, fromUnixTime } from 'date-fns'
import {
  RewardsV1,
  AddGatewayV1,
  AssertLocationV1,
  PaymentV2,
  PaymentV1,
  TransferHotspotV1,
  TokenBurnV1,
  AnyTransaction,
  PendingTransaction,
} from '@helium/http'
import { useTranslation } from 'react-i18next'
import animalHash from 'angry-purple-tiger'
import Balance, { DataCredits, NetworkTokens } from '@helium/currency'
import { useColors } from '../../../theme/themeHooks'
import { isPayer } from '../../../utils/transactions'
import Rewards from '../../../assets/images/rewards.svg'
import SentHnt from '../../../assets/images/sentHNT.svg'
import HotspotAdded from '../../../assets/images/hotspotAdded.svg'
import ReceivedHnt from '../../../assets/images/receivedHNT.svg'
import Location from '../../../assets/images/location.svg'
import Burn from '../../../assets/images/burn.svg'
import shortLocale from '../../../utils/formatDistance'

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

const useActivityItem = (address: string) => {
  const colors = useColors()
  const { t } = useTranslation()

  const isSending = useCallback(
    (item: AnyTransaction | PendingTransaction) => {
      return isPayer(address, item)
    },
    [address],
  )

  const backgroundColor = useCallback(
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
    [colors, isSending],
  )

  const title = useCallback(
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

  const isFee = useCallback(
    (item: AnyTransaction | PendingTransaction) => {
      if (item instanceof PaymentV1 || item instanceof PaymentV2) {
        return isSending(item)
      }

      if (item instanceof RewardsV1) {
        return false
      }

      return true
    },
    [isSending],
  )

  const formatAmount = (
    fee: boolean,
    amount?: Balance<DataCredits | NetworkTokens> | number,
  ) => {
    if (!amount) return ''

    if (typeof amount === 'number') {
      if (amount === 0) return amount
      return `${fee ? '-' : '+'}${amount.toLocaleString()}`
    }

    if (amount?.floatBalance === 0) return amount.toString()

    return `${fee ? '-' : '+'}${amount?.toString()}`
  }

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
        return formatAmount(isFee(item), item.fee)
      }
      if (item instanceof RewardsV1) {
        return formatAmount(isFee(item), item.totalAmount)
      }
      if (item instanceof PaymentV1) {
        return formatAmount(isFee(item), item.amount)
      }
      if (item instanceof PaymentV2) {
        return formatAmount(isFee(item), item.totalAmount)
      }
      const pendingTxn = item as PendingTransaction
      if (pendingTxn.txn !== undefined) {
        if (pendingTxn.txn.type === 'add_gateway_v1') {
          return animalHash((pendingTxn.txn as AddGatewayV1).gateway)
        }
        return formatAmount(isFee(item), pendingTxn.txn.fee)
      }

      return ''
    },
    [isFee],
  )

  const time = useCallback(
    (item: AnyTransaction | PendingTransaction) => {
      const pending = item as PendingTransaction
      if (pending.status === 'pending') {
        return t('transations.pending')
      }
      const val = fromUnixTime((item as AddGatewayV1).time)
      return formatDistanceToNow(val, {
        locale: shortLocale,
        addSuffix: true,
      })
    },
    [t],
  )

  const snapHeight = useCallback(
    (item: AnyTransaction | PendingTransaction) => {
      if (!TxnTypeKeys.find((k) => k === item.type)) {
        return 0
      }

      switch (item.type as TxnType) {
        case 'add_gateway_v1':
          return 300
        case 'payment_v1':
        case 'payment_v2':
          return isSending(item) ? 509 : 480
        case 'assert_location_v1':
          return 300
        case 'transfer_hotspot_v1':
          return 300
        case 'rewards_v1':
          return 665
        case 'token_burn_v1':
          return 300
      }
    },
    [isSending],
  )

  return { backgroundColor, title, icon, amount, time, snapHeight, isFee }
}

export default useActivityItem
