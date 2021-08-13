import { Address } from '@helium/crypto-react-native'
import {
  AddGatewayV1,
  AssertLocationV2,
  PaymentV2,
  TokenBurnV1,
  TransferHotspotV1,
} from '@helium/transactions'
import Balance, {
  CurrencyType,
  DataCredits,
  NetworkTokens,
} from '@helium/currency'
import { minBy } from 'lodash'
import { useSelector } from 'react-redux'
import { useCallback } from 'react'
import { getKeypair } from './secureAccount'
import { RootState } from '../store/rootReducer'
import { SendDetails } from '../features/wallet/send/sendTypes'
import { encodeMemoString } from './transactions'

export const useFees = () => {
  const { currentOraclePrice, predictedOraclePrices } = useSelector(
    (state: RootState) => state.heliumData,
  )

  const feeToHNT = useCallback(
    (balance?: Balance<DataCredits>) => {
      if (!balance) return new Balance<DataCredits>(0, CurrencyType.dataCredit)

      const prices = [currentOraclePrice, ...predictedOraclePrices]
      const oraclePrice = minBy(prices, (p) => p?.price?.integerBalance)
      // ensure precision is only 8 decimals
      const feeHNTInteger = Math.trunc(
        balance.toNetworkTokens(oraclePrice?.price).integerBalance,
      )
      return new Balance<NetworkTokens>(
        feeHNTInteger,
        CurrencyType.networkToken,
      )
    },
    [currentOraclePrice, predictedOraclePrices],
  )

  return { feeToHNT }
}

const emptyB58Address = () =>
  Address.fromB58('13PuqyWXzPYeXcF1B9ZRx7RLkEygeL374ZABiQdwRSNzASdA1sn')

export const calculatePaymentTxnFee = async (
  paymentDetails: Array<SendDetails>,
  nonce: number,
) => {
  const keypair = await getKeypair()
  if (!keypair) throw new Error('missing keypair')

  const paymentTxn = new PaymentV2({
    payer: keypair.address,
    payments: paymentDetails.map(({ address, balanceAmount, memo }) => ({
      // if a payee address isn't supplied, we use a dummy address
      payee:
        address && Address.isValid(address)
          ? Address.fromB58(address)
          : emptyB58Address(),
      amount: balanceAmount.integerBalance,
      memo: encodeMemoString(memo),
    })),
    nonce,
  })

  return new Balance(paymentTxn.fee || 0, CurrencyType.dataCredit)
}

export const calculateAddGatewayFee = (ownerB58: string, payerB58: string) => {
  const owner = Address.fromB58(ownerB58)
  const payer = Address.fromB58(payerB58)

  const txn = new AddGatewayV1({
    owner,
    gateway: emptyB58Address(),
    payer,
  })

  return { fee: txn.fee || 0, stakingFee: txn.stakingFee || 0 }
}

export const calculateAssertLocFee = (
  ownerB58: string | undefined,
  payerB58: string | undefined,
  nonce: number | undefined,
) => {
  const owner = ownerB58 ? Address.fromB58(ownerB58) : emptyB58Address()
  const payer = payerB58 ? Address.fromB58(payerB58) : emptyB58Address()

  const txn = new AssertLocationV2({
    owner,
    gateway: emptyB58Address(),
    payer,
    location: 'fffffffffffffff',
    gain: 12,
    elevation: 1,
    nonce: nonce || 1,
  })

  return { fee: txn.fee || 0, stakingFee: txn.stakingFee || 0 }
}

export const calculateBurnTxnFee = async (
  amount: number,
  payeeB58: string,
  nonce: number,
  memo: string,
) => {
  const keypair = await getKeypair()
  if (!keypair) throw new Error('missing keypair')

  // if a payee isn't supplied, we use a dummy address
  const payee = Address.isValid(payeeB58)
    ? Address.fromB58(payeeB58)
    : emptyB58Address()

  const tokenBurnTxn = new TokenBurnV1({
    payer: keypair.address,
    payee,
    amount,
    nonce,
    memo,
  })

  return new Balance(tokenBurnTxn.fee || 0, CurrencyType.dataCredit)
}

export const calculateTransferTxnFee = async (
  partialTransaction: string | undefined,
) => {
  const transactionString = partialTransaction
  const transferHotspotTxn = transactionString
    ? TransferHotspotV1.fromString(transactionString)
    : new TransferHotspotV1({})
  return new Balance(transferHotspotTxn.fee || 0, CurrencyType.dataCredit)
}
