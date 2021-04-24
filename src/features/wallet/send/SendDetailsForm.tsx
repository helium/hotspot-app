import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Address } from '@helium/crypto-react-native'
import { Account } from '@helium/http'
import Balance, {
  CurrencyType,
  DataCredits,
  NetworkTokens,
} from '@helium/currency'
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
import { SendDetails, SendType, SendDetailsUpdate } from './sendTypes'
import { Transfer } from '../../hotspots/transfers/TransferRequests'
import { useAppDispatch } from '../../../store/store'
import {
  fetchCurrentOraclePrice,
  fetchPredictedOraclePrice,
} from '../../../store/helium/heliumDataSlice'
import { decimalSeparator, groupSeparator, locale } from '../../../utils/i18n'
import { ensLookup } from '../../../utils/explorerClient'
import { formatAmountInput } from '../../../utils/transactions'
import * as Logger from '../../../utils/logger'
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
  sendDetails: SendDetails
  transferData?: Transfer
  type: SendType
  updateSendDetails: (detailsId: string, updates: SendDetailsUpdate) => void
}

const SendDetailsForm = ({
  account,
  isLocked,
  isSeller,
  lastReportedActivity,
  onScanPress,
  sendDetails,
  transferData,
  type,
  updateSendDetails,
}: Props) => {
  // Hook init
  const { t } = useTranslation()
  const { feeToHNT } = useFees()
  const { triggerNavHaptic } = useHaptic()
  const { primaryMain } = useColors()
  const dispatch = useAppDispatch()

  // State init
  const [address, setAddress] = useState<string>(sendDetails.address)
  const [addressAlias, setAddressAlias] = useState<string>(
    sendDetails.addressAlias,
  )
  const [addressLoading, setAddressLoading] = useState(
    sendDetails.addressLoading,
  )
  const [amount, setAmount] = useState<string>(sendDetails.amount)
  const [balanceAmount, setBalanceAmount] = useState<Balance<NetworkTokens>>(
    sendDetails.balanceAmount,
  )
  const [dcAmount, setDcAmount] = useState<string>(sendDetails.dcAmount)
  const [memo, setMemo] = useState<string>(sendDetails.memo)
  const [fee, setFee] = useState<Balance<NetworkTokens>>(sendDetails.fee)

  useEffect(() => {
    updateSendDetails(sendDetails.id, {
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
    await updateFee()
  }, [balanceAmount, transferData?.amountToSeller])

  const getNonce = (): number => {
    if (!account?.speculativeNonce) return 1
    return account.speculativeNonce + 1
  }

  const updateFee = async () => {
    await dispatch(fetchCurrentOraclePrice())
    await dispatch(fetchPredictedOraclePrice())
    const dcFee = await calculateFee()
    const hntFee = feeToHNT(dcFee)
    setFee(hntFee)
    return hntFee
  }

  const calculateFee = async (): Promise<Balance<DataCredits>> => {
    if (type === 'payment') {
      return calculatePaymentTxnFee(
        balanceAmount.integerBalance,
        getNonce(),
        address,
      )
    }

    if (type === 'dc_burn') {
      return calculateBurnTxnFee(
        balanceAmount.integerBalance,
        address,
        getNonce(),
        memo,
      )
    }

    if (type === 'transfer') {
      return calculateTransferTxnFee(transferData?.partialTransaction)
    }

    throw new Error('Unsupported transaction type')
  }

  // Helper to normalize direct "amount" input value
  const setFormAmount = (formAmount: string) => {
    const formattedAmount = formatAmountInput(formAmount)
    setAmount(formattedAmount)
  }

  const setMaxAmount = async () => {
    triggerNavHaptic()

    const balance = account?.balance
    if (!balance) return

    try {
      const currentFee = await updateFee()
      if (currentFee > balance) {
        const balanceStr = balance.toString(8, {
          decimalSeparator,
          groupSeparator,
          showTicker: false,
        })
        setAmount(balanceStr)
        return
      }

      const maxAmount = balance.minus(currentFee)
      const maxAmountStr = maxAmount.toString(8, {
        decimalSeparator,
        groupSeparator,
        showTicker: false,
      })
      setAmount(maxAmountStr)
    } catch (error) {
      Logger.error(error)
      Alert.alert(
        t('send.send_max_fee.error_title'),
        t('send.send_max_fee.error_description'),
      )
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
    <Box paddingBottom="l">
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

export default SendDetailsForm
