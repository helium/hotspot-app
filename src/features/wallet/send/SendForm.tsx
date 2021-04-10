import React from 'react'
import { ActivityIndicator, ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Address } from '@helium/crypto-react-native'
import Balance, { NetworkTokens } from '@helium/currency'
import animalName from 'angry-purple-tiger'
import InputField from '../../../components/InputField'
import Button from '../../../components/Button'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import QrCode from '../../../assets/images/qr.svg'
import Check from '../../../assets/images/check.svg'
import { useColors } from '../../../theme/themeHooks'
import LockedHeader from '../../../components/LockedHeader'
import LockedField from '../../../components/LockedField'
import { SendTransfer, SendType } from './sendTypes'
import { Transfer } from '../../hotspots/transfers/TransferRequests'
import { decimalSeparator, groupSeparator, locale } from '../../../utils/i18n'

type Props = {
  isValid: boolean
  isLocked: boolean
  type: SendType
  sendTransfers: Array<SendTransfer>
  onAddressChange: (id: number, text: string) => void
  onAmountChange: (id: number, text: string) => void
  onDcAmountChange: (id: number, text: string) => void
  onMemoChange: (id: number, text: string) => void
  onScanPress: () => void
  onSendMaxPress: () => void
  onSubmit: () => void
  onUnlock: () => void
  isSeller?: boolean
  transferData?: Transfer
  lastReportedActivity?: string
  hasSufficientBalance?: boolean
  hasValidActivity?: boolean
  stalePocBlockCount?: number
}

const SendForm = ({
  isValid,
  isLocked,
  isSeller,
  type,
  sendTransfers,
  onAddressChange,
  onAmountChange,
  onDcAmountChange,
  onMemoChange,
  onScanPress,
  onSendMaxPress,
  onSubmit,
  onUnlock,
  transferData,
  lastReportedActivity,
  hasSufficientBalance,
  hasValidActivity,
  stalePocBlockCount,
}: Props) => {
  const { t } = useTranslation()
  const { primaryMain } = useColors()

  const getButtonTitle = () => {
    switch (type) {
      case 'payment':
        return t('send.button.payment')
      case 'dc_burn':
        return t('send.button.dcBurn')
      case 'transfer':
        return isSeller
          ? t('send.button.transfer_request')
          : t('send.button.transfer_complete')
    }
  }

  const renderLockedPaymentForm = () => (
    <Box>
      <LockedHeader onClosePress={onUnlock} />
      {sendTransfers.map(({ address, amount, fee }) => [
        <LockedField label={t('send.address.label')} value={address} />,
        <LockedField
          label={t('send.amount.label')}
          value={amount}
          footer={amount ? <FeeFooter fee={fee} /> : undefined}
          bottom
        />,
      ])}
    </Box>
  )

  const renderLockedBurnForm = () => (
    <Box>
      <LockedHeader onClosePress={onUnlock} allowClose={false} />
      {sendTransfers.map(({ address, amount, dcAmount, fee, memo }) => [
        <LockedField label={t('send.address.label')} value={address} />,
        <LockedField
          label={t('send.amount.label')}
          value={amount}
          footer={amount ? <FeeFooter fee={fee} /> : undefined}
        />,
        <LockedField label={t('send.dcAmount.label')} value={dcAmount} />,
        <LockedField label={t('send.memo.label')} value={memo} bottom />,
      ])}
    </Box>
  )

  const renderPaymentForm = () => (
    <Box>
      {sendTransfers.map(
        ({ id, address, addressAlias, addressLoading, amount, fee }) => [
          <InputField
            defaultValue={address}
            onChange={(newAddress) => onAddressChange(id, newAddress)}
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
            onChange={(newAmount) => onAmountChange(id, newAmount)}
            value={amount}
            label={t('send.amount.label')}
            placeholder={t('send.amount.placeholder')}
            extra={
              <TouchableOpacityBox onPress={onSendMaxPress}>
                <Text fontSize={12} color="primaryMain">
                  {t('send.sendMax')}
                </Text>
              </TouchableOpacityBox>
            }
            footer={amount ? <FeeFooter fee={fee} /> : undefined}
          />,
        ],
      )}
    </Box>
  )

  const renderBurnForm = () => (
    <Box>
      {sendTransfers.map(({ id, address, amount, dcAmount, fee, memo }) => [
        <InputField
          defaultValue={address}
          onChange={(newAddress) => onAddressChange(id, newAddress)}
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
          onChange={(newAmount) => onAmountChange(id, newAmount)}
          value={amount}
          label={t('send.amount.label')}
          placeholder={t('send.amount.placeholder')}
          footer={amount ? <FeeFooter fee={fee} /> : undefined}
        />,
        <InputField
          type="numeric"
          defaultValue={dcAmount}
          onChange={(newDcAmount) => onDcAmountChange(id, newDcAmount)}
          label={t('send.dcAmount.label')}
          placeholder={t('send.dcAmount.placeholder')}
        />,
        <InputField
          defaultValue={memo}
          onChange={(newMemo) => onMemoChange(id, newMemo)}
          label={t('send.memo.label')}
          placeholder={t('send.memo.placeholder')}
        />,
      ])}
    </Box>
  )

  const renderSellerTransferForm = () => (
    <Box>
      {sendTransfers.map(({ id, address, amount }) => [
        <InputField
          defaultValue={address}
          onChange={(newAddress) => onAddressChange(id, newAddress)}
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
          onChange={(newAmount) => onAmountChange(id, newAmount)}
          value={amount}
          numberOfLines={2}
          label={t('send.amount.label_transfer')}
          placeholder={t('send.amount.placeholder_transfer')}
        />,
      ])}
    </Box>
  )

  const renderBuyerTransferForm = () => (
    <Box>
      {sendTransfers.map(({ fee }) => [
        <LockedField
          label={t('send.address.seller')}
          value={transferData?.seller || ''}
        />,
        <LockedField
          label={t('send.amount.label_transfer')}
          value={
            transferData?.amountToSeller?.floatBalance?.toLocaleString(
              locale,
            ) || '0'
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
      ])}
    </Box>
  )

  return (
    <Box height="100%" justifyContent="space-between" paddingBottom="xl">
      <ScrollView contentContainerStyle={{ marginTop: 16 }}>
        {isLocked && type === 'payment' && renderLockedPaymentForm()}
        {isLocked && type === 'dc_burn' && renderLockedBurnForm()}
        {!isLocked && type === 'payment' && renderPaymentForm()}
        {!isLocked && type === 'dc_burn' && renderBurnForm()}
        {isSeller && type === 'transfer' && renderSellerTransferForm()}
        {!isSeller && type === 'transfer' && renderBuyerTransferForm()}
      </ScrollView>
      {hasValidActivity === false && (
        <Text
          variant="body3"
          color="redMedium"
          marginVertical="s"
          textAlign="center"
        >
          {t('send.stale_error', { blocks: stalePocBlockCount })}
        </Text>
      )}
      {!hasSufficientBalance && (
        <Text
          variant="body3"
          color="redMedium"
          marginVertical="s"
          textAlign="center"
        >
          {t('send.label_error')}
        </Text>
      )}
      <Button
        onPress={onSubmit}
        title={getButtonTitle()}
        variant="primary"
        mode="contained"
        disabled={!isValid}
      />
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

export default SendForm
