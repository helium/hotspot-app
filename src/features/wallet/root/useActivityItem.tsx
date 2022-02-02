import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { format, formatDistanceToNow, fromUnixTime } from 'date-fns'
import { useTranslation } from 'react-i18next'
import Balance, {
  CurrencyType,
  DataCredits,
  NetworkTokens,
} from '@helium/currency'
import { startCase } from 'lodash'
import { useSelector } from 'react-redux'
import animalName from 'angry-purple-tiger'
import { useColors } from '../../../theme/themeHooks'
import Rewards from '../../../assets/images/rewards.svg'
import SentHnt from '../../../assets/images/sentHNT.svg'
import HotspotAdded from '../../../assets/images/hotspotAdded.svg'
import HotspotTransfer from '../../../assets/images/hotspotTransfer.svg'
import ReceivedHnt from '../../../assets/images/receivedHNT.svg'
import Location from '../../../assets/images/location.svg'
import Burn from '../../../assets/images/burn.svg'
import StakeValidator from '../../../assets/images/stake_validator.svg'
import UnstakeValidator from '../../../assets/images/unstake_validator.svg'
import TransferStakeValidator from '../../../assets/images/transfer_validator_stake.svg'
import shortLocale from '../../../utils/formatDistance'
import { decimalSeparator, groupSeparator } from '../../../utils/i18n'
import useCurrency from '../../../utils/useCurrency'
import { Colors } from '../../../theme/theme'
import { getMakerName } from '../../../utils/stakingClient'
import { RootState } from '../../../store/rootReducer'
import {
  HttpPendingTransaction,
  HttpTransaction,
} from '../../../store/activity/activitySlice'
import { TxnTypeKeys } from './walletTypes'

type TxnDisplayVals = {
  backgroundColor: string
  backgroundColorKey: Colors
  title: string
  subtitle: string
  listIcon?: JSX.Element
  detailIcon?: JSX.Element
  amount: string
  time: string
  isFee: boolean
  fee: string
  feePayer: string
  hash: string
}

const hntBalance = (v: number | undefined | null) => {
  if (v === undefined || v === null) return v
  return new Balance(v, CurrencyType.networkToken)
}

const dcBalance = (v: number | undefined | null) => {
  if (v === undefined || v === null) return v
  return new Balance(v, CurrencyType.dataCredit)
}

export const isPendingTransaction = (
  item: unknown,
): item is HttpPendingTransaction =>
  (item as HttpPendingTransaction)?.txn !== undefined

const useActivityItem = (
  item: HttpTransaction | HttpPendingTransaction,
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
    subtitle: '',
    hash: '',
  })
  const { hntBalanceToDisplayVal } = useCurrency()
  const colors = useColors()
  const { t } = useTranslation()
  const makers = useSelector((state: RootState) => state.heliumData.makers)
  const blockHeight = useSelector(
    (state: RootState) => state.heliumData.blockHeight,
  )

  const txn = useMemo(() => {
    if (isPendingTransaction(item)) return item.txn

    return item
  }, [item])

  const isSending = useMemo(() => txn.payer === address, [address, txn.payer])

  const isSelling = useMemo(() => {
    if (txn.seller) return txn.seller === address // for transfer_v1
    if (txn.owner) return txn.owner === address
    return undefined
  }, [address, txn.seller, txn.owner])

  const backgroundColorKey = useMemo(() => {
    if (!TxnTypeKeys.find((k) => k === item.type)) {
      return 'redMain'
    }

    switch (item.type) {
      case 'transfer_hotspot_v1':
      case 'transfer_hotspot_v2':
      case 'add_gateway_v1':
        return 'purple100'
      case 'payment_v1':
      case 'payment_v2':
        return isSending ? 'blueBright' : 'greenMain'
      case 'assert_location_v1':
      case 'assert_location_v2':
        return 'purpleMuted'
      case 'rewards_v1':
      case 'rewards_v2':
      case 'stake_validator_v1':
      case 'transfer_validator_stake_v1':
        return 'purpleBright'
      case 'token_burn_v1':
        return 'orange'
      case 'unstake_validator_v1':
        return 'greenBright'
      default:
        return 'black'
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

    switch (item.type) {
      case 'add_gateway_v1':
        return t('transactions.added')
      case 'payment_v1':
      case 'payment_v2':
        return isSending ? t('transactions.sent') : t('transactions.received')
      case 'assert_location_v1':
        return t('transactions.location')
      case 'assert_location_v2':
        return t('transactions.location_v2')
      case 'transfer_hotspot_v1':
      case 'transfer_hotspot_v2':
        if (isSelling === undefined) return t('transactions.transferDefault')
        return isSelling
          ? t('transactions.transferSell')
          : t('transactions.transferBuy')
      case 'rewards_v1':
      case 'rewards_v2':
        return t('transactions.mining')
      case 'token_burn_v1':
        return t('transactions.burnHNT')
      case 'stake_validator_v1':
        return t('transactions.stakeValidator')
      case 'unstake_validator_v1':
        return t('transactions.unstakeValidator')
      case 'transfer_validator_stake_v1':
        return t('transactions.transferValidator')
    }
  }, [isSending, isSelling, t, item])

  const detailIcon = useMemo(() => {
    switch (item.type) {
      case 'stake_validator_v1':
        return <StakeValidator width={40} />
      case 'unstake_validator_v1':
        return <UnstakeValidator width={40} />
      case 'transfer_validator_stake_v1':
        return <TransferStakeValidator width={40} />
      case 'transfer_hotspot_v1':
      case 'transfer_hotspot_v2':
        return <HotspotTransfer height={20} width={50} />
      case 'payment_v1':
      case 'payment_v2':
        return isSending ? (
          <SentHnt width={35} height={24} />
        ) : (
          <ReceivedHnt width={35} height={24} />
        )
      case 'assert_location_v1':
      case 'assert_location_v2':
        return <Location width={20} height={23} color="white" />
      case 'rewards_v1':
      case 'rewards_v2':
        return <Rewards width={26} height={26} />
      case 'token_burn_v1':
        return <Burn width={23} height={28} />
      case 'add_gateway_v1':
      default:
        return <HotspotAdded width={20} height={20} />
    }
  }, [isSending, item.type])

  const listIcon = useMemo(() => {
    switch (item.type) {
      case 'stake_validator_v1':
        return <StakeValidator width={32} />
      case 'unstake_validator_v1':
        return <UnstakeValidator width={32} />
      case 'transfer_validator_stake_v1':
        return <TransferStakeValidator width={32} />
      case 'payment_v1':
      case 'payment_v2':
        return isSending ? (
          <SentHnt width={32} height={18} />
        ) : (
          <ReceivedHnt width={32} height={18} />
        )
      case 'assert_location_v1':
      case 'assert_location_v2':
        return <Location width={20} height={23} color="white" />
      case 'rewards_v1':
      case 'rewards_v2':
        return <Rewards width={26} height={26} />
      case 'token_burn_v1':
        return <Burn width={23} height={28} />
      case 'transfer_hotspot_v1':
      case 'transfer_hotspot_v2':
      case 'add_gateway_v1':
      default:
        return <HotspotAdded width={20} height={20} />
    }
  }, [isSending, item.type])

  const isFee = useMemo(() => {
    // TODO: Determine if TransferStakeV1 is a fee
    if (item.type === 'payment_v1' || item.type === 'payment_v2') {
      return isSending
    }

    if (
      item.type === 'rewards_v1' ||
      item.type === 'rewards_v2' ||
      item.type === 'unstake_validator_v1'
    ) {
      return false
    }

    if (
      item.type === 'transfer_hotspot_v1' ||
      item.type === 'transfer_hotspot_v2'
    ) {
      return isSelling
    }

    return true
  }, [item.type, isSending, isSelling])

  const formatAmount = useCallback(
    async (
      prefix: '-' | '+',
      amount?: Balance<DataCredits | NetworkTokens> | null,
    ): Promise<string> => {
      if (!amount) return ''

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
    if (item.type === 'rewards_v1' || item.type === 'rewards_v2') {
      return ''
    }

    if (
      item.type === 'transfer_hotspot_v1' ||
      item.type === 'transfer_hotspot_v2'
    ) {
      if (!isSelling) return ''

      return formatAmount('-', dcBalance(txn.fee))
    }

    if (
      item.type === 'add_gateway_v1' ||
      item.type === 'assert_location_v1' ||
      item.type === 'assert_location_v2' ||
      item.type === 'token_burn_v1'
    ) {
      return formatAmount('-', dcBalance(txn.fee))
    }

    if (item.type === 'payment_v1' || item.type === 'payment_v2') {
      if (address !== txn.payer) return ''
      return formatAmount('-', dcBalance(txn.fee))
    }

    return formatAmount('-', dcBalance(txn.fee))
  }, [address, formatAmount, isSelling, item.type, txn.fee, txn.payer])

  const feePayer = useMemo(() => {
    if (
      item.type === 'add_gateway_v1' ||
      item.type === 'assert_location_v2' ||
      item.type === 'assert_location_v1'
    ) {
      return getMakerName(txn.payer, makers)
    }
    return ''
  }, [item.type, makers, txn.payer])

  const amount = useMemo(() => {
    switch (item.type) {
      case 'rewards_v1':
      case 'rewards_v2': {
        const rewardsAmount =
          txn.rewards?.reduce(
            (sum, current) =>
              sum.plus(new Balance(current.amount, CurrencyType.networkToken)),
            new Balance(0, CurrencyType.networkToken),
          ) || new Balance(0, CurrencyType.networkToken)
        return formatAmount('+', rewardsAmount)
      }
      case 'transfer_hotspot_v1':
      case 'transfer_hotspot_v2':
        return formatAmount(
          isSelling ? '+' : '-',
          hntBalance(txn.amountToSeller),
        )
      case 'assert_location_v1':
      case 'assert_location_v2':
      case 'add_gateway_v1':
        return formatAmount('-', dcBalance(txn.stakingFee))
      case 'stake_validator_v1':
        return formatAmount('-', hntBalance(txn.stake))
      case 'unstake_validator_v1':
        return formatAmount('+', hntBalance(txn.stakeAmount))
      case 'transfer_validator_stake_v1':
        return formatAmount(
          txn.payer === address ? '-' : '+',
          hntBalance(txn.stakeAmount),
        )
      case 'token_burn_v1':
        return formatAmount('-', hntBalance(txn.amount))
      case 'payment_v1':
        return formatAmount(
          txn.payer === address ? '-' : '+',
          hntBalance(txn.amount),
        )
      case 'payment_v2': {
        if (txn.payer === address) {
          const paymentTotal =
            txn.payments?.reduce(
              (sum, current) =>
                sum.plus(
                  new Balance(current.amount, CurrencyType.networkToken),
                ),
              new Balance(0, CurrencyType.networkToken),
            ) || new Balance(0, CurrencyType.networkToken)
          return formatAmount('-', paymentTotal)
        }

        const payment = txn.payments?.find((p) => p.payee === address)
        return formatAmount('+', hntBalance(payment?.amount))
      }
    }
  }, [address, formatAmount, isSelling, item.type, txn])

  const time = useMemo(() => {
    if (isPendingTransaction(item)) {
      return t('transactions.pending')
    }
    const val = fromUnixTime(item.time)

    if (!dateFormat)
      return formatDistanceToNow(val, {
        locale: shortLocale,
        addSuffix: true,
      })
    return format(val, dateFormat)
    // add blockHeight to update time when block changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFormat, item, t, blockHeight])

  const subtitle = useMemo(() => {
    if (
      (item.type === 'assert_location_v1' ||
        item.type === 'assert_location_v2' ||
        item.type === 'add_gateway_v1') &&
      txn.gateway
    ) {
      return animalName(txn.gateway)
    }
    return ''
  }, [txn, item.type])

  useEffect(() => {
    const createTxnDisplayData = async () => {
      const amt = await amount
      const f = await fee
      const nextVals = {
        backgroundColor,
        backgroundColorKey,
        title,
        subtitle,
        listIcon,
        detailIcon,
        amount: amt,
        time,
        isFee,
        fee: f,
        feePayer,
        hash: txn.hash,
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
    subtitle,
    txn.hash,
  ])

  return displayValues
}

export default useActivityItem
