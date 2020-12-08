/* eslint-disable import/prefer-default-export */
import { Address, Keypair } from '@helium/crypto-react-native'
import { PaymentV2, AddGatewayV1, Transaction } from '@helium/transactions'
import { cloneDeep } from 'lodash'
import { getString } from './account'
import { sign } from './crypto'

const emptyB58Address = () =>
  Address.fromB58('13PuqyWXzPYeXcF1B9ZRx7RLkEygeL374ZABiQdwRSNzASdA1sn')

export const calculatePaymentTxnFee = async (
  amount: number,
  nonce: number,
  payeeB58?: string,
) => {
  const rawKeypair = await getString('keypair')
  if (!rawKeypair) return

  const parsedKeypair = JSON.parse(rawKeypair)
  const keypair = new Keypair(parsedKeypair)

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

  return paymentTxn.fee
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

export const stakingFee = Transaction.stakingFeeTxnAddGatewayV1

const makeSignature = async (unsignedTxn: AddGatewayV1) => {
  const txn = unsignedTxn.serialize()
  const stringTxn = Buffer.from(txn).toString('base64')
  const signature = await sign(stringTxn)
  if (!signature) return

  return Buffer.from(signature, 'base64')
}

export const makeAddGatewayTxn = async (partialTxnBin: string) => {
  const addGatewayTxn = AddGatewayV1.fromString(partialTxnBin)

  const unsignedTxn = cloneDeep(addGatewayTxn)
  unsignedTxn.ownerSignature = undefined
  unsignedTxn.gatewaySignature = undefined

  const signature = await makeSignature(unsignedTxn)
  addGatewayTxn.ownerSignature = signature

  const serialized = addGatewayTxn.serialize()
  return Buffer.from(serialized).toString('base64')
}
