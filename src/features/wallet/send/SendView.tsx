import React, { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { useTranslation } from 'react-i18next'
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
import { makeBurnTxn, makePaymentTxn } from '../../../utils/transactions'
import { submitTransaction } from '../../../utils/appDataClient'
import * as Logger from '../../../utils/logger'

const SendView = ({ scanResult }: { scanResult?: QrScanResult }) => {
  const navigation = useNavigation()
  const { t } = useTranslation()

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

  // TODO Balance.fromString(amount: string, currencyType: CurrencyType)
  const getIntegerAmount = (): number => parseFloat(amount) * 100000000
  const getBalanceAmount = (): Balance<NetworkTokens> => {
    return new Balance(getIntegerAmount(), CurrencyType.networkToken)
  }

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

  // compute equivalent dc amount for burn txns
  useAsync(async () => {
    if (type === 'dc_burn') {
      const balanceDc = await networkTokensToDataCredits(getBalanceAmount())
      // TODO option to not return currency ticker in balance
      // TODO might need to round up in DC conversion in he-js
      setDcAmount(balanceDc.toString(0).slice(0, -3))
    }
  }, [type, amount])

  // validate transaction
  useEffect(() => {
    const isValidAddress = Address.isValid(address)
    const balanceAmount = getBalanceAmount()
    const totalTxnAmount = balanceAmount.plus(fee)
    // TODO balance compare/greater than/less than
    const hasSufficientBalance =
      totalTxnAmount.integerBalance <= (account?.balance?.integerBalance || 0)

    setIsValid(
      isValidAddress &&
        hasSufficientBalance &&
        address !== account?.address &&
        balanceAmount.integerBalance > 0,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, amount, fee, account])

  // compute fee
  useAsync(async () => {
    const dcFee = await calculateFee()
    const hntFee = await convertFeeToNetworkTokens(dcFee)
    setFee(hntFee)
  }, [amount])

  const getNonce = (): number => {
    if (!account?.speculativeNonce) return 1
    return account.speculativeNonce + 1
  }

  const calculateFee = async (): Promise<Balance<DataCredits>> => {
    if (type === 'payment') {
      return calculatePaymentTxnFee(getIntegerAmount(), getNonce(), address)
    }

    if (type === 'dc_burn') {
      return calculateBurnTxnFee(getIntegerAmount(), address, getNonce(), memo)
    }

    throw new Error('Unsupported transaction type')
  }

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

  const constructTxn = async (): Promise<string> => {
    if (type === 'payment') {
      return makePaymentTxn(getIntegerAmount(), address, getNonce())
    }

    if (type === 'dc_burn') {
      return makeBurnTxn(getIntegerAmount(), address, getNonce(), memo)
    }

    throw new Error('Unsupported transaction type')
  }

  const handleSubmit = async () => {
    try {
      const txn = await constructTxn()
      await submitTransaction(txn)
      triggerNavHaptic()
      navigation.navigate('SendComplete')
    } catch (error) {
      Logger.error(error)
      Alert.alert(t('generic.error'), t('send.error'))
    }
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
          onSubmit={handleSubmit}
          onUnlock={unlockForm}
        />
      </Box>
    </Box>
  )
}

export default SendView
