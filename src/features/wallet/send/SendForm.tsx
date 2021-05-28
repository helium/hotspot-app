import React from 'react'
import { ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Account } from '@helium/http'
import { some } from 'lodash'
import Balance, { NetworkTokens } from '@helium/currency'
import { DebouncedButton } from '../../../components/Button'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import LockedHeader from '../../../components/LockedHeader'
import { SendDetails, SendDetailsUpdate } from './sendTypes'
import SendDetailsForm from './SendDetailsForm'
import { Transfer } from '../../hotspots/transfers/TransferRequests'
import { AppLinkCategoryType } from '../../../providers/appLinkTypes'
import { decimalSeparator, groupSeparator } from '../../../utils/i18n'

type Props = {
  account?: Account
  fee: Balance<NetworkTokens>
  hasSufficientBalance?: boolean
  hasValidActivity?: boolean
  isLocked: boolean
  isLockedAddress: boolean
  isSeller?: boolean
  isValid: boolean
  lastReportedActivity?: string
  onScanPress: () => void
  onSubmit: () => void
  sendDetails: Array<SendDetails>
  stalePocBlockCount?: number
  transferData?: Transfer
  type: AppLinkCategoryType
  unlockForm: () => void
  updateSendDetails: (detailsId: string, updates: SendDetailsUpdate) => void
}

const SendForm = ({
  account,
  fee,
  hasSufficientBalance,
  hasValidActivity,
  isLocked,
  isLockedAddress,
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

  const shouldShowFee = some(sendDetails, ({ amount }) => amount)

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
            fee={fee}
            isLocked={isLocked}
            isLockedAddress={isLockedAddress}
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
      <DebouncedButton
        onPress={onSubmit}
        title={getButtonTitle()}
        variant="primary"
        mode="contained"
        disabled={!isValid}
      />
      {shouldShowFee && <FeeFooter fee={fee} />}
    </Box>
  )
}

const FeeFooter = ({ fee }: { fee: Balance<NetworkTokens> }) => {
  const { t } = useTranslation()
  return (
    <Box marginTop="m">
      <Text variant="mono" color="grayText" alignSelf="center" fontSize={11}>
        +{fee.toString(8, { decimalSeparator, groupSeparator })}{' '}
        {t('generic.fee').toUpperCase()}
      </Text>
    </Box>
  )
}

export default SendForm
