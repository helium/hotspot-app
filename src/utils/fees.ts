import { Address } from '@helium/crypto-react-native'
import {
  PaymentV2,
  AddGatewayV1,
  Transaction,
  TokenBurnV1,
  AssertLocationV1,
  TransferHotspotV1,
} from '@helium/transactions'
import Balance, { DataCredits, CurrencyType } from '@helium/currency'
import { minBy } from 'lodash'
import { useSelector } from 'react-redux'
import { getKeypair } from './secureAccount'
import { RootState } from '../store/rootReducer'

export const stakingFeeAddGateway = Transaction.stakingFeeTxnAddGatewayV1
export const stakingFeeAssertLoc = Transaction.stakingFeeTxnAssertLocationV1

export const useFees = () => {
  const {
    heliumData: { currentOraclePrice, predictedOraclePrices },
  } = useSelector((state: RootState) => state)

  const feeToHNT = (balance?: Balance<DataCredits>) => {
    if (!balance) return new Balance<DataCredits>(0, CurrencyType.dataCredit)

    const prices = [currentOraclePrice, ...predictedOraclePrices]
    const oraclePrice = minBy(prices, (p) => p?.price.integerBalance || 0)
    return balance.toNetworkTokens(oraclePrice?.price)
  }

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

  return txn.fee
}

export const calculateAssertLocFee = (
  ownerB58: string,
  payerB58: string,
  nonce: number,
) => {
  const owner = Address.fromB58(ownerB58)
  const payer = payerB58 !== '' ? Address.fromB58(payerB58) : undefined

  const txn = new AssertLocationV1({
    owner,
    gateway: emptyB58Address(),
    payer,
    location: 'fffffffffffffff',
    nonce,
  })

  return txn.fee
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
