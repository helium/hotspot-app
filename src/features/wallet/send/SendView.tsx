import React, { useCallback, useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import Balance, {
  CurrencyType,
  DataCredits,
  NetworkTokens,
} from '@helium/currency'
import { Address } from '@helium/crypto-react-native'
import { useAsync } from 'react-async-hook'
import { useSelector } from 'react-redux'
import { TransferHotspotV1 } from '@helium/transactions'
import { some } from 'lodash'
import { RootState } from '../../../store/rootReducer'
import Box from '../../../components/Box'
import useHaptic from '../../../utils/useHaptic'
import SendHeader from './SendHeader'
import {
  SendDetails,
  SendDetailsUpdate,
  SendNavigationProps,
} from './sendTypes'
import SendAmountAvailableBanner from './SendAmountAvailableBanner'
import SendForm from './SendForm'
import {
  calculateBurnTxnFee,
  calculatePaymentTxnFee,
  calculateTransferTxnFee,
  useFees,
} from '../../../utils/fees'
import {
  makeBurnTxn,
  makeBuyerTransferHotspotTxn,
  makePaymentTxn,
  makeSellerTransferHotspotTxn,
  getMemoBytesLeft,
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
import { decimalSeparator, groupSeparator } from '../../../utils/i18n'
import { useAppDispatch } from '../../../store/store'
import {
  fetchCurrentOraclePrice,
  fetchPredictedOraclePrice,
} from '../../../store/helium/heliumDataSlice'
import {
  AppLink,
  AppLinkPayment,
  AppLinkCategoryType,
} from '../../../providers/appLinkTypes'
import { MainTabNavigationProp } from '../../../navigation/main/tabTypes'

type Props = {
  scanResult?: AppLink
  sendType?: AppLinkCategoryType
  hotspotAddress?: string
  isDisabled: boolean
  isSeller?: boolean
  canSubmit?: boolean
  lockedPaymentAddress?: string
  warning?: string
}

const SendView = ({
  scanResult,
  sendType,
  hotspotAddress,
  isDisabled,
  isSeller,
  canSubmit = true,
  lockedPaymentAddress,
  warning,
}: Props) => {
  const tabNavigation = useNavigation<MainTabNavigationProp>()
  const sendNavigation = useNavigation<SendNavigationProps>()
  const { t } = useTranslation()
  const submitTxn = useSubmitTxn()
  const dispatch = useAppDispatch()
  const { triggerNavHaptic } = useHaptic()
  const blockHeight = useSelector(
    (state: RootState) => state.heliumData.blockHeight,
  )
  const currentOraclePrice = useSelector(
    (state: RootState) => state.heliumData.currentOraclePrice,
  )
  const [type, setType] = useState<AppLinkCategoryType>(sendType || 'payment')
  const [isLocked, setIsLocked] = useState(isDisabled)
  const [isValid, setIsValid] = useState(false)
  const [hasSufficientBalance, setHasSufficientBalance] = useState(false)
  const [transferData, setTransferData] = useState<Transfer>()
  const [fee, setFee] = useState<Balance<NetworkTokens>>(
    new Balance(0, CurrencyType.networkToken),
  )
  const {
    account: { account },
  } = useSelector((state: RootState) => state)

  const { feeToHNT } = useFees()

  // SendView can support multiple "send" actions in a single transaction.
  // - This is currently only supported for the "payment" send type.
  // - Multiple payments can only be initialized by scanning a QR code (no ability to manually
  //   add/remove payments directly from SendView UI).
  // - We maintain an array of "sendDetails" in state here, but "dc_burn" and "transfer" actions
  //   will effectively have only a single element (an assumption that's made in subsequent logic
  //   like validation and submission).
  const [sendDetails, setSendDetails] = useState<Array<SendDetails>>([
    {
      id: '0',
      address: lockedPaymentAddress || '',
      addressAlias: '',
      addressLoading: false,
      amount: '',
      balanceAmount: new Balance(0, CurrencyType.networkToken),
      dcAmount: '',
      memo: '',
    },
  ])
  const updateSendDetails = (detailsId: string, updates: SendDetailsUpdate) => {
    setSendDetails(
      sendDetails.map((details) => {
        return details.id === detailsId ? { ...details, ...updates } : details
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
    if (type === 'transfer' && hotspotAddress && blockHeight) {
      const chainVars = await getChainVars()
      const staleBlockCount = chainVars.transferHotspotStalePocBlocks as number
      const reportedActivity = await getHotspotsLastChallengeActivity(
        hotspotAddress,
      )
      const lastActiveBlock = reportedActivity.block || 0
      setLastReportedActivity(reportedActivity.text)
      setHasValidActivity(blockHeight - lastActiveBlock < staleBlockCount)
      setStalePocBlockCount(staleBlockCount)
    }
  }, [hotspotAddress, blockHeight, type])

  // load transfer data
  useEffect(() => {
    const fetchTransfer = async () => {
      if (!hotspotAddress) {
        Alert.alert(
          t('transfer.canceled_alert_title'),
          t('transfer.canceled_alert_body'),
        )
        return
      }
      try {
        const transfer = await getTransfer(hotspotAddress)
        setTransferData(transfer)
      } catch (e) {
        Alert.alert(
          t('transfer.canceled_alert_title'),
          t('transfer.canceled_alert_body'),
        )
        sendNavigation.goBack()
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
    const getAmountAndBalance = (scanAmount?: string) => {
      let amount = ''
      let balanceAmount = new Balance(0, CurrencyType.networkToken)
      if (scanAmount) {
        const floatAmount = parseFloat(scanAmount.replace(/,/g, ''))
        balanceAmount = Balance.fromFloat(
          floatAmount,
          CurrencyType.networkToken,
        )
        amount = balanceAmount.toString(8, {
          showTicker: false,
          decimalSeparator,
          groupSeparator,
        })
      }
      return { amount, balanceAmount }
    }
    let scannedSendDetails: Array<SendDetails>
    const isAppLinkPayment = (scanRes: any): scanRes is AppLinkPayment => {
      return scanRes.type === 'payment' && scanRes.payees
    }
    if (isAppLinkPayment(scanResult)) {
      scannedSendDetails = scanResult.payees.map(
        ({ address, amount: scanAmount, memo = '' }, i) => {
          const { amount, balanceAmount } = getAmountAndBalance(scanAmount)
          return {
            id: `transfer${i}`,
            address,
            addressAlias: '',
            addressLoading: false,
            amount,
            balanceAmount,
            dcAmount: '',
            memo,
          }
        },
      )
    } else {
      const { amount, balanceAmount } = getAmountAndBalance(scanResult.amount)
      const balanceDc = balanceAmount.toDataCredits(currentOraclePrice?.price)
      scannedSendDetails = [
        {
          id: 'transfer0',
          address: scanResult.address,
          addressAlias: '',
          addressLoading: false,
          amount,
          balanceAmount,
          dcAmount: balanceDc.toString(0, {
            showTicker: false,
            decimalSeparator,
            groupSeparator,
          }),
          memo: scanResult.memo || '',
        },
      ]
    }
    if (scannedSendDetails.length > 0) {
      if (type === 'payment') {
        // Only support multiple "send" actions for payments (not dc_burns or transfers)
        setSendDetails(scannedSendDetails)
      } else {
        // Otherwise, only initialize SendView with the first entry received from QR scan
        setSendDetails([scannedSendDetails[0]])
      }
    }
    const hasPresetAmount = some(scannedSendDetails, ({ amount }) => !!amount)
    if (hasPresetAmount) setIsLocked(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanResult])

  // validate transaction
  useEffect(() => {
    if (type === 'transfer') {
      const { address } = sendDetails[0]
      if (isSeller) {
        setIsValid(Address.isValid(address) && (hasValidActivity || false))
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
      let isValidSend = true
      let totalSendAmount = new Balance(0, CurrencyType.networkToken)
      sendDetails.forEach(({ address, balanceAmount, memo }) => {
        const isValidTransferAddress =
          Address.isValid(address) && address !== account?.address
        if (!isValidTransferAddress) isValidSend = false
        const isValidTransferAmount = balanceAmount.integerBalance > 0
        if (!isValidTransferAmount) isValidSend = false
        totalSendAmount = totalSendAmount.plus(balanceAmount)
        const memoLength = getMemoBytesLeft(memo)
        if (!memoLength.valid) isValidSend = false
      })
      totalSendAmount = totalSendAmount.plus(fee)
      // TODO balance compare/greater than/less than
      const hasBalance =
        totalSendAmount.integerBalance <=
        (account?.balance?.integerBalance || 0)
      setHasSufficientBalance(hasBalance)
      setIsValid(hasBalance && isValidSend)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    account,
    sendDetails,
    transferData?.seller,
    transferData?.amountToSeller,
    hasValidActivity,
  ])

  const getNonce = useCallback((): number => {
    if (!account?.speculativeNonce) return 1
    return account.speculativeNonce + 1
  }, [account?.speculativeNonce])

  const updateFee = async () => {
    await dispatch(fetchCurrentOraclePrice())
    await dispatch(fetchPredictedOraclePrice())
    const dcFee = await calculateFee()
    const hntFee = feeToHNT(dcFee)
    setFee(hntFee)
    return hntFee
  }

  // compute fee
  useAsync(async () => {
    await updateFee()
  }, [sendDetails, transferData?.amountToSeller])

  const calculateFee = async (): Promise<Balance<DataCredits>> => {
    if (type === 'payment') {
      return calculatePaymentTxnFee(sendDetails, getNonce())
    }

    if (type === 'dc_burn' && sendDetails.length > 0) {
      return calculateBurnTxnFee(
        sendDetails[0].balanceAmount.integerBalance,
        sendDetails[0].address,
        getNonce(),
        sendDetails[0].memo,
      )
    }

    if (type === 'transfer') {
      return calculateTransferTxnFee(transferData?.partialTransaction)
    }

    throw new Error('Unsupported transaction type')
  }

  const navBack = () => {
    tabNavigation.navigate('Wallet')
    triggerNavHaptic()
  }

  const navScan = () => {
    sendNavigation.navigate('SendScan', { type })
    triggerNavHaptic()
  }

  const unlockForm = () => {
    setIsLocked(false)
    triggerNavHaptic()
  }

  const handleSellerTransfer = useCallback(async () => {
    const { address, balanceAmount } = sendDetails[0]
    const seller = await getAddress()
    if (!hotspotAddress || !seller) {
      throw new Error('missing hotspot or seller for transfer')
    }
    const partialTxn = await makeSellerTransferHotspotTxn(
      hotspotAddress,
      address,
      seller,
      balanceAmount.integerBalance,
    )
    if (!partialTxn) {
      Alert.alert(t('generic.error'), t('send.error'))
      throw new Error('failed to create seller TransferHotspotV1 transaction')
    }
    const transfer = await createTransfer(
      hotspotAddress,
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
  }, [sendDetails, hotspotAddress, t])

  const checkTransferAmountChanged = useCallback(
    (transfer: Transfer) => {
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
    },
    [t, transferData?.amountToSeller?.integerBalance],
  )

  const handleBuyerTransfer = useCallback(async (): Promise<TransferHotspotV1> => {
    if (!hotspotAddress) {
      throw new Error('missing hotspot for buyer transfer')
    }
    try {
      const transfer = await getTransfer(hotspotAddress)
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
      const deleteResponse = await deleteTransfer(hotspotAddress, true)
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
  }, [checkTransferAmountChanged, hotspotAddress, t])

  const constructTxn = useCallback(async () => {
    if (type === 'payment') {
      return makePaymentTxn(sendDetails, getNonce())
    }

    if (type === 'dc_burn') {
      const { address, balanceAmount, memo } = sendDetails[0]
      return makeBurnTxn(
        balanceAmount.integerBalance,
        address,
        getNonce(),
        memo,
      )
    }

    if (type === 'transfer') {
      return isSeller ? handleSellerTransfer() : handleBuyerTransfer()
    }

    throw new Error('Unsupported transaction type')
  }, [
    getNonce,
    handleBuyerTransfer,
    handleSellerTransfer,
    isSeller,
    sendDetails,
    type,
  ])

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return
    try {
      const txn = await constructTxn()
      if (txn) {
        await submitTxn(txn)
      }
      triggerNavHaptic()
      sendNavigation.navigate('SendComplete')
    } catch (error) {
      Logger.error(error)
      if (type !== 'transfer') {
        Alert.alert(t('generic.error'), t('send.error'))
      }
    }
  }, [
    canSubmit,
    constructTxn,
    sendNavigation,
    submitTxn,
    t,
    triggerNavHaptic,
    type,
  ])

  return (
    <Box flex={1}>
      <SendHeader type={type} onClosePress={navBack} />
      {type === 'payment' && (
        <SendAmountAvailableBanner amount={account?.balance} />
      )}
      {type === 'dc_burn' && (
        <SendAmountAvailableBanner amount={account?.balance} />
      )}
      {type === 'transfer' && (
        <TransferBanner hotspotAddress={hotspotAddress} />
      )}
      <Box flex={3} backgroundColor="white" paddingHorizontal="l">
        <SendForm
          account={account}
          fee={fee}
          hasSufficientBalance={hasSufficientBalance}
          hasValidActivity={hasValidActivity}
          isDisabled={isDisabled}
          isLocked={isLocked}
          isLockedAddress={!!lockedPaymentAddress}
          isSeller={isSeller}
          isValid={isValid}
          lastReportedActivity={lastReportedActivity}
          onScanPress={navScan}
          onSubmit={handleSubmit}
          sendDetails={sendDetails}
          stalePocBlockCount={stalePocBlockCount}
          transferData={transferData}
          type={type}
          unlockForm={unlockForm}
          updateSendDetails={updateSendDetails}
          warning={warning}
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
