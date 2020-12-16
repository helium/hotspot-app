import { Address } from '@helium/crypto-react-native'
import { PaymentV2, AddGatewayV1, Transaction } from '@helium/transactions'
import { getKeypair } from './secureAccount'

const emptyB58Address = () =>
  Address.fromB58('13PuqyWXzPYeXcF1B9ZRx7RLkEygeL374ZABiQdwRSNzASdA1sn')

export const calculatePaymentTxnFee = async (
  amount: number,
  nonce: number,
  payeeB58?: string,
) => {
  const keypair = await getKeypair()
  if (!keypair) return

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

export const makeAddGatewayTxn = async (partialTxnBin: string) => {
  const addGatewayTxn = AddGatewayV1.fromString(partialTxnBin)
  const keypair = await getKeypair()

  const signedTxn = await addGatewayTxn.sign({
    owner: keypair,
  })

  const serialized = signedTxn.serialize()
  return Buffer.from(serialized).toString('base64')
}
