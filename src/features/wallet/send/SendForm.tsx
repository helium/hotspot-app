import React from 'react'
import { ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Account } from '@helium/http'
import Button from '../../../components/Button'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import LockedHeader from '../../../components/LockedHeader'
import { SendDetails, SendType, SendDetailsUpdate } from './sendTypes'
import SendDetailsForm from './SendDetailsForm'
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
  sendDetails: Array<SendDetails>
  stalePocBlockCount?: number
  transferData?: Transfer
  type: SendType
  unlockForm: () => void
  updateSendDetails: (detailsId: string, updates: SendDetailsUpdate) => void
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
  sendDetails,
  stalePocBlockCount,
  transferData,
  type,
  unlockForm,
  updateSendDetails,
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
        {sendDetails.map((details) => (
          <SendDetailsForm
            key={details.id}
            account={account}
            isLocked={isLocked}
            isSeller={isSeller}
            lastReportedActivity={lastReportedActivity}
            onScanPress={onScanPress}
            sendDetails={details}
            transferData={transferData}
            type={type}
            updateSendDetails={updateSendDetails}
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
