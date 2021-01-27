import React, { useCallback } from 'react'
import { format, formatDistanceToNow, fromUnixTime } from 'date-fns'
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
import Balance, { DataCredits, NetworkTokens } from '@helium/currency'
import { startCase } from 'lodash'
import { useColors } from '../../../theme/themeHooks'
import { isPayer } from '../../../utils/transactions'
import Rewards from '../../../assets/images/rewards.svg'
import SentHnt from '../../../assets/images/sentHNT.svg'
import HotspotAdded from '../../../assets/images/hotspotAdded.svg'
import HotspotTransfer from '../../../assets/images/hotspotTransfer.svg'
import ReceivedHnt from '../../../assets/images/receivedHNT.svg'
import Location from '../../../assets/images/location.svg'
import Burn from '../../../assets/images/burn.svg'
import shortLocale from '../../../utils/formatDistance'
import { useFees } from '../../../utils/fees'
import { hp } from '../../../utils/layout'

export const TxnTypeKeys = [
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
  const { feeToHNT } = useFees()

  const isSending = useCallback(
    (item: AnyTransaction | PendingTransaction) => {
      return isPayer(address, item)
    },
    [address],
  )

  const isSelling = useCallback(
    (item: AnyTransaction | PendingTransaction) =>
      (item as TransferHotspotV1).seller === address,
    [address],
  )

  const backgroundColorKey = useCallback(
    (item: AnyTransaction | PendingTransaction) => {
      if (!TxnTypeKeys.find((k) => k === item.type)) {
        return 'redMain'
      }

      switch (item.type as TxnType) {
        case 'transfer_hotspot_v1':
        case 'add_gateway_v1':
          return 'purple100'
        case 'payment_v1':
        case 'payment_v2':
          return isSending(item) ? 'blueBright' : 'greenMain'
        case 'assert_location_v1':
          return 'purpleMuted'
        case 'rewards_v1':
          return 'purpleBright'
        case 'token_burn_v1':
          return 'orange'
      }
    },
    [isSending],
  )
  const backgroundColor = useCallback(
    (item: AnyTransaction | PendingTransaction) =>
      colors[backgroundColorKey(item)],
    [colors, backgroundColorKey],
  )

  const title = useCallback(
    (item: AnyTransaction | PendingTransaction) => {
      if (!TxnTypeKeys.find((k) => k === item.type)) {
        return startCase(item.type)
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
          return isSelling(item)
            ? t('transactions.transferSell')
            : t('transactions.transferBuy')
        case 'rewards_v1':
          return t('transactions.mining')
        case 'token_burn_v1':
          return t('transactions.burnHNT')
      }
    },
    [isSending, isSelling, t],
  )

  const detailIcon = useCallback(
    (item: AnyTransaction | PendingTransaction) => {
      switch (item.type as TxnType) {
        case 'transfer_hotspot_v1':
          return <HotspotTransfer height={20} width={50} />
        case 'payment_v1':
        case 'payment_v2':
          return isSending(item) ? (
            <SentHnt width={35} height={24} />
          ) : (
            <ReceivedHnt width={35} height={24} />
          )
        case 'assert_location_v1':
          return <Location width={20} height={23} />
        case 'rewards_v1':
          return <Rewards width={26} height={26} />
        case 'token_burn_v1':
          return <Burn width={23} height={28} />
        case 'add_gateway_v1':
        default:
          return <HotspotAdded width={20} height={20} />
      }
    },
    [isSending],
  )

  const listIcon = useCallback(
    (item: AnyTransaction | PendingTransaction) => {
      switch (item.type as TxnType) {
        case 'payment_v1':
        case 'payment_v2':
          return isSending(item) ? (
            <SentHnt width={32} height={18} />
          ) : (
            <ReceivedHnt width={32} height={18} />
          )
        case 'assert_location_v1':
          return <Location width={20} height={23} />
        case 'rewards_v1':
          return <Rewards width={26} height={26} />
        case 'token_burn_v1':
          return <Burn width={23} height={28} />
        case 'transfer_hotspot_v1':
        case 'add_gateway_v1':
        default:
          return <HotspotAdded width={20} height={20} />
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

      if (item instanceof TransferHotspotV1) {
        return (item as TransferHotspotV1).seller === address
      }

      return true
    },
    [isSending, address],
  )

  const formatAmount = (
    fee: boolean,
    amount?: Balance<DataCredits | NetworkTokens> | number,
  ) => {
    if (!amount) return ''

    if (typeof amount === 'number') {
      if (amount === 0) return '0'
      return `${fee ? '-' : '+'}${amount.toLocaleString()}`
    }

    if (amount?.floatBalance === 0) return amount.toString()

    return `${fee ? '-' : '+'}${amount?.toString(8)}`
  }

  const fee = useCallback(
    (item: AnyTransaction | PendingTransaction) => {
      if (item instanceof RewardsV1) {
        return ''
      }

      if (item instanceof TransferHotspotV1) {
        if (!isSelling(item)) return ''
      }

      if (item instanceof AddGatewayV1) {
        return formatAmount(true, item.fee)
      }

      if (item instanceof TransferHotspotV1) {
        return formatAmount(true, item.fee)
      }

      if (item instanceof AssertLocationV1 || item instanceof TokenBurnV1) {
        return formatAmount(true, item.fee)
      }

      if (item instanceof PaymentV1) {
        if (address !== item.payer) return ''
        return formatAmount(true, item.fee)
      }

      if (item instanceof PaymentV2) {
        if (address !== item.payer) return ''
        return formatAmount(true, item.fee)
      }

      const pendingTxn = item as PendingTransaction
      if (pendingTxn.txn !== undefined) {
        return formatAmount(true, pendingTxn.txn.fee)
      }
      return (item as AddGatewayV1).fee?.toString(8) || ''
    },
    [address, isSelling],
  )

  const amount = useCallback(
    (item: AnyTransaction | PendingTransaction) => {
      if (item instanceof TransferHotspotV1) {
        return formatAmount(!isSelling(item), feeToHNT(item.amountToSeller))
      }
      if (item instanceof AssertLocationV1 || item instanceof AddGatewayV1) {
        return formatAmount(true, item.stakingFee)
      }
      if (item instanceof TokenBurnV1) {
        return formatAmount(true, item.amount)
      }
      if (item instanceof RewardsV1) {
        return formatAmount(false, item.totalAmount)
      }
      if (item instanceof PaymentV1) {
        return formatAmount(item.payee === address, item.amount)
      }
      if (item instanceof PaymentV2) {
        if (item.payer === address) {
          return formatAmount(true, item.totalAmount)
        }

        const payment = item.payments.find((p) => p.payee === address)
        return formatAmount(false, payment?.amount)
      }

      const pendingTxn = item as PendingTransaction
      if (pendingTxn.txn !== undefined) {
        if (pendingTxn.txn.type === 'add_gateway_v1') {
          return formatAmount(true, (pendingTxn.txn as AddGatewayV1).stakingFee)
        }
        if (pendingTxn.txn.type === 'assert_location_v1') {
          return formatAmount(
            true,
            (pendingTxn.txn as AssertLocationV1).stakingFee,
          )
        }

        return formatAmount(isFee(item), pendingTxn.txn.fee)
      }
      return ''
    },
    [address, feeToHNT, isFee, isSelling],
  )

  const time = useCallback(
    (item: AnyTransaction | PendingTransaction, dateFormat?: string) => {
      const pending = item as PendingTransaction
      if (pending.status === 'pending') {
        return t('transations.pending')
      }
      const val = fromUnixTime((item as AddGatewayV1).time)

      if (!dateFormat)
        return formatDistanceToNow(val, {
          locale: shortLocale,
          addSuffix: true,
        })
      return format(val, dateFormat)
    },
    [t],
  )

  const snapHeight = useCallback(
    (item: AnyTransaction | PendingTransaction) => {
      const maxHeight = hp(75)
      const desiredHeight = (() => {
        switch (item.type as TxnType) {
          case 'payment_v1':
          case 'payment_v2':
            return isSending(item) ? 509 : 480
          case 'transfer_hotspot_v1':
            return 566
          case 'rewards_v1':
            return 665
          case 'token_burn_v1':
            return 517
          case 'assert_location_v1':
          case 'add_gateway_v1':
          default:
            return 523
        }
      })()

      return Math.min(maxHeight, desiredHeight)
    },
    [isSending],
  )

  return {
    backgroundColor,
    backgroundColorKey,
    title,
    listIcon,
    detailIcon,
    amount,
    time,
    snapHeight,
    isFee,
    fee,
  }
}

export default useActivityItem
