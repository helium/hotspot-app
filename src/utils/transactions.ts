import { Address } from '@helium/crypto-react-native'
import {
  AddGatewayV1,
  AssertLocationV2,
  PaymentV2,
  TokenBurnV1,
  TransferHotspotV1,
  TransferHotspotV2,
} from '@helium/transactions'
import Balance, { CurrencyType } from '@helium/currency'
import { getKeypair } from './secureAccount'
import { getAccount } from './appDataClient'
import { decimalSeparator, groupSeparator } from './i18n'
import * as Logger from './logger'
import { SendDetails } from '../features/wallet/send/sendTypes'

export const DEFAULT_MEMO = 'AAAAAAAAAAA='

export const encodeMemoString = (utf8Input: string | undefined) => {
  if (!utf8Input) return undefined
  const buff = Buffer.from(utf8Input, 'utf8')
  return buff.toString('base64')
}

export const decodeMemoString = (base64String: string | undefined | null) => {
  if (!base64String) return ''
  const buff = Buffer.from(base64String, 'base64')
  return buff.toString('utf8')
}

export const makePaymentTxn = async (
  paymentDetails: Array<SendDetails>,
  nonce: number,
): Promise<PaymentV2> => {
  const keypair = await getKeypair()
  if (!keypair) throw new Error('missing keypair')
  const paymentTxn = new PaymentV2({
    payer: keypair.address,
    payments: paymentDetails.map(({ address, balanceAmount, memo }) => ({
      payee: Address.fromB58(address),
      amount: balanceAmount.integerBalance,
      memo: encodeMemoString(memo),
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
  const ownerIsPayer = payerB58 === ownerB58

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
    payer: ownerIsPayer ? keypair : undefined,
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

export const makeTransferV2Txn = async (
  gatewayB58: string,
  owner: Address,
  newOwnerB58: string,
  gatewaySpeculativeNonce: number,
): Promise<TransferHotspotV2> => {
  const keypair = await getKeypair()
  const newOwner = Address.fromB58(newOwnerB58)
  const gateway = Address.fromB58(gatewayB58)
  const nonce = gatewaySpeculativeNonce + 1

  if (!keypair) throw new Error('missing keypair')

  const transferV2Txn = new TransferHotspotV2({
    gateway,
    owner,
    newOwner,
    nonce,
  })
  return transferV2Txn.sign({ owner: keypair })
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

export const getInteger = (stringAmount: string) => {
  return (stringAmount.split(decimalSeparator)[0] || '0')
    .split(groupSeparator)
    .join('')
}

export const getDecimal = (stringAmount: string) => {
  let decimal = stringAmount.split(decimalSeparator)[1]
  if (decimal && decimal.length >= 9) decimal = decimal.slice(0, 8)
  return decimal
}

export const stringAmountToBalance = (formAmount: string) => {
  if (!formAmount || formAmount === decimalSeparator) {
    return new Balance(0, CurrencyType.networkToken)
  }
  const integer = getInteger(formAmount)
  const decimal = getDecimal(formAmount)
  const floatAmount = parseFloat(`${integer}.${decimal}`)
  return Balance.fromFloat(floatAmount, CurrencyType.networkToken)
}

export const getMemoBytesLeft = (base64Memo?: string) => {
  if (!base64Memo) return { numBytes: 8, valid: true }
  const buff = Buffer.from(base64Memo, 'base64')
  const size = buff.byteLength
  return { numBytes: size < 8 ? 8 - size : 0, valid: size <= 8 }
}
