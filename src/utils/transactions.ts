import { Address } from '@helium/crypto-react-native'
import { AnyTransaction, PendingTransaction } from '@helium/http'
import {
  AddGatewayV1,
  AssertLocationV2,
  PaymentV2,
  TokenBurnV1,
  TransferHotspotV1,
} from '@helium/transactions'
import { getKeypair } from './secureAccount'
import { getAccount } from './appDataClient'
import * as Logger from './logger'

export const makePaymentTxn = async (
  amount: number,
  payeeB58: string,
  nonce: number,
): Promise<PaymentV2> => {
  const keypair = await getKeypair()
  const payee = Address.fromB58(payeeB58)

  if (!keypair) throw new Error('missing keypair')

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
  ownerB58: string,
  gatewayB58: string,
  payerB58: string,
  location: string,
  nonce: number,
  gain: number,
  elevation: number,
  stakingFee: number,
): Promise<AssertLocationV2> => {
  const keypair = await getKeypair()
  const owner = Address.fromB58(ownerB58)
  const gateway = Address.fromB58(gatewayB58)
  const payer = Address.fromB58(payerB58)
  const assertLocTxn = new AssertLocationV2({
    owner,
    gateway,
    payer,
    nonce,
    gain,
    elevation,
    location,
    stakingFee,
  })

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
