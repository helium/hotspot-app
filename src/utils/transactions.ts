import { Address } from '@helium/crypto-react-native'
import { PendingTransaction, AnyTransaction } from '@helium/http'
import { PaymentV2, AddGatewayV1 } from '@helium/transactions'
import { getKeypair } from './secureAccount'

export const makePaymentTxn = async (
  amount: number,
  payeeB58: string,
  nonce: number,
) => {
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
