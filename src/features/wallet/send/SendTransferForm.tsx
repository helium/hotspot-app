import React, { useEffect, useState } from 'react'
import { ActivityIndicator } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Address } from '@helium/crypto-react-native'
import { Account } from '@helium/http'
import Balance, { CurrencyType, NetworkTokens } from '@helium/currency'
import { useAsync } from 'react-async-hook'
import animalName from 'angry-purple-tiger'
import InputField from '../../../components/InputField'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import QrCode from '../../../assets/images/qr.svg'
import Check from '../../../assets/images/check.svg'
import { useColors } from '../../../theme/themeHooks'
import LockedField from '../../../components/LockedField'
import { SendTransfer, SendType } from './sendTypes'
import { Transfer } from '../../hotspots/transfers/TransferRequests'
import { decimalSeparator, groupSeparator, locale } from '../../../utils/i18n'
import { ensLookup } from '../../../utils/explorerClient'
import useHaptic from '../../../utils/useHaptic'
import {
  calculateBurnTxnFee,
  calculatePaymentTxnFee,
  calculateTransferTxnFee,
  useFees,
} from '../../../utils/fees'

type Props = {
  account?: Account
  isLocked: boolean
  isSeller?: boolean
  lastReportedActivity?: string
  onScanPress: () => void
  sendTransfer: SendTransfer
  transferData?: Transfer
  type: SendType
  updateTransfer: (transferId: number, updates: any) => void
}

const SendTransferForm = ({
  account,
  isLocked,
  isSeller,
  lastReportedActivity,
  onScanPress,
  sendTransfer,
  transferData,
  type,
  updateTransfer,
}: Props) => {
  // Hook init
  const { t } = useTranslation()
  const { feeToHNT } = useFees()
  const { triggerNavHaptic } = useHaptic()
  const { primaryMain } = useColors()

  // State init
  const [address, setAddress] = useState<string>(sendTransfer.address)
  const [addressAlias, setAddressAlias] = useState<string>(
    sendTransfer.addressAlias,
  )
  const [addressLoading, setAddressLoading] = useState(
    sendTransfer.addressLoading,
  )
  const [amount, setAmount] = useState<string>(sendTransfer.amount)
  const [balanceAmount, setBalanceAmount] = useState<Balance<NetworkTokens>>(
    sendTransfer.balanceAmount,
  )
  const [dcAmount, setDcAmount] = useState<string>(sendTransfer.dcAmount)
  const [memo, setMemo] = useState<string>(sendTransfer.memo)
  const [fee, setFee] = useState<Balance<NetworkTokens>>(sendTransfer.fee)

  useEffect(() => {
    updateTransfer(sendTransfer.id, {
      address,
      balanceAmount,
      memo,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, balanceAmount, memo])

  // Set address alias if necessary
  useAsync(async () => {
    if (address.match(/.*\.eth$/)) {
      setAddressLoading(true)
      const { address: ensAddress } = await ensLookup(address)
      if (ensAddress) {
        setAddressAlias(address)
        setAddress(ensAddress)
        setAddressLoading(false)
        return
      }
    }
    setAddressLoading(false)
    setAddressAlias('')
  }, [address])

  // Update the internal HNT amount based on form input
  useEffect(() => {
    const hntBalance = Balance.fromFloat(
      parseFloat(amount),
      CurrencyType.networkToken,
    )
    setBalanceAmount(hntBalance)
  }, [amount])

  // Update the required fee if HNT amount changes
  useAsync(async () => {
    updateFee()
  }, [balanceAmount, transferData?.amountToSeller])

  const getNonce = (): number => {
    if (!account?.speculativeNonce) return 1
    return account.speculativeNonce + 1
  }

  const updateFee = async () => {
    let dcFee
    if (type === 'payment') {
      dcFee = await calculatePaymentTxnFee(
        balanceAmount.integerBalance,
        getNonce(),
        address,
      )
    } else if (type === 'dc_burn') {
      dcFee = await calculateBurnTxnFee(
        balanceAmount.integerBalance,
        address,
        getNonce(),
        memo,
      )
    } else if (type === 'transfer') {
      dcFee = await calculateTransferTxnFee(transferData?.partialTransaction)
    } else {
      throw new Error('Unsupported transaction type')
    }
    const hntFee = feeToHNT(dcFee)
    setFee(hntFee)
  }

  // Helper to normalize direct "amount" input value
  const setFormAmount = (formAmount: string) => {
    if (formAmount === decimalSeparator || formAmount.includes('NaN')) {
      return setAmount(`0${decimalSeparator}`)
    }
    const rawInteger = (formAmount.split(decimalSeparator)[0] || formAmount)
      .split(groupSeparator)
      .join('')
    const integer = parseInt(rawInteger, 10).toLocaleString(locale)
    let decimal = formAmount.split(decimalSeparator)[1]
    if (integer === 'NaN') {
      return setAmount('')
    }
    if (decimal && decimal.length >= 9) decimal = decimal.slice(0, 8)
    setAmount(
      formAmount.includes(decimalSeparator)
        ? `${integer}${decimalSeparator}${decimal}`
        : integer,
    )
  }

  const setMaxAmount = () => {
    triggerNavHaptic()
    const balance = account?.balance
    if (!balance) return
    if (fee > balance) {
      const balanceStr = balance.toString(8, {
        decimalSeparator,
        groupSeparator,
        showTicker: false,
      })
      setAmount(balanceStr)
    } else {
      const maxAmount = balance.minus(fee)
      const maxAmountStr = maxAmount.toString(8, {
        decimalSeparator,
        groupSeparator,
        showTicker: false,
      })
      setAmount(maxAmountStr)
    }
  }

  const renderLockedPaymentForm = () => [
    <LockedField label={t('send.address.label')} value={address} />,
    <LockedField
      label={t('send.amount.label')}
      value={amount}
      footer={amount ? <FeeFooter fee={fee} /> : undefined}
      bottom
    />,
  ]

  const renderLockedBurnForm = () => [
    <LockedField label={t('send.address.label')} value={address} />,
    <LockedField
      label={t('send.amount.label')}
      value={amount}
      footer={amount ? <FeeFooter fee={fee} /> : undefined}
    />,
    <LockedField label={t('send.dcAmount.label')} value={dcAmount} />,
    <LockedField label={t('send.memo.label')} value={memo} bottom />,
  ]

  const renderPaymentForm = () => [
    <InputField
      defaultValue={address}
      onChange={setAddress}
      label={t('send.address.label')}
      placeholder={t('send.address.placeholder')}
      extra={
        <AddressExtra
          addressLoading={addressLoading}
          isValidAddress={Address.isValid(address)}
          onScanPress={onScanPress}
        />
      }
      footer={<AddressAliasFooter addressAlias={addressAlias} />}
    />,
    <InputField
      type="numeric"
      defaultValue={amount}
      onChange={setFormAmount}
      value={amount}
      label={t('send.amount.label')}
      placeholder={t('send.amount.placeholder')}
      extra={
        <TouchableOpacityBox onPress={setMaxAmount}>
          <Text fontSize={12} color="primaryMain">
            {t('send.sendMax')}
          </Text>
        </TouchableOpacityBox>
      }
      footer={amount ? <FeeFooter fee={fee} /> : undefined}
    />,
  ]

  const renderBurnForm = () => [
    <InputField
      defaultValue={address}
      onChange={setAddress}
      label={t('send.address.label')}
      placeholder={t('send.address.placeholder')}
      extra={
        Address.isValid(address) ? (
          <Box padding="s" position="absolute" right={0}>
            <Check />
          </Box>
        ) : (
          <TouchableOpacityBox
            onPress={onScanPress}
            padding="s"
            position="absolute"
            right={0}
          >
            <QrCode width={16} color={primaryMain} />
          </TouchableOpacityBox>
        )
      }
    />,
    <InputField
      type="numeric"
      defaultValue={amount}
      onChange={setAmount}
      value={amount}
      label={t('send.amount.label')}
      placeholder={t('send.amount.placeholder')}
      footer={amount ? <FeeFooter fee={fee} /> : undefined}
    />,
    <InputField
      type="numeric"
      defaultValue={dcAmount}
      onChange={setDcAmount}
      label={t('send.dcAmount.label')}
      placeholder={t('send.dcAmount.placeholder')}
    />,
    <InputField
      defaultValue={memo}
      onChange={setMemo}
      label={t('send.memo.label')}
      placeholder={t('send.memo.placeholder')}
    />,
  ]

  const renderSellerTransferForm = () => [
    <InputField
      defaultValue={address}
      onChange={setAddress}
      label={t('send.address.label_transfer')}
      placeholder={t('send.address.placeholder')}
      extra={
        Address.isValid(address) ? (
          <Box padding="s" position="absolute" right={0}>
            <Check />
          </Box>
        ) : (
          <TouchableOpacityBox
            onPress={onScanPress}
            padding="s"
            position="absolute"
            right={0}
          >
            <QrCode width={16} color={primaryMain} />
          </TouchableOpacityBox>
        )
      }
    />,
    <InputField
      type="numeric"
      defaultValue={amount}
      onChange={setFormAmount}
      value={amount}
      numberOfLines={2}
      label={t('send.amount.label_transfer')}
      placeholder={t('send.amount.placeholder_transfer')}
    />,
  ]

  const renderBuyerTransferForm = () => [
    <LockedField
      label={t('send.address.seller')}
      value={transferData?.seller || ''}
    />,
    <LockedField
      label={t('send.amount.label_transfer')}
      value={
        transferData?.amountToSeller?.floatBalance?.toLocaleString(locale) ||
        '0'
      }
      footer={<FeeFooter fee={fee} />}
    />,
    <LockedField
      label={t('send.hotspot_label')}
      value={transferData ? animalName(transferData.gateway) : ''}
      footer={
        <Text variant="mono" color="grayText" fontSize={11} paddingTop="xs">
          {t('send.last_activity', {
            activity: lastReportedActivity || t('transfer.unknown'),
          })}
        </Text>
      }
    />,
  ]

  return (
    <Box>
      {isLocked && type === 'payment' && renderLockedPaymentForm()}
      {isLocked && type === 'dc_burn' && renderLockedBurnForm()}
      {!isLocked && type === 'payment' && renderPaymentForm()}
      {!isLocked && type === 'dc_burn' && renderBurnForm()}
      {isSeller && type === 'transfer' && renderSellerTransferForm()}
      {!isSeller && type === 'transfer' && renderBuyerTransferForm()}
    </Box>
  )
}

const FeeFooter = ({ fee }: { fee: Balance<NetworkTokens> }) => {
  const { t } = useTranslation()
  return (
    <Box marginTop="xs">
      <Text variant="mono" color="grayText" fontSize={11}>
        +{fee.toString(8, { decimalSeparator, groupSeparator })}{' '}
        {t('generic.fee').toUpperCase()}
      </Text>
    </Box>
  )
}

const AddressAliasFooter = ({ addressAlias }: { addressAlias?: string }) => {
  if (!addressAlias) return null

  return (
    <Box marginTop="xs">
      <Text variant="mono" color="grayText" fontSize={11}>
        {addressAlias}
      </Text>
    </Box>
  )
}

type AddressExtraProps = {
  addressLoading?: boolean
  isValidAddress?: boolean
  onScanPress: () => void
}
const AddressExtra = ({
  addressLoading,
  isValidAddress,
  onScanPress,
}: AddressExtraProps) => {
  const colors = useColors()

  if (addressLoading) {
    return (
      <Box padding="s" position="absolute" right={0}>
        <ActivityIndicator color="gray" />
      </Box>
    )
  }
  if (isValidAddress) {
    return (
      <Box padding="s" position="absolute" right={0}>
        <Check />
      </Box>
    )
  }
  return (
    <TouchableOpacityBox
      onPress={onScanPress}
      padding="s"
      position="absolute"
      right={0}
    >
      <QrCode width={16} color={colors.primaryMain} />
    </TouchableOpacityBox>
  )
}

export default SendTransferForm
