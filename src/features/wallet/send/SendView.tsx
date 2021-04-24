import React, { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import Balance, { CurrencyType } from '@helium/currency'
import { Address } from '@helium/crypto-react-native'
import { useAsync } from 'react-async-hook'
import { useSelector } from 'react-redux'
import { Hotspot } from '@helium/http'
import { TransferHotspotV1 } from '@helium/transactions'
import { some } from 'lodash'
import { RootState } from '../../../store/rootReducer'
import Box from '../../../components/Box'
import useHaptic from '../../../utils/useHaptic'
import { QrScanResult } from '../scan/scanTypes'
import SendHeader from './SendHeader'
import { SendTransfer, SendType, SendTransferUpdate } from './sendTypes'
import SendAmountAvailableBanner from './SendAmountAvailableBanner'
import SendForm from './SendForm'
import {
  makeBurnTxn,
  makeBuyerTransferHotspotTxn,
  makePaymentTxn,
  makeSellerTransferHotspotTxn,
} from '../../../utils/transactions'
import {
  getAccount,
  getChainVars,
  getHotspotsLastChallengeActivity,
} from '../../../utils/appDataClient'
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
import useSubmitTxn from '../../../hooks/useSubmitTxn'
import { decimalSeparator, groupSeparator, locale } from '../../../utils/i18n'
import { useAppDispatch } from '../../../store/store'
import {
  fetchCurrentOraclePrice,
  fetchPredictedOraclePrice,
} from '../../../store/helium/heliumDataSlice'

type Props = {
  scanResult?: QrScanResult
  sendType?: SendType
  hotspot?: Hotspot
  isSeller?: boolean
}

const SendView = ({ scanResult, sendType, hotspot, isSeller }: Props) => {
  const navigation = useNavigation()
  const { t } = useTranslation()
  const submitTxn = useSubmitTxn()
  const dispatch = useAppDispatch()
  const { triggerNavHaptic } = useHaptic()
  const blockHeight = useSelector(
    (state: RootState) => state.heliumData.blockHeight,
  )
  const [type, setType] = useState<SendType>(sendType || 'payment')
  const [isLocked, setIsLocked] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const [hasSufficientBalance, setHasSufficientBalance] = useState(false)
  const {
    account: { account },
  } = useSelector((state: RootState) => state)

  const [sendTransfers, setSendTransfers] = useState<Array<SendTransfer>>([
    {
      id: '0',
      address: '',
      addressAlias: '',
      addressLoading: false,
      amount: '',
      balanceAmount: new Balance(0, CurrencyType.networkToken),
      dcAmount: '',
      fee: new Balance(0, CurrencyType.networkToken),
      memo: '',
    },
  ])
  const setTransfer = (transferId: string, updates: SendTransferUpdate) => {
    setSendTransfers(
      sendTransfers.map((transfer) => {
        return transfer.id === transferId
          ? { ...transfer, ...updates }
          : transfer
      }),
    )
  }

  // update oracles
  useEffect(() => {
    dispatch(fetchCurrentOraclePrice())
    dispatch(fetchPredictedOraclePrice())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // load last hotspot activity for transfer
  const [lastReportedActivity, setLastReportedActivity] = useState<string>()
  const [hasValidActivity, setHasValidActivity] = useState<boolean>()
  const [stalePocBlockCount, setStalePocBlockCount] = useState<number>()
  useAsync(async () => {
    if (type === 'transfer' && hotspot?.address && blockHeight) {
      const chainVars = await getChainVars()
      const staleBlockCount = chainVars.transferHotspotStalePocBlocks as number
      const reportedActivity = await getHotspotsLastChallengeActivity(
        hotspot.address,
      )
      const lastActiveBlock = reportedActivity.block || 0
      setLastReportedActivity(reportedActivity.text)
      setHasValidActivity(blockHeight - lastActiveBlock < staleBlockCount)
      setStalePocBlockCount(staleBlockCount)
    }
  }, [hotspot?.address, blockHeight, type])

  // load transfer data
  const [transferData, setTransferData] = useState<Transfer>()
  useEffect(() => {
    const fetchTransfer = async () => {
      if (!hotspot) {
        Alert.alert(
          t('transfer.canceled_alert_title'),
          t('transfer.canceled_alert_body'),
        )
        return
      }
      try {
        const transfer = await getTransfer(hotspot.address)
        setTransferData(transfer)
      } catch (e) {
        Alert.alert(
          t('transfer.canceled_alert_title'),
          t('transfer.canceled_alert_body'),
        )
        navigation.goBack()
      }
    }
    if (!isSeller && type === 'transfer') {
      fetchTransfer()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // process scan results
  useEffect(() => {
    if (!scanResult) return
    setType(scanResult.type)
    const scannedSendTransfers: Array<SendTransfer> = scanResult.payees.map(
      ({ address, amount: scanAmount, memo = '' }, i) => {
        let amount = ''
        let balanceAmount = new Balance(0, CurrencyType.networkToken)
        if (scanAmount) {
          balanceAmount = Balance.fromFloat(
            parseFloat(scanAmount),
            CurrencyType.networkToken,
          )
          amount = formatAmount(String(scanAmount))
        }
        return {
          id: `transfer${i}`,
          address,
          addressAlias: '',
          addressLoading: false,
          amount,
          balanceAmount,
          dcAmount: '',
          memo,
          fee: new Balance(0, CurrencyType.networkToken),
        }
      },
    )
    setSendTransfers(scannedSendTransfers)
    const hasPresetAmount = some(scannedSendTransfers, ({ amount }) => !!amount)
    if (hasPresetAmount) setIsLocked(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanResult])

  // validate transaction
  useEffect(() => {
    if (type === 'transfer') {
      const { fee } = sendTransfers[0]
      if (isSeller) {
        setHasSufficientBalance(true)
      } else {
        const isValidSellerAddress = transferData
          ? Address.isValid(transferData.seller)
          : false
        const totalTxnAmount = transferData?.amountToSeller?.plus(fee)
        // TODO balance compare/greater than/less than
        const hasBalance =
          totalTxnAmount &&
          totalTxnAmount.integerBalance <=
            (account?.balance?.integerBalance || 0)
        setHasSufficientBalance(hasBalance || false)
        setIsValid(
          isValidSellerAddress &&
            (hasBalance || false) &&
            (hasValidActivity || false),
        )
      }
    } else {
      let hasBalance = true
      let isValidAddress = true
      let isValidBalanceAmount = true
      sendTransfers.forEach(({ address, balanceAmount, fee }) => {
        const isValidTransferAddress =
          Address.isValid(address) && address !== account?.address
        if (!isValidTransferAddress) isValidAddress = false
        const isValidTransferAmount = balanceAmount.integerBalance > 0
        if (!isValidTransferAmount) isValidBalanceAmount = false
        const totalTxnAmount = balanceAmount.plus(fee)
        // TODO balance compare/greater than/less than
        const hasSufficientTransferBalance =
          totalTxnAmount.integerBalance <=
          (account?.balance?.integerBalance || 0)
        if (!hasSufficientTransferBalance) hasBalance = false
      })
      setHasSufficientBalance(hasBalance)
      setIsValid(hasSufficientBalance && isValidAddress && isValidBalanceAmount)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    account,
    sendTransfers,
    transferData?.seller,
    transferData?.amountToSeller,
    hasValidActivity,
  ])

  const formatAmount = (formAmount: string) => {
    if (formAmount === decimalSeparator || formAmount.includes('NaN')) {
      return `0${decimalSeparator}`
    }
    const rawInteger = (formAmount.split(decimalSeparator)[0] || formAmount)
      .split(groupSeparator)
      .join('')
    const integer = parseInt(rawInteger, 10).toLocaleString(locale)
    let decimal = formAmount.split(decimalSeparator)[1]
    if (integer === 'NaN') {
      return ''
    }
    if (decimal && decimal.length >= 9) decimal = decimal.slice(0, 8)
    return formAmount.includes(decimalSeparator)
      ? `${integer}${decimalSeparator}${decimal}`
      : integer
  }

  const getNonce = (): number => {
    if (!account?.speculativeNonce) return 1
    return account.speculativeNonce + 1
  }

  const navBack = () => {
    navigation.navigate('Wallet')
    triggerNavHaptic()
  }

  const navScan = () => {
    navigation.navigate('SendScan')
    triggerNavHaptic()
  }

  const unlockForm = () => {
    setIsLocked(false)
    triggerNavHaptic()
  }

  const handleSellerTransfer = async () => {
    const { address, balanceAmount } = sendTransfers[0]
    const seller = await getAddress()
    if (!hotspot || !seller) {
      throw new Error('missing hotspot or seller for transfer')
    }
    const partialTxn = await makeSellerTransferHotspotTxn(
      hotspot.address,
      address,
      seller,
      balanceAmount.integerBalance,
    )
    if (!partialTxn) {
      Alert.alert(t('generic.error'), t('send.error'))
      throw new Error('failed to create seller TransferHotspotV1 transaction')
    }
    const transfer = await createTransfer(
      hotspot.address,
      seller?.b58,
      address,
      partialTxn.toString(),
      balanceAmount.integerBalance,
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
      transfer.amountToSeller?.integerBalance !==
      transferData?.amountToSeller?.integerBalance
    ) {
      setTransferData(transfer)
      Alert.alert(
        t('transfer.amount_changed_alert_title'),
        t('transfer.amount_changed_alert_body', {
          amount: transfer?.amountToSeller?.toString(undefined, {
            groupSeparator,
            decimalSeparator,
            showTicker: false,
          }),
        }),
      )
      throw new Error('transfer amount changed')
    }
  }

  const handleBuyerTransfer = async (): Promise<TransferHotspotV1> => {
    if (!hotspot) {
      throw new Error('missing hotspot for buyer transfer')
    }
    try {
      const transfer = await getTransfer(hotspot.address)
      if (!transfer) {
        throw new Error('transfer no longer active')
      }
      checkTransferAmountChanged(transfer)
      setTransferData(transfer)
      const sellerSignedTxnBin = transfer.partialTransaction
      const transferHotspotTxn = TransferHotspotV1.fromString(
        sellerSignedTxnBin,
      )
      const buyerAccount = await getAccount()
      const nonce = buyerAccount?.speculativeNonce || 0
      if (transferHotspotTxn.buyerNonce !== nonce + 1) {
        Alert.alert(
          t('transfer.nonce_alert_title'),
          t('transfer.nonce_alert_body'),
        )
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
    } catch (error) {
      if (
        error.message !== 'transfer amount changed' &&
        error.message !== 'transfer nonce invalid' &&
        error.message !== 'transfer delete invalid'
      ) {
        Alert.alert(
          t('transfer.canceled_alert_title'),
          t('transfer.canceled_alert_body'),
        )
      }
      throw error
    }
  }

  const constructTxns = async () => {
    if (type === 'payment') {
      return Promise.all(
        sendTransfers.map(async ({ address, balanceAmount }) => {
          return makePaymentTxn(
            balanceAmount.integerBalance,
            address,
            getNonce(),
          )
        }),
      )
    }

    if (type === 'dc_burn') {
      return Promise.all(
        sendTransfers.map(async ({ address, balanceAmount, memo }) => {
          return makeBurnTxn(
            balanceAmount.integerBalance,
            address,
            getNonce(),
            memo,
          )
        }),
      )
    }

    if (type === 'transfer') {
      return [isSeller ? handleSellerTransfer() : handleBuyerTransfer()]
    }

    throw new Error('Unsupported transaction type')
  }

  const handleSubmit = async () => {
    try {
      const txns = await constructTxns()
      await Promise.all(txns.map(async (txn: any) => submitTxn(txn)))
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
          account={account}
          hasSufficientBalance={hasSufficientBalance}
          hasValidActivity={hasValidActivity}
          isLocked={isLocked}
          isSeller={isSeller}
          isValid={isValid}
          lastReportedActivity={lastReportedActivity}
          onScanPress={navScan}
          onSubmit={handleSubmit}
          sendTransfers={sendTransfers}
          stalePocBlockCount={stalePocBlockCount}
          transferData={transferData}
          type={type}
          unlockForm={unlockForm}
          updateTransfer={setTransfer}
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
          {t('transfer.fine_print')}
        </Text>
      )}
    </Box>
  )
}

export default SendView
