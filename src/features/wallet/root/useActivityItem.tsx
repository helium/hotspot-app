import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { format, formatDistanceToNow, fromUnixTime } from 'date-fns'
import {
  AddGatewayV1,
  AnyTransaction,
  AssertLocationV1,
  PaymentV1,
  PaymentV2,
  PendingTransaction,
  RewardsV1,
  TokenBurnV1,
  TransferHotspotV1,
} from '@helium/http'
import { useTranslation } from 'react-i18next'
import Balance, { DataCredits, NetworkTokens } from '@helium/currency'
import { startCase } from 'lodash'
import { useSelector } from 'react-redux'
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
import { decimalSeparator, groupSeparator, locale } from '../../../utils/i18n'
import useCurrency from '../../../utils/useCurrency'
import { Colors } from '../../../theme/theme'
import { getMakerName } from '../../../utils/stakingClient'
import { RootState } from '../../../store/rootReducer'

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

type TxnDisplayVals = {
  backgroundColor: string
  backgroundColorKey: Colors
  title: string
  listIcon?: JSX.Element
  detailIcon?: JSX.Element
  amount: string
  time: string
  isFee: boolean
  fee: string
  feePayer: string
}
const useActivityItem = (
  item: AnyTransaction | PendingTransaction,
  address: string,
  dateFormat?: string,
) => {
  const [displayValues, setDisplayValues] = useState<TxnDisplayVals>({
    backgroundColor: 'white',
    backgroundColorKey: 'white',
    title: '',
    amount: '',
    time: '',
    isFee: false,
    fee: '',
    feePayer: '',
  })
  const { hntBalanceToDisplayVal } = useCurrency()
  const colors = useColors()
  const { t } = useTranslation()
  const makers = useSelector((state: RootState) => state.heliumData.makers)
  const blockHeight = useSelector(
    (state: RootState) => state.heliumData.blockHeight,
  )

  const isSending = useMemo(() => {
    return isPayer(address, item)
  }, [address, item])

  const isSelling = useMemo(
    () => (item as TransferHotspotV1).seller === address,
    [address, item],
  )

  const backgroundColorKey = useMemo(() => {
    if (!TxnTypeKeys.find((k) => k === item.type)) {
      return 'redMain'
    }

    switch (item.type as TxnType) {
      case 'transfer_hotspot_v1':
      case 'add_gateway_v1':
        return 'purple100'
      case 'payment_v1':
      case 'payment_v2':
        return isSending ? 'blueBright' : 'greenMain'
      case 'assert_location_v1':
        return 'purpleMuted'
      case 'rewards_v1':
        return 'purpleBright'
      case 'token_burn_v1':
        return 'orange'
    }
  }, [isSending, item])

  const backgroundColor = useMemo(() => colors[backgroundColorKey], [
    colors,
    backgroundColorKey,
  ])

  const title = useMemo(() => {
    if (!TxnTypeKeys.find((k) => k === item.type)) {
      return startCase(item.type)
    }

    switch (item.type as TxnType) {
      case 'add_gateway_v1':
        return t('transactions.added')
      case 'payment_v1':
      case 'payment_v2':
        return isSending ? t('transactions.sent') : t('transactions.received')
      case 'assert_location_v1':
        return t('transactions.location')
      case 'transfer_hotspot_v1':
        return isSelling
          ? t('transactions.transferSell')
          : t('transactions.transferBuy')
      case 'rewards_v1':
        return t('transactions.mining')
      case 'token_burn_v1':
        return t('transactions.burnHNT')
    }
  }, [isSending, isSelling, t, item])

  const detailIcon = useMemo(() => {
    switch (item.type as TxnType) {
      case 'transfer_hotspot_v1':
        return <HotspotTransfer height={20} width={50} />
      case 'payment_v1':
      case 'payment_v2':
        return isSending ? (
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
  }, [isSending, item.type])

  const listIcon = useMemo(() => {
    switch (item.type as TxnType) {
      case 'payment_v1':
      case 'payment_v2':
        return isSending ? (
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
  }, [isSending, item.type])

  const isFee = useMemo(() => {
    if (item instanceof PaymentV1 || item instanceof PaymentV2) {
      return isSending
    }

    if (item instanceof RewardsV1) {
      return false
    }

    if (item instanceof TransferHotspotV1) {
      return (item as TransferHotspotV1).seller === address
    }

    return true
  }, [item, isSending, address])

  const formatAmount = useCallback(
    async (
      prefix: '-' | '+',
      amount?: Balance<DataCredits | NetworkTokens> | number,
    ): Promise<string> => {
      if (!amount) return ''

      if (typeof amount === 'number') {
        if (amount === 0) return '0'
        return `${prefix}${amount.toLocaleString(locale, {
          maximumFractionDigits: 8,
        })}`
      }

      if (amount?.floatBalance === 0) {
        return amount.toString(undefined, { groupSeparator, decimalSeparator })
      }

      if (amount instanceof Balance && amount.type.ticker === 'HNT') {
        const display = await hntBalanceToDisplayVal(amount, false, 8)
        return `${prefix}${display}`
      }

      return `${prefix}${amount?.toString(8, {
        groupSeparator,
        decimalSeparator,
      })}`
    },
    [hntBalanceToDisplayVal],
  )

  const fee = useMemo(async () => {
    if (item instanceof RewardsV1) {
      return ''
    }

    if (item instanceof TransferHotspotV1) {
      if (!isSelling) return ''

      return formatAmount('-', item.fee)
    }

    if (
      item instanceof AddGatewayV1 ||
      item instanceof AssertLocationV1 ||
      item instanceof TokenBurnV1
    ) {
      return formatAmount('-', item.fee)
    }

    if (item instanceof PaymentV1 || item instanceof PaymentV2) {
      if (address !== item.payer) return ''
      return formatAmount('-', item.fee)
    }

    const pendingTxn = item as PendingTransaction
    if (pendingTxn.txn !== undefined) {
      return formatAmount('-', pendingTxn.txn.fee)
    }

    return formatAmount('-', (item as AddGatewayV1).fee)
  }, [address, formatAmount, isSelling, item])

  const feePayer = useMemo(() => {
    if (item instanceof AddGatewayV1 || item instanceof AssertLocationV1) {
      return getMakerName(item.payer, makers)
    }
    return ''
  }, [item, makers])

  const amount = useMemo(() => {
    if (item instanceof TransferHotspotV1) {
      return formatAmount(isSelling ? '+' : '-', item.amountToSeller)
    }
    if (item instanceof AssertLocationV1 || item instanceof AddGatewayV1) {
      return formatAmount('-', item.stakingFee)
    }
    if (item instanceof TokenBurnV1) {
      return formatAmount('-', item.amount)
    }
    if (item instanceof RewardsV1) {
      return formatAmount('+', item.totalAmount)
    }
    if (item instanceof PaymentV1) {
      return formatAmount(item.payer === address ? '-' : '+', item.amount)
    }
    if (item instanceof PaymentV2) {
      if (item.payer === address) {
        return formatAmount('-', item.totalAmount)
      }

      const payment = item.payments.find((p) => p.payee === address)
      return formatAmount('+', payment?.amount)
    }

    const pendingTxn = item as PendingTransaction
    if (pendingTxn.txn !== undefined) {
      if (pendingTxn.type === 'add_gateway_v1') {
        return formatAmount('-', (pendingTxn.txn as AddGatewayV1).stakingFee)
      }
      if (pendingTxn.type === 'assert_location_v1') {
        return formatAmount(
          '-',
          (pendingTxn.txn as AssertLocationV1).stakingFee,
        )
      }
      if (pendingTxn.type === 'payment_v2') {
        const paymentV2 = pendingTxn.txn as PaymentV2
        if (paymentV2.payer === address) {
          return formatAmount('-', paymentV2.totalAmount)
        }

        const payment = paymentV2.payments.find((p) => p.payee === address)
        return formatAmount('+', payment?.amount)
      }

      return formatAmount(isFee ? '-' : '+', pendingTxn.txn.fee)
    }
    return ''
  }, [address, formatAmount, isFee, isSelling, item])

  const time = useMemo(() => {
    const pending = item as PendingTransaction
    if (pending.status === 'pending') {
      return t('transactions.pending')
    }
    const val = fromUnixTime((item as AddGatewayV1).time)

    if (!dateFormat)
      return formatDistanceToNow(val, {
        locale: shortLocale,
        addSuffix: true,
      })
    return format(val, dateFormat)
    // add blockHeight to update time when block changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFormat, item, t, blockHeight])

  useEffect(() => {
    const createTxnDisplayData = async () => {
      const amt = await amount
      const f = await fee
      const nextVals = {
        backgroundColor,
        backgroundColorKey,
        title,
        listIcon,
        detailIcon,
        amount: amt,
        time,
        isFee,
        fee: f,
        feePayer,
      } as TxnDisplayVals
      setDisplayValues(nextVals)
    }

    createTxnDisplayData()
  }, [
    amount,
    backgroundColor,
    backgroundColorKey,
    detailIcon,
    fee,
    isFee,
    listIcon,
    time,
    title,
    feePayer,
  ])

  return displayValues
}

export default useActivityItem
