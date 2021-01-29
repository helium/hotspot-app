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
import { Hotspot } from '@helium/http'
import { TransferHotspotV1 } from '@helium/transactions'
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
import {
  makeBurnTxn,
  makeBuyerTransferHotspotTxn,
  makePaymentTxn,
  makeSellerTransferHotspotTxn,
} from '../../../utils/transactions'
import { getAccount, submitTransaction } from '../../../utils/appDataClient'
import * as Logger from '../../../utils/logger'
import TransferBanner from '../../hotspots/transfers/TransferBanner'
import {
  createTransfer,
  deleteTransfer,
  getTransfer,
  Transfer,
} from '../../hotspots/transfers/TransferRequests'
import { getAddress } from '../../../utils/secureAccount'
import Text from '../../../components/Text'

type Props = {
  scanResult?: QrScanResult
  sendType?: SendType
  hotspot?: Hotspot
  isSeller?: boolean
}

const SendView = ({ scanResult, sendType, hotspot, isSeller }: Props) => {
  const navigation = useNavigation()
  const { t } = useTranslation()

  const [type, setType] = useState<SendType>(sendType || 'payment')
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

    if (type === 'transfer') {
      setIsValid(isValidAddress)
    } else {
      setIsValid(
        isValidAddress &&
          hasSufficientBalance &&
          address !== account?.address &&
          balanceAmount.integerBalance > 0,
      )
    }
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

  const handleSellerTransfer = async (): Promise<undefined> => {
    const seller = await getAddress()
    if (!hotspot || !seller) {
      throw new Error('missing hotspot or seller for transfer')
    }
    const partialTxn = await makeSellerTransferHotspotTxn(
      hotspot.address,
      address,
      seller,
      getIntegerAmount(),
    )
    const transfer = createTransfer(
      hotspot.address,
      seller?.b58,
      address,
      partialTxn,
      getIntegerAmount(),
    )
    if (!transfer) {
      Alert.alert(
        t('transfer.exists_alert_title'),
        t('transfer.exists_alert_body'),
      )
      throw new Error('transfer already exists')
    }
    return undefined
  }

  const checkTransferAmountChanged = (transfer: Transfer) => {
    if (
      transfer.amountToSeller &&
      transfer.amountToSeller.integerBalance !== getIntegerAmount()
    ) {
      setAmount(transfer.amountToSeller.floatBalance.toString())
      Alert.alert(
        t('transfer.amount_changed_alert_title'),
        t('transfer.amount_changed_alert_body', {
          amount: transfer.amountToSeller.floatBalance.toString(),
        }),
      )
      throw new Error('transfer amount changed')
    }
  }

  const handleBuyerTransfer = async (): Promise<string | undefined> => {
    if (!hotspot) {
      throw new Error('missing hotspot for buyer transfer')
    }
    const transfer = await getTransfer(hotspot.address)
    if (transfer) {
      checkTransferAmountChanged(transfer)
      const sellerSignedTxnBin = transfer.partialTransaction
      const transferHotspotTxn = TransferHotspotV1.fromString(
        sellerSignedTxnBin,
      )
      const buyerAccount = await getAccount()
      const nonce = buyerAccount?.speculativeNonce || 0
      if (transferHotspotTxn.buyerNonce !== nonce + 1) {
        Alert.alert(t('nonce_alert_title'), t('nonce_alert_body'))
        throw new Error('transfer nonce invalid')
      }
      const txn = await makeBuyerTransferHotspotTxn(transferHotspotTxn)
      const deleteResponse = await deleteTransfer(hotspot.address, true)
      if (!deleteResponse) {
        Alert.alert(
          t('transfer.incomplete_alert_title'),
          t('transfer.incomplete_alert_body'),
        )
        throw new Error('transfer delete invalid')
      }
      return txn
    }
    Alert.alert(
      t('transfer.canceled_alert_title'),
      t('transfer.canceled_alert_body'),
    )
    throw new Error('transfer no longer active')
  }

  const constructTxn = async (): Promise<string | undefined> => {
    if (type === 'payment') {
      return makePaymentTxn(getIntegerAmount(), address, getNonce())
    }

    if (type === 'dc_burn') {
      return makeBurnTxn(getIntegerAmount(), address, getNonce(), memo)
    }

    if (type === 'transfer') {
      return isSeller ? handleSellerTransfer() : handleBuyerTransfer()
    }

    throw new Error('Unsupported transaction type')
  }

  const handleSubmit = async () => {
    try {
      const txn = await constructTxn()
      if (txn) {
        await submitTransaction(txn)
      }
      triggerNavHaptic()
      navigation.navigate('SendComplete')
    } catch (error) {
      Logger.error(error)
      if (type !== 'transfer') {
        Alert.alert(t('generic.error'), t('send.error'))
      }
    }
  }

  return (
    <Box flex={1}>
      <SendHeader type={type} onClosePress={navBack} />
      {type === 'payment' && (
        <SendAmountAvailableBanner amount={account?.balance} />
      )}
      {type === 'dc_burn' && (
        <SendAmountAvailableBanner amount={account?.balance} />
      )}
      {type === 'transfer' && <TransferBanner hotspot={hotspot} />}
      <Box flex={3} backgroundColor="white" paddingHorizontal="l">
        <SendForm
          isSeller={isSeller}
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
      {isSeller && (
        <Text
          variant="body3"
          color="gray"
          paddingBottom="xl"
          paddingHorizontal="l"
          textAlign="center"
        >
          {t('transfer.fine_print')}{' '}
        </Text>
      )}
    </Box>
  )
}

export default SendView
