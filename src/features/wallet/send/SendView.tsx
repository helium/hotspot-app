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
import SendHeader from './SendHeader'
import { SendDetails, SendDetailsUpdate } from './sendTypes'
import SendAmountAvailableBanner from './SendAmountAvailableBanner'
import SendForm from './SendForm'
import {
  makeBurnTxn,
  makeBuyerTransferHotspotTxn,
  makePaymentTxn,
  makeSellerTransferHotspotTxn,
  formatAmountInput,
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

type Props = {
  scanResult?: AppLink
  sendType?: AppLinkCategoryType
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
  const [type, setType] = useState<AppLinkCategoryType>(sendType || 'payment')
  const [isLocked, setIsLocked] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const [hasSufficientBalance, setHasSufficientBalance] = useState(false)
  const {
    account: { account },
  } = useSelector((state: RootState) => state)

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
    const getAmountAndBalance = (scanAmount?: string) => {
      let amount = ''
      let balanceAmount = new Balance(0, CurrencyType.networkToken)
      if (scanAmount) {
        balanceAmount = Balance.fromFloat(
          parseFloat(scanAmount),
          CurrencyType.networkToken,
        )
        amount = formatAmountInput(String(scanAmount))
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
            fee: new Balance(0, CurrencyType.networkToken),
          }
        },
      )
    } else {
      const { amount, balanceAmount } = getAmountAndBalance(scanResult.amount)
      scannedSendDetails = [
        {
          id: 'transfer0',
          address: scanResult.address,
          addressAlias: '',
          addressLoading: false,
          amount,
          balanceAmount,
          dcAmount: '',
          memo: scanResult.memo || '',
          fee: new Balance(0, CurrencyType.networkToken),
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
      const { address, fee } = sendDetails[0]
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
      sendDetails.forEach(({ address, balanceAmount }) => {
        const isValidTransferAddress =
          Address.isValid(address) && address !== account?.address
        if (!isValidTransferAddress) isValidSend = false
        const isValidTransferAmount = balanceAmount.integerBalance > 0
        if (!isValidTransferAmount) isValidSend = false
        totalSendAmount = totalSendAmount.plus(balanceAmount)
      })
      // Only one fee is charged per transaction regardless of how many individual payments are
      // made, so add the fee once from the first send detail
      if (sendDetails.length > 0) {
        totalSendAmount = totalSendAmount.plus(sendDetails[0].fee)
      }
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
    const { address, balanceAmount } = sendDetails[0]
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

  const constructTxn = async () => {
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
  }

  const handleSubmit = async () => {
    try {
      const txn = await constructTxn()
      if (txn) {
        await submitTxn(txn)
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
          account={account}
          hasSufficientBalance={hasSufficientBalance}
          hasValidActivity={hasValidActivity}
          isLocked={isLocked}
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
