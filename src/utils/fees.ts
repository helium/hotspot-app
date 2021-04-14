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

export const useFees = () => {
  const { currentOraclePrice, predictedOraclePrices } = useSelector(
    (state: RootState) => state.heliumData,
  )

  const feeToHNT = useCallback(
    (balance?: Balance<DataCredits>) => {
      if (!balance) return new Balance<DataCredits>(0, CurrencyType.dataCredit)

      const prices = [currentOraclePrice, ...predictedOraclePrices]
      const oraclePrice = minBy(prices, (p) => p?.price.integerBalance || 0)
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
  amount: number,
  nonce: number,
  payeeB58?: string,
) => {
  const keypair = await getKeypair()
  if (!keypair) throw new Error('missing keypair')

  // if a payee isn't supplied, we use a dummy address
  let payee: Address
  if (payeeB58 && Address.isValid(payeeB58)) {
    payee = Address.fromB58(payeeB58)
  } else {
    payee = emptyB58Address()
  }
  const paymentTxn = new PaymentV2({
    payer: keypair.address,
    payments: [
      {
        payee,
        amount,
      },
    ],
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
  ownerB58: string,
  payerB58: string,
  nonce: number,
) => {
  const owner = Address.fromB58(ownerB58)
  const payer = payerB58 !== '' ? Address.fromB58(payerB58) : undefined

  const txn = new AssertLocationV2({
    owner,
    gateway: emptyB58Address(),
    payer,
    location: 'fffffffffffffff',
    gain: 12,
    elevation: 1,
    nonce,
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
