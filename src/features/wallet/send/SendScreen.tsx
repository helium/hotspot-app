import React, { useEffect, useMemo } from 'react'
import { RouteProp, useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
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
  const rootNavigation = useNavigation<RootNavigationProp>()
  const scanResult = route?.params?.scanResult
  const hotspotAddress = route?.params?.hotspotAddress
  const isSeller = route?.params?.isSeller
  const isPinVerified = route?.params?.pinVerified
  const isPinRequiredForPayment = useSelector(
    (state: RootState) => state.app.isPinRequiredForPayment,
  )
  const isSecureModeEnabled = useSelector(
    (state: RootState) => state.app.isSecureModeEnabled,
  )
  const permanentPaymentAddress = useSelector(
    (state: RootState) => state.app.permanentPaymentAddress,
  )
  // If "Secure Mode" is enabled, only allow payment transactions
  const type = isSecureModeEnabled ? 'payment' : route?.params?.type

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
    // If "Secure Mode" is enabled but no permant address was provided, disable all send actions
    if (isSecureModeEnabled && !permanentPaymentAddress) return false
    return isPinVerified === 'pass'
  }, [
    isPinRequiredForPayment,
    isPinVerified,
    isSecureModeEnabled,
    permanentPaymentAddress,
  ])

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
          isSeller={isSeller}
          canSubmit={canSubmit}
          lockedPaymentAddress={permanentPaymentAddress}
        />
      </Box>
    </>
  )
}

export default SendScreen
