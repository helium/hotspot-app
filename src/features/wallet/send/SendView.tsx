import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import Balance, {
  NetworkTokens,
  CurrencyType,
  DataCredits,
} from '@helium/currency'
import { useAsync } from 'react-async-hook'
import Box from '../../../components/Box'
import { triggerNavHaptic } from '../../../utils/haptic'
import { QrScanResult } from '../scan/scanTypes'
import SendHeader from './SendHeader'
import { SendType } from './sendTypes'
import SendAmountAvailableBanner from './SendAmountAvailableBanner'
import SendForm from './SendForm'
import {
  calculateBurnTxnFee,
  calculatePaymentTxnFee,
  convertFeeToNetworkTokens,
} from '../../../utils/fees'

const SendView = ({ scanResult }: { scanResult?: QrScanResult }) => {
  const navigation = useNavigation()

  const [type, setType] = useState<SendType>('payment')
  const [address, setAddress] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [dcAmount, setDcAmount] = useState<string>('')
  const [memo, setMemo] = useState<string>('')
  const [isLocked, setIsLocked] = useState(false)
  const [fee, setFee] = useState<Balance<NetworkTokens>>(
    new Balance(0, CurrencyType.networkToken),
  )

  useEffect(() => {
    if (scanResult) {
      setIsLocked(!!scanResult?.amount)
      setType(scanResult.type)
      setAddress(scanResult.address)
      if (scanResult?.amount) setAmount(scanResult?.amount)
      if (scanResult?.memo) setMemo(scanResult?.memo)
      if (scanResult?.amount && scanResult.type === 'dc_burn') {
        setDcAmount('12345678')
      }
    }
  }, [scanResult])

  const calculateFee = async (): Promise<Balance<DataCredits>> => {
    // TODO safer/more centralized way of doing this?
    const integerAmount = parseFloat(amount) * 100000000

    if (type === 'payment') {
      // TODO use actual nonce here
      return calculatePaymentTxnFee(integerAmount, 1, address)
    }

    if (type === 'dc_burn') {
      // TODO use actual nonce here
      return calculateBurnTxnFee(integerAmount, address, 1, memo)
    }

    throw new Error('Unsupported transaction type')
  }

  useAsync(async () => {
    const dcFee = await calculateFee()
    const hntFee = await convertFeeToNetworkTokens(dcFee)
    setFee(hntFee)
  }, [amount])

  const navBack = () => {
    navigation.navigate('Wallet')
    triggerNavHaptic()
  }

  const navScan = () => {
    navigation.navigate('SendScan')
    triggerNavHaptic()
  }

  const setMaxAmount = () => {
    triggerNavHaptic()
  }

  const unlockForm = () => {
    setIsLocked(false)
    triggerNavHaptic()
  }

  const submitTxn = () => {
    // eslint-disable-next-line no-console
    console.log('address', address)
    // eslint-disable-next-line no-console
    console.log('amount', amount)
  }

  return (
    <Box flex={1}>
      <SendHeader type={type} onClosePress={navBack} />
      <SendAmountAvailableBanner amount={123455.12345678} />
      <Box flex={3} backgroundColor="white" paddingHorizontal="l">
        <SendForm
          type={type}
          isLocked={isLocked}
          address={address}
          amount={amount}
          dcAmount={dcAmount}
          memo={memo}
          fee={fee}
          onAddressChange={setAddress}
          onAmountChange={setAmount}
          onDcAmountChange={setDcAmount}
          onMemoChange={setMemo}
          onScanPress={navScan}
          onSendMaxPress={setMaxAmount}
          onSubmit={submitTxn}
          onUnlock={unlockForm}
        />
      </Box>
    </Box>
  )
}

export default SendView
