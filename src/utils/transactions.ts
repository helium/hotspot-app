import { Address } from '@helium/crypto-react-native'
import { AnyTransaction, PendingTransaction } from '@helium/http'
import {
  AddGatewayV1,
  AssertLocationV1,
  PaymentV2,
  TokenBurnV1,
  TransferHotspotV1,
} from '@helium/transactions'
import { getKeypair } from './secureAccount'
import { getAccount } from './appDataClient'
import { decimalSeparator, groupSeparator, locale } from './i18n'
import * as Logger from './logger'
import { SendDetails } from '../features/wallet/send/sendTypes'

export const makePaymentTxn = async (
  paymentDetails: Array<SendDetails>,
  nonce: number,
): Promise<PaymentV2> => {
  const keypair = await getKeypair()
  if (!keypair) throw new Error('missing keypair')
  const paymentTxn = new PaymentV2({
    payer: keypair.address,
    payments: paymentDetails.map(({ address, balanceAmount }) => ({
      payee: Address.fromB58(address),
      amount: balanceAmount.integerBalance,
    })),
    nonce,
  })

  return paymentTxn.sign({ payer: keypair })
}

export const makeAddGatewayTxn = async (
  partialTxnBin: string,
): Promise<AddGatewayV1> => {
  const addGatewayTxn = AddGatewayV1.fromString(partialTxnBin)
  const keypair = await getKeypair()

  return addGatewayTxn.sign({
    owner: keypair,
  })
}

export const makeAssertLocTxn = async (
  partialTxnBin: string,
): Promise<AssertLocationV1> => {
  const assertLocTxn = AssertLocationV1.fromString(partialTxnBin)
  const keypair = await getKeypair()

  return assertLocTxn.sign({
    owner: keypair,
  })
}

export const makeBurnTxn = async (
  amount: number,
  payeeB58: string,
  nonce: number,
  memo: string,
): Promise<TokenBurnV1> => {
  const keypair = await getKeypair()
  const payee = Address.fromB58(payeeB58)

  if (!keypair) throw new Error('missing keypair')

  const tokenBurnTxn = new TokenBurnV1({
    payer: keypair.address,
    payee,
    amount,
    nonce,
    memo,
  })

  return tokenBurnTxn.sign({ payer: keypair })
}

export const makeSellerTransferHotspotTxn = async (
  gatewayB58: string,
  buyerB58: string,
  seller: Address,
  amountToSeller: number,
): Promise<TransferHotspotV1 | undefined> => {
  const keypair = await getKeypair()

  if (!keypair) {
    Logger.breadcrumb('makeSellerTransferHotspotTxn: missing keypair')
    return undefined
  }

  const gateway = Address.fromB58(gatewayB58)
  const buyer = Address.fromB58(buyerB58)
  const buyerAccount = await getAccount(buyerB58)

  if (!buyerAccount) {
    Logger.breadcrumb('makeSellerTransferHotspotTxn: missing buyer account')
    return undefined
  }

  const transferHotspotTxn = new TransferHotspotV1({
    gateway,
    seller,
    buyer,
    amountToSeller,
    buyerNonce: (buyerAccount.speculativeNonce || 0) + 1,
  })
  return transferHotspotTxn.sign({ seller: keypair })
}

export const makeBuyerTransferHotspotTxn = async (
  transferHotspotTxn: TransferHotspotV1,
): Promise<TransferHotspotV1> => {
  const keypair = await getKeypair()
  return transferHotspotTxn.sign({ buyer: keypair })
}

export const getPayer = (txn: AnyTransaction | PendingTransaction) => {
  const pending = txn as PendingTransaction
  if (pending.txn) {
    return pending.txn.payer?.b58 || pending.txn.payer
  }

  const nonPending = (txn as unknown) as PaymentV2
  return nonPending.payer?.b58 || nonPending.payer
}

export const isPayer = (
  address: string | null = null,
  txn: AnyTransaction | PendingTransaction,
) => {
  if (!address) return false

  const payer = getPayer(txn)
  if (!payer) return false

  return payer === address
}

export const isPendingTransaction = (item: unknown) =>
  !!(item as PendingTransaction).createdAt

export const formatAmountInput = (formAmount: string) => {
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
