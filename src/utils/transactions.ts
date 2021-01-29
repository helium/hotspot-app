import { Address } from '@helium/crypto-react-native'
import { PendingTransaction, AnyTransaction } from '@helium/http'
import {
  PaymentV2,
  AddGatewayV1,
  TokenBurnV1,
  AssertLocationV1,
  TransferHotspotV1,
} from '@helium/transactions'
import { getKeypair } from './secureAccount'
import { getAccount } from './appDataClient'

export const makePaymentTxn = async (
  amount: number,
  payeeB58: string,
  nonce: number,
): Promise<string> => {
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

  const signedPaymentTxn = await paymentTxn.sign({ payer: keypair })
  return signedPaymentTxn.toString()
}

export const makeAddGatewayTxn = async (partialTxnBin: string) => {
  const addGatewayTxn = AddGatewayV1.fromString(partialTxnBin)
  const keypair = await getKeypair()

  const signedTxn = await addGatewayTxn.sign({
    owner: keypair,
  })

  const serialized = signedTxn.serialize()
  return Buffer.from(serialized).toString('base64')
}

export const makeAssertLocTxn = async (partialTxnBin: string) => {
  const assertLocTxn = AssertLocationV1.fromString(partialTxnBin)
  const keypair = await getKeypair()

  const signedTxn = await assertLocTxn.sign({
    owner: keypair,
  })

  const serialized = signedTxn.serialize()
  return Buffer.from(serialized).toString('base64')
}

export const makeBurnTxn = async (
  amount: number,
  payeeB58: string,
  nonce: number,
  memo: string,
): Promise<string> => {
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

  const signedTxn = await tokenBurnTxn.sign({ payer: keypair })
  return signedTxn.toString()
}

export const makeSellerTransferHotspotTxn = async (
  gatewayB58: string,
  buyerB58: string,
  seller: Address,
  amountToSeller: number,
) => {
  const keypair = await getKeypair()

  if (!keypair) throw new Error('missing keypair')

  const gateway = Address.fromB58(gatewayB58)
  const buyer = Address.fromB58(buyerB58)
  const buyerAccount = await getAccount(buyerB58)

  if (!buyerAccount || !buyerAccount.speculativeNonce)
    throw new Error('missing buyer speculativeNonce')

  const transferHotspotTxn = new TransferHotspotV1({
    gateway,
    seller,
    buyer,
    amountToSeller,
    buyerNonce: buyerAccount.speculativeNonce + 1,
  })
  const signedTxn = await transferHotspotTxn.sign({ seller: keypair })
  return signedTxn.toString()
}

export const makeBuyerTransferHotspotTxn = async (
  transferHotspotTxn: TransferHotspotV1,
) => {
  const keypair = await getKeypair()
  const signedTxn = await transferHotspotTxn.sign({ buyer: keypair })
  return signedTxn.toString()
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
