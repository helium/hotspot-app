import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Alert } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Address } from '@helium/crypto-react-native'
import { Account } from '@helium/http'
import Balance, { NetworkTokens } from '@helium/currency'
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
import { SendDetails, SendDetailsUpdate } from './sendTypes'
import { Transfer } from '../../hotspots/transfers/TransferRequests'
import { decimalSeparator, groupSeparator, locale } from '../../../utils/i18n'
import { ensLookup } from '../../../utils/explorerClient'
import {
  getDecimal,
  getInteger,
  stringAmountToBalance,
  getMemoBytesLeft,
  encodeMemoString,
} from '../../../utils/transactions'
import * as Logger from '../../../utils/logger'
import useHaptic from '../../../utils/useHaptic'
import { AppLinkCategoryType } from '../../../providers/appLinkTypes'
import {
  getHotspotDetails,
  getValidatorDetails,
} from '../../../utils/appDataClient'

type Props = {
  account?: Account
  fee: Balance<NetworkTokens>
  isLocked: boolean
  isLockedAddress: boolean
  isSeller?: boolean
  index: number
  lastReportedActivity?: string
  onScanPress: () => void
  setSendDisabled: (sendDisabled: boolean) => void
  sendDetails: SendDetails
  transferData?: Transfer
  type: AppLinkCategoryType
  updateSendDetails: (detailsId: string, updates: SendDetailsUpdate) => void
}

const SendDetailsForm = ({
  index,
  account,
  fee,
  isLocked,
  isLockedAddress,
  isSeller,
  lastReportedActivity,
  onScanPress,
  sendDetails,
  transferData,
  setSendDisabled,
  type,
  updateSendDetails,
}: Props) => {
  // Hook init
  const { t } = useTranslation()
  const { triggerNavHaptic } = useHaptic()
  const { primaryMain } = useColors()

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
  const [isHotspotAddress, setIsHotspotAddress] = useState<boolean>()

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
    setBalanceAmount(stringAmountToBalance(amount))
  }, [amount])

  // Helper to normalize direct "amount" input value
  const setFormAmount = (stringAmount: string) => {
    if (!stringAmount) {
      setAmount('')
      return
    }
    if (stringAmount === decimalSeparator) {
      setAmount(`0${decimalSeparator}`)
      return
    }
    const integerValue = getInteger(stringAmount)
    const integerValueAsBalance = stringAmountToBalance(integerValue)
    const formattedInteger = integerValueAsBalance.toString(undefined, {
      decimalSeparator,
      groupSeparator,
      showTicker: false,
    })
    const decimal = getDecimal(stringAmount)
    setAmount(
      stringAmount.includes(decimalSeparator)
        ? `${formattedInteger}${decimalSeparator}${decimal}`
        : formattedInteger,
    )
  }

  const setMaxAmount = async () => {
    triggerNavHaptic()

    const balance = account?.balance
    if (!balance) return

    try {
      if (fee > balance) {
        const balanceStr = balance.toString(8, {
          decimalSeparator,
          groupSeparator,
          showTicker: false,
        })
        setAmount(balanceStr)
        return
      }

      const maxAmount = balance.minus(fee)
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

  // set isHotspotAddress for default address
  useAsync(async () => {
    if (
      address !== undefined &&
      address !== '' &&
      isHotspotAddress === undefined
    ) {
      setAddressLoading(true)
      try {
        const hotspot = await getHotspotDetails(address)
        if (hotspot.address === address) {
          setIsHotspotAddress(true)
          setSendDisabled(true)
          setAddressLoading(false)
        }
      } catch (e) {
        setIsHotspotAddress(false)
        setAddressLoading(false)
      }
    }
  }, [])

  const handleAddressChange = useCallback((text: string) => {
    setIsHotspotAddress(false)
    setAddress(text)
  }, [])

  const onDoneEditingAddress = async () => {
    if (!Address.isValid(address)) return
    setAddressLoading(true)
    try {
      const hotspot = await getHotspotDetails(address)
      if (hotspot.address === address) {
        setIsHotspotAddress(true)
        setSendDisabled(true)
        setAddressLoading(false)
        return
      }
    } catch (e) {
      setIsHotspotAddress(false)
      setSendDisabled(false)
    }
    try {
      const validator = await getValidatorDetails(address)
      if (validator.address === address) {
        setIsHotspotAddress(true)
        setSendDisabled(true)
        setAddressLoading(false)
        return
      }
    } catch (e) {
      setIsHotspotAddress(false)
      setSendDisabled(false)
    }
    setAddressLoading(false)
  }

  const renderLockedPaymentForm = () => (
    <>
      <LockedField
        label={t('send.address.label')}
        value={address}
        isFirst={index !== 0}
      />
      <LockedField label={t('send.amount.label')} value={amount} />
      <LockedField
        label={t('send.memo.label')}
        value={memo}
        isLast
        footer={<MemoLengthCounter />}
      />
    </>
  )

  const renderLockedBurnForm = () => (
    <>
      <LockedField
        label={t('send.address.label')}
        value={address}
        isFirst={index !== 0}
      />
      <LockedField label={t('send.amount.label')} value={amount} />
      <LockedField label={t('send.dcAmount.label')} value={dcAmount} />
      <LockedField label={t('send.memo.label')} value={memo} isLast />
    </>
  )

  const renderPaymentForm = () => (
    <>
      {isLockedAddress ? (
        <LockedField label={t('send.address.label')} value={address} />
      ) : (
        <InputField
          isFirst
          defaultValue={address}
          onChange={handleAddressChange}
          onEndEditing={onDoneEditingAddress}
          label={t('send.address.label')}
          placeholder={t('send.address.placeholder')}
          extra={
            <AddressExtra
              addressLoading={addressLoading}
              isValidAddress={
                Address.isValid(address) &&
                isHotspotAddress !== undefined &&
                !isHotspotAddress
              }
              onScanPress={onScanPress}
            />
          }
          footer={
            <Box>
              <AddressAliasFooter addressAlias={addressAlias} />
              {isHotspotAddress && (
                <Text color="redMain" variant="body2">
                  {t('send.not_valid_address')}
                </Text>
              )}
            </Box>
          }
        />
      )}
      <InputField
        type="decimal-pad"
        testID="AmountInput"
        defaultValue={amount}
        onChange={setFormAmount}
        value={amount}
        label={t('send.amount.label')}
        placeholder={t('send.amount.placeholder')}
        extra={
          <TouchableOpacityBox onPress={setMaxAmount}>
            <Text fontSize={12} color="primaryMain" variant="body2">
              {t('send.sendMax')}
            </Text>
          </TouchableOpacityBox>
        }
      />
      <InputField
        defaultValue={memo}
        onChange={setMemo}
        label={t('send.memo.label')}
        placeholder={t('send.memo.placeholder')}
        footer={<MemoLengthCounter />}
        isLast
      />
    </>
  )

  const MemoLengthCounter = () => {
    if (!memo) return null
    const base64Memo = encodeMemoString(memo)
    const bytesLeft = getMemoBytesLeft(base64Memo)
    return (
      <Text
        variant="mono"
        color={bytesLeft.valid ? 'grayText' : 'redMedium'}
        fontSize={11}
        paddingTop="xs"
      >
        {bytesLeft.valid
          ? t('send.memo.bytes_left', { count: bytesLeft.numBytes })
          : t('send.memo.length_error')}
      </Text>
    )
  }

  const renderBurnForm = () => (
    <>
      {isLockedAddress ? (
        <LockedField label={t('send.address.label')} value={address} />
      ) : (
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
        />
      )}
      <InputField
        type="decimal-pad"
        defaultValue={amount}
        onChange={setAmount}
        value={amount}
        label={t('send.amount.label')}
        placeholder={t('send.amount.placeholder')}
      />
      <InputField
        type="numeric"
        defaultValue={dcAmount}
        onChange={setDcAmount}
        label={t('send.dcAmount.label')}
        placeholder={t('send.dcAmount.placeholder')}
      />
      <InputField
        defaultValue={memo}
        onChange={setMemo}
        label={t('send.memo.label')}
        placeholder={t('send.memo.placeholder')}
      />
    </>
  )

  const renderSellerTransferForm = () => (
    <InputField
      defaultValue={address}
      onChange={handleAddressChange}
      onEndEditing={onDoneEditingAddress}
      label={t('send.address.label_transfer')}
      placeholder={t('send.address.placeholder')}
      extra={
        <AddressExtra
          addressLoading={addressLoading}
          isValidAddress={
            Address.isValid(address) &&
            isHotspotAddress !== undefined &&
            !isHotspotAddress
          }
          onScanPress={onScanPress}
        />
      }
    />
  )

  const renderBuyerTransferForm = () => (
    <>
      <LockedField
        label={t('send.address.seller')}
        value={transferData?.seller || ''}
      />
      <LockedField
        label={t('send.amount.label_transfer')}
        value={
          transferData?.amountToSeller?.floatBalance?.toLocaleString(locale) ||
          '0'
        }
      />
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
      />
    </>
  )

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
