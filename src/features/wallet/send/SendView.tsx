import React, { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import { useAsync } from 'react-async-hook'
import { useSelector } from 'react-redux'
import { some } from 'lodash'
import Balance, { CurrencyType, NetworkTokens } from '@helium/currency'
import { Address } from '@helium/crypto-react-native'
import { Hotspot } from '@helium/http'
import { TransferHotspotV1 } from '@helium/transactions'

// Redux
import { RootState } from '../../../store/rootReducer'
import { useAppDispatch } from '../../../store/store'
import {
  createTransfer,
  deleteTransfer,
  getTransfer,
  Transfer,
} from '../../hotspots/transfers/TransferRequests'
import {
  fetchCurrentOraclePrice,
  fetchPredictedOraclePrice,
} from '../../../store/helium/heliumDataSlice'
import useSubmitTxn from '../../../hooks/useSubmitTxn'

// Components
import Box from '../../../components/Box'
import SendAmountAvailableBanner from './SendAmountAvailableBanner'
import SendHeader from './SendHeader'
import SendForm from './SendForm'
import Text from '../../../components/Text'
import TransferBanner from '../../hotspots/transfers/TransferBanner'

// Types
import { QrScanResult } from '../scan/scanTypes'
import { SendTransfer, SendType } from './sendTypes'

// Utils
import useHaptic from '../../../utils/useHaptic'
import {
  calculateBurnTxnFee,
  calculatePaymentTxnFee,
  calculateTransferTxnFee,
  useFees,
} from '../../../utils/fees'
import useCurrency from '../../../utils/useCurrency'
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
import { getAddress } from '../../../utils/secureAccount'
import { ensLookup } from '../../../utils/explorerClient'
import { decimalSeparator, groupSeparator, locale } from '../../../utils/i18n'

type Props = {
  scanResult?: QrScanResult
  sendType?: SendType
  hotspot?: Hotspot
  isSeller?: boolean
}

const SendView = ({ scanResult, sendType, hotspot, isSeller }: Props) => {
  /* ********* */
  /* HOOK INIT */
  /* ********* */

  const navigation = useNavigation()
  const { t } = useTranslation()
  const { networkTokensToDataCredits } = useCurrency()
  const { feeToHNT } = useFees()
  const submitTxn = useSubmitTxn()
  const dispatch = useAppDispatch()
  const { triggerNavHaptic } = useHaptic()
  const blockHeight = useSelector(
    (state: RootState) => state.heliumData.blockHeight,
  )
  const {
    account: { account },
  } = useSelector((state: RootState) => state)
  const getNonce = (): number => {
    if (!account?.speculativeNonce) return 1
    return account.speculativeNonce + 1
  }

  /* ********** */
  /* STATE INIT */
  /* ********** */

  const [type, setType] = useState<SendType>(sendType || 'payment')
  const [isLocked, setIsLocked] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const [hasSufficientBalance, setHasSufficientBalance] = useState(false)
  const [sendTransfers, setSendTransfers] = useState<Array<SendTransfer>>([
    {
      id: 0,
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
  const setSendTransfer = (sendTransferId: number, changes = {}) => {
    setSendTransfers(
      sendTransfers.map((transfer) =>
        transfer.id === sendTransferId ? { ...transfer, ...changes } : transfer,
      ),
    )
  }
  const setAddress = (id: number, address: string) =>
    setSendTransfer(id, { address })
  const setAddressLoading = (id: number, addressLoading: boolean) =>
    setSendTransfer(id, { addressLoading })
  const setAddressAlias = (id: number, addressAlias: string) =>
    setSendTransfer(id, { addressAlias })
  const setAmount = (id: number, amount: string) =>
    setSendTransfer(id, { amount })
  const setBalanceAmount = (
    id: number,
    balanceAmount: Balance<NetworkTokens>,
  ) => {
    setSendTransfer(id, { balanceAmount })
    handleBalanceAmountChange(id, balanceAmount)
  }
  const setDcAmount = (id: number, dcAmount: string) =>
    setSendTransfer(id, { dcAmount })
  const setFee = (id: number, fee: Balance<NetworkTokens>) =>
    setSendTransfer(id, { fee })
  const setMemo = (id: number, memo: string) => setSendTransfer(id, { memo })

  /* ******** */
  /* ON MOUNT */
  /* ******** */

  // update oracles
  useEffect(() => {
    dispatch(fetchCurrentOraclePrice())
    dispatch(fetchPredictedOraclePrice())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  /* ************** */
  /* ON PROP UPDATE */
  /* ************** */

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
          amount = balanceAmount.toString(8, {
            decimalSeparator,
            groupSeparator,
            showTicker: true,
          })
        }
        return {
          id: i,
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
    scannedSendTransfers.forEach((sendTransfer) => {
      handleAddressChange(sendTransfer.id, sendTransfer.address)
      handleBalanceAmountChange(sendTransfer.id, sendTransfer.balanceAmount)
    })
    const hasPresetAmount = some(sendTransfers, ({ amount }) => !!amount)
    if (hasPresetAmount) setIsLocked(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanResult])

  /* *************** */
  /* ON STATE UPDATE */
  /* *************** */

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

  // compute fee
  useAsync(async () => {
    if (sendTransfers.length > 1) return
    const { id: sendTransferId, balanceAmount } = sendTransfers[0]
    return updateFee(sendTransferId, balanceAmount)
  }, [transferData?.amountToSeller])

  /* ******************** */
  /* STATE UPDATE HELPERS */
  /* ******************** */

  const setMaxAmount = () => {
    triggerNavHaptic()
    if (sendTransfers.length > 1) return
    const balance = account?.balance
    if (!balance) return
    const { id, fee } = sendTransfers[0]

    if (fee > balance) {
      const balanceStr = balance.toString(8, {
        decimalSeparator,
        groupSeparator,
        showTicker: false,
      })
      handleAmountChange(id, balanceStr)
    } else {
      const maxAmount = balance.minus(fee)
      const maxAmountStr = maxAmount.toString(8, {
        decimalSeparator,
        groupSeparator,
        showTicker: false,
      })
      handleAmountChange(id, maxAmountStr)
    }
  }

  const unlockForm = () => {
    setIsLocked(false)
    triggerNavHaptic()
  }

  // compute equivalent dc amount for burn txns
  const updateDcAmount = async (
    sendTransferId: number,
    balanceAmount: Balance<NetworkTokens>,
  ) => {
    if (type !== 'dc_burn') return
    const sendTransfer = sendTransfers.find(({ id }) => id === sendTransferId)
    if (!sendTransfer) return
    const balanceDc = await networkTokensToDataCredits(balanceAmount)
    if (!balanceDc) return
    const balanceDcString = balanceDc.toString(0, {
      decimalSeparator,
      groupSeparator,
      showTicker: false,
    })
    setDcAmount(sendTransferId, balanceDcString)
  }

  const updateFee = async (
    sendTransferId: number,
    balanceAmount: Balance<NetworkTokens>,
  ) => {
    const sendTransfer = sendTransfers.find(({ id }) => id === sendTransferId)
    if (!sendTransfer) return
    const { address, memo } = sendTransfer
    let dcFee
    if (type === 'payment') {
      dcFee = await calculatePaymentTxnFee(
        balanceAmount.integerBalance,
        getNonce(),
        address,
      )
    } else if (type === 'dc_burn') {
      dcFee = await calculateBurnTxnFee(
        balanceAmount.integerBalance,
        address,
        getNonce(),
        memo,
      )
    } else if (type === 'transfer') {
      dcFee = await calculateTransferTxnFee(transferData?.partialTransaction)
    } else {
      throw new Error('Unsupported transaction type')
    }
    const hntFee = feeToHNT(dcFee)
    setFee(sendTransferId, hntFee)
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

  const handleBalanceAmountChange = (
    id: number,
    balanceAmount: Balance<NetworkTokens>,
  ) => {
    updateDcAmount(id, balanceAmount)
    updateFee(id, balanceAmount)
  }

  const handleAddressChange = async (
    sendTransferId: number,
    newAddress: string,
  ) => {
    if (newAddress.match(/.*\.eth$/)) {
      setAddressLoading(sendTransferId, true)
      const { address: ensAddress } = await ensLookup(newAddress)
      if (ensAddress) {
        setAddressAlias(sendTransferId, newAddress)
        setAddress(sendTransferId, ensAddress)
        setAddressLoading(sendTransferId, false)
        return
      }
    }
    setAddressLoading(sendTransferId, false)
    setAddressAlias(sendTransferId, '')
    setAddress(sendTransferId, newAddress)
  }

  const handleAmountChange = (sendTransferId: number, stringAmount: string) => {
    if (stringAmount === decimalSeparator || stringAmount.includes('NaN')) {
      setAmount(sendTransferId, `0${decimalSeparator}`)
      setBalanceAmount(
        sendTransferId,
        new Balance(0, CurrencyType.networkToken),
      )
      return
    }
    const rawInteger = (stringAmount.split(decimalSeparator)[0] || stringAmount)
      .split(groupSeparator)
      .join('')
    const integer = parseInt(rawInteger, 10).toLocaleString(locale)
    let decimal = stringAmount.split(decimalSeparator)[1]
    if (integer === 'NaN') {
      setAmount(sendTransferId, '')
      setBalanceAmount(
        sendTransferId,
        new Balance(0, CurrencyType.networkToken),
      )
      return
    }
    if (decimal && decimal.length >= 9) decimal = decimal.slice(0, 8)
    setAmount(
      sendTransferId,
      stringAmount.includes(decimalSeparator)
        ? `${integer}${decimalSeparator}${decimal}`
        : integer,
    )
    setBalanceAmount(
      sendTransferId,
      Balance.fromFloat(
        parseFloat(`${rawInteger}.${decimal}`),
        CurrencyType.networkToken,
      ),
    )
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
    const transfer = createTransfer(
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

  const handleSubmit = async () => {
    try {
      let txns = []
      if (type === 'payment') {
        txns = await Promise.all(
          sendTransfers.map(async ({ address, balanceAmount }) => {
            return makePaymentTxn(
              balanceAmount.integerBalance,
              address,
              getNonce(),
            )
          }),
        )
      } else if (type === 'dc_burn') {
        txns = await Promise.all(
          sendTransfers.map(async ({ address, balanceAmount, memo }) => {
            return makeBurnTxn(
              balanceAmount.integerBalance,
              address,
              getNonce(),
              memo,
            )
          }),
        )
      } else if (type === 'transfer') {
        txns = [
          (await isSeller) ? handleSellerTransfer() : handleBuyerTransfer(),
        ]
      } else {
        throw new Error('Unsupported transaction type')
      }
      if (txns) {
        await Promise.all(txns.map(async (txn: any) => submitTxn(txn)))
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

  /* *********** */
  /* NAV HELPERS */
  /* *********** */

  const navBack = () => {
    navigation.navigate('Wallet')
    triggerNavHaptic()
  }

  const navScan = () => {
    navigation.navigate('SendScan')
    triggerNavHaptic()
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
          hasSufficientBalance={hasSufficientBalance}
          isLocked={isLocked}
          sendTransfers={sendTransfers}
          transferData={transferData}
          lastReportedActivity={lastReportedActivity}
          onAddressChange={handleAddressChange}
          onAmountChange={handleAmountChange}
          onDcAmountChange={setDcAmount}
          onMemoChange={setMemo}
          onScanPress={navScan}
          onSendMaxPress={setMaxAmount}
          onSubmit={handleSubmit}
          onUnlock={unlockForm}
          hasValidActivity={hasValidActivity}
          stalePocBlockCount={stalePocBlockCount}
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
