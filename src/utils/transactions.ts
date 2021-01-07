import { Address } from '@helium/crypto-react-native'
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
