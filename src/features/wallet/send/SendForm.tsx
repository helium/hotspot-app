import React from 'react'
import { ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Address } from '@helium/crypto-react-native'
import SendInput from './SendInput'
import Button from '../../../components/Button'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import QrCode from '../../../assets/images/qr.svg'
import Check from '../../../assets/images/check.svg'
import { useColors } from '../../../theme/themeHooks'
import SendLockedHeader from './SendLockedHeader'
import SendLockedField from './SendLockedField'
import { SendType } from './sendTypes'

type Props = {
  isLocked: boolean
  type: SendType
  address: string
  amount: string
  dcAmount: string
  memo: string
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
  isLocked,
  type,
  address,
  amount,
  dcAmount,
  memo,
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
      <SendLockedHeader onClosePress={onUnlock} />
      <SendLockedField label={t('send.address.label')} value={address} />
      <SendLockedField label={t('send.amount.label')} value={amount} bottom />
    </Box>
  )

  const renderLockedBurnForm = () => (
    <Box>
      <SendLockedHeader onClosePress={onUnlock} />
      <SendLockedField label={t('send.address.label')} value={address} />
      <SendLockedField label={t('send.amount.label')} value={amount} />
      <SendLockedField label={t('send.dcAmount.label')} value={dcAmount} />
      <SendLockedField label={t('send.memo.label')} value={memo} bottom />
    </Box>
  )

  const renderPaymentForm = () => (
    <Box>
      <SendInput
        type="address"
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
      <SendInput
        type="amount"
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
      />
    </Box>
  )

  const renderBurnForm = () => (
    <Box>
      <SendInput
        type="address"
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
      <SendInput
        type="amount"
        defaultValue={amount}
        onChange={onAmountChange}
        label={t('send.amount.label')}
        placeholder={t('send.amount.placeholder')}
      />
      <SendInput
        type="amount"
        defaultValue={dcAmount}
        onChange={onDcAmountChange}
        label={t('send.dcAmount.label')}
        placeholder={t('send.dcAmount.placeholder')}
      />
      <SendInput
        type="amount"
        defaultValue={memo}
        onChange={onMemoChange}
        label={t('send.memo.label')}
        placeholder={t('send.memo.placeholder')}
      />
    </Box>
  )

  return (
    <Box height="100%" justifyContent="space-between" paddingBottom="xl">
      <ScrollView contentInset={{ top: 16 }}>
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
        disabled={!isValidAddress} // TODO more validation
      />
    </Box>
  )
}

export default SendForm
