import React, { useEffect, useMemo } from 'react'
import { RouteProp, useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Box from '../../../components/Box'
import { SendStackParamList } from './sendTypes'
import SendView from './SendView'
import { RootState } from '../../../store/rootReducer'
import { RootNavigationProp } from '../../../navigation/main/tabTypes'

type Route = RouteProp<SendStackParamList, 'Send'>

type Props = {
  route?: Route
}

const SendScreen = ({ route }: Props) => {
  const { t } = useTranslation()
  const rootNavigation = useNavigation<RootNavigationProp>()
  const scanResult = route?.params?.scanResult
  const hotspotAddress = route?.params?.hotspotAddress
  const isSeller = route?.params?.isSeller
  const isPinVerified = route?.params?.pinVerified
  const isPinRequiredForPayment = useSelector(
    (state: RootState) => state.app.isPinRequiredForPayment,
  )
  const isDeployModeEnabled = useSelector(
    (state: RootState) => state.app.isDeployModeEnabled,
  )
  const permanentPaymentAddress = useSelector(
    (state: RootState) => state.app.permanentPaymentAddress,
  )
  // If "Deploy Mode" is enabled, only allow payment transactions
  const type = isDeployModeEnabled ? 'payment' : route?.params?.type
  // If "Deploy Mode" is enabled without a permanent payment address, disable all payments
  const isDeployModePaymentsDisabled =
    isDeployModeEnabled && !permanentPaymentAddress

  useEffect(() => {
    // Check if pin is required, show lock screen if so
    if (isPinRequiredForPayment && !isPinVerified) {
      setTimeout(() => {
        rootNavigation.push('LockScreen', { requestType: 'send' })
      }, 300)
    }
  }, [isPinRequiredForPayment, isPinVerified, rootNavigation])

  useEffect(() => {
    if (isPinVerified === 'fail') {
      rootNavigation.goBack()
    }
  }, [isPinVerified, rootNavigation])

  const canSubmit = useMemo(() => {
    if (!isPinRequiredForPayment) return true
    return isPinVerified === 'pass'
  }, [isPinRequiredForPayment, isPinVerified])

  return (
    <>
      <Box
        backgroundColor="white"
        flex={1}
        justifyContent="flex-start"
        alignContent="center"
        flexDirection="column"
      >
        <SendView
          scanResult={scanResult}
          sendType={type}
          hotspotAddress={hotspotAddress}
          isDisabled={isDeployModePaymentsDisabled}
          isSeller={isSeller}
          canSubmit={canSubmit}
          lockedPaymentAddress={permanentPaymentAddress}
          warning={
            isDeployModePaymentsDisabled
              ? t('send.deployModePaymentsDisabled')
              : undefined
          }
        />
      </Box>
    </>
  )
}

export default SendScreen
