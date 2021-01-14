import React from 'react'
import { ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Address } from '@helium/crypto-react-native'
import Balance, { NetworkTokens } from '@helium/currency'
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
import { SendType } from './sendTypes'

type Props = {
  isValid: boolean
  isLocked: boolean
  type: SendType
  address: string
  amount: string
  dcAmount: string
  memo: string
  fee: Balance<NetworkTokens>
  onAddressChange: (text: string) => void
  onAmountChange: (text: string) => void
  onDcAmountChange: (text: string) => void
  onMemoChange: (text: string) => void
  onScanPress: () => void
  onSendMaxPress: () => void
  onSubmit: () => void
  onUnlock: () => void
}

const SendForm = ({
  isValid,
  isLocked,
  type,
  address,
  amount,
  dcAmount,
  memo,
  fee,
  onAddressChange,
  onAmountChange,
  onDcAmountChange,
  onMemoChange,
  onScanPress,
  onSendMaxPress,
  onSubmit,
  onUnlock,
}: Props) => {
  const { t } = useTranslation()
  const { primaryMain } = useColors()

  const isValidAddress = Address.isValid(address)

  const renderLockedPaymentForm = () => (
    <Box>
      <LockedHeader onClosePress={onUnlock} />
      <LockedField label={t('send.address.label')} value={address} />
      <LockedField
        label={t('send.amount.label')}
        value={amount}
        footer={amount ? <FeeFooter fee={fee} /> : undefined}
        bottom
      />
    </Box>
  )

  const renderLockedBurnForm = () => (
    <Box>
      <LockedHeader onClosePress={onUnlock} />
      <LockedField label={t('send.address.label')} value={address} />
      <LockedField
        label={t('send.amount.label')}
        value={amount}
        footer={amount ? <FeeFooter fee={fee} /> : undefined}
      />
      <LockedField label={t('send.dcAmount.label')} value={dcAmount} />
      <LockedField label={t('send.memo.label')} value={memo} bottom />
    </Box>
  )

  const renderPaymentForm = () => (
    <Box>
      <InputField
        defaultValue={address}
        onChange={onAddressChange}
        label={t('send.address.label')}
        placeholder={t('send.address.placeholder')}
        extra={
          isValidAddress ? (
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
      <InputField
        type="numeric"
        defaultValue={amount}
        onChange={onAmountChange}
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
      />
    </Box>
  )

  const renderBurnForm = () => (
    <Box>
      <InputField
        defaultValue={address}
        onChange={onAddressChange}
        label={t('send.address.label')}
        placeholder={t('send.address.placeholder')}
        extra={
          isValidAddress ? (
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
      <InputField
        type="numeric"
        defaultValue={amount}
        onChange={onAmountChange}
        label={t('send.amount.label')}
        placeholder={t('send.amount.placeholder')}
        footer={amount ? <FeeFooter fee={fee} /> : undefined}
      />
      <InputField
        type="numeric"
        defaultValue={dcAmount}
        onChange={onDcAmountChange}
        label={t('send.dcAmount.label')}
        placeholder={t('send.dcAmount.placeholder')}
      />
      <InputField
        defaultValue={memo}
        onChange={onMemoChange}
        label={t('send.memo.label')}
        placeholder={t('send.memo.placeholder')}
      />
    </Box>
  )

  return (
    <Box height="100%" justifyContent="space-between" paddingBottom="xl">
      <ScrollView contentContainerStyle={{ marginTop: 16 }}>
        {isLocked && type === 'payment' && renderLockedPaymentForm()}
        {isLocked && type === 'dc_burn' && renderLockedBurnForm()}
        {!isLocked && type === 'payment' && renderPaymentForm()}
        {!isLocked && type === 'dc_burn' && renderBurnForm()}
      </ScrollView>
      <Button
        onPress={onSubmit}
        title={
          type === 'payment'
            ? t('send.button.payment')
            : t('send.button.dcBurn')
        }
        variant="primary"
        mode="contained"
        disabled={!isValid}
      />
    </Box>
  )
}

const FeeFooter = ({ fee }: { fee: Balance<NetworkTokens> }) => {
  return (
    <Box marginTop="xs">
      <Text variant="mono" color="grayText" fontSize={11}>
        +{fee.toString(8)} FEE
      </Text>
    </Box>
  )
}

export default SendForm
