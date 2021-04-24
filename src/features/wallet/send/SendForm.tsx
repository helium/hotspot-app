import React from 'react'
import { ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Account } from '@helium/http'
import Button from '../../../components/Button'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import LockedHeader from '../../../components/LockedHeader'
import { SendTransfer, SendType, SendTransferUpdate } from './sendTypes'
import SendTransferForm from './SendTransferForm'
import { Transfer } from '../../hotspots/transfers/TransferRequests'

type Props = {
  account?: Account
  hasSufficientBalance?: boolean
  hasValidActivity?: boolean
  isLocked: boolean
  isSeller?: boolean
  isValid: boolean
  lastReportedActivity?: string
  onScanPress: () => void
  onSubmit: () => void
  sendTransfers: Array<SendTransfer>
  stalePocBlockCount?: number
  transferData?: Transfer
  type: SendType
  unlockForm: () => void
  updateTransfer: (transferId: string, updates: SendTransferUpdate) => void
}

const SendForm = ({
  account,
  hasSufficientBalance,
  hasValidActivity,
  isLocked,
  isSeller,
  isValid,
  lastReportedActivity,
  onScanPress,
  onSubmit,
  sendTransfers,
  stalePocBlockCount,
  transferData,
  type,
  unlockForm,
  updateTransfer,
}: Props) => {
  const { t } = useTranslation()

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

  return (
    <Box height="100%" justifyContent="space-between" paddingBottom="xl">
      <ScrollView contentContainerStyle={{ marginTop: 16 }}>
        {isLocked && (
          <LockedHeader
            onClosePress={unlockForm}
            allowClose={type !== 'dc_burn'}
          />
        )}
        {sendTransfers.map((sendTransfer) => (
          <SendTransferForm
            key={sendTransfer.id}
            account={account}
            isLocked={isLocked}
            isSeller={isSeller}
            lastReportedActivity={lastReportedActivity}
            onScanPress={onScanPress}
            sendTransfer={sendTransfer}
            transferData={transferData}
            type={type}
            updateTransfer={updateTransfer}
          />
        ))}
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

export default SendForm
