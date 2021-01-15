import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import Balance, {
  NetworkTokens,
  CurrencyType,
  DataCredits,
} from '@helium/currency'
import { Address } from '@helium/crypto-react-native'
import { useAsync } from 'react-async-hook'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store/rootReducer'
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
import { networkTokensToDataCredits } from '../../../utils/currency'

const SendView = ({ scanResult }: { scanResult?: QrScanResult }) => {
  const navigation = useNavigation()

  const [type, setType] = useState<SendType>('payment')
  const [address, setAddress] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [dcAmount, setDcAmount] = useState<string>('')
  const [memo, setMemo] = useState<string>('')
  const [isLocked, setIsLocked] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const [fee, setFee] = useState<Balance<NetworkTokens>>(
    new Balance(0, CurrencyType.networkToken),
  )
  const {
    account: { account },
  } = useSelector((state: RootState) => state)

  // process scan results
  useEffect(() => {
    if (scanResult) {
      setIsLocked(!!scanResult?.amount)
      setType(scanResult.type)
      setAddress(scanResult.address)
      if (scanResult?.amount) setAmount(scanResult?.amount)
      if (scanResult?.memo) setMemo(scanResult?.memo)
    }
  }, [scanResult])

  useAsync(async () => {
    if (type === 'dc_burn') {
      // TODO doing this in a few places...
      const integerAmount = parseFloat(amount) * 100000000
      const amountBalance = new Balance(
        integerAmount,
        CurrencyType.networkToken,
      )
      const balanceDc = await networkTokensToDataCredits(amountBalance)
      // TODO option to not return currency ticker in balance
      // TODO might need to round up in DC conversion in he-js
      setDcAmount(balanceDc.toString(0).slice(0, -3))
    }
  }, [type, amount])

  // validate transaction
  useEffect(() => {
    const isValidAddress = Address.isValid(address)
    // TODO Balance.fromString(amount: string, currencyType: CurrencyType)
    const integerAmount = parseFloat(amount) * 100000000
    const balanceAmount = new Balance(integerAmount, CurrencyType.networkToken)
    const totalTxnAmount = balanceAmount.plus(fee)
    // TODO balance compare/greater than/less than
    const hasSufficientBalance =
      totalTxnAmount.integerBalance <= (account?.balance?.integerBalance || 0)

    setIsValid(
      isValidAddress &&
        hasSufficientBalance &&
        address !== account?.address &&
        integerAmount > 0,
    )
  }, [address, amount, fee, account])

  const calculateFee = async (): Promise<Balance<DataCredits>> => {
    // TODO Balance.fromString(amount: string, currencyType: CurrencyType)
    const integerAmount = parseFloat(amount) * 100000000

    if (type === 'payment') {
      return calculatePaymentTxnFee(
        integerAmount,
        account?.speculativeNonce || 1,
        address,
      )
    }

    if (type === 'dc_burn') {
      return calculateBurnTxnFee(
        integerAmount,
        address,
        account?.speculativeNonce || 1,
        memo,
      )
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

    const balance = account?.balance
    if (!balance) return

    const maxAmount = balance.minus(fee)

    // TODO option to not return currency ticker in balance
    setAmount(maxAmount.toString(8).slice(0, -4))
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
    navigation.navigate('SendComplete')
  }

  return (
    <Box flex={1}>
      <SendHeader type={type} onClosePress={navBack} />
      <SendAmountAvailableBanner amount={account?.balance} />
      <Box flex={3} backgroundColor="white" paddingHorizontal="l">
        <SendForm
          type={type}
          isValid={isValid}
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
