import Balance, { CurrencyType, NetworkTokens } from '@helium/currency'
import {
  deleteWallet,
  getWallet,
  postWallet,
} from '../../../utils/walletClient'

type TransferHTTP = {
  amount_to_seller: number // in bones
  partial_transaction: string
  gateway: string
  seller: string
  buyer: string
}

export type Transfer = {
  amountToSeller?: Balance<NetworkTokens>
  partialTransaction: string
  gateway: string
  seller: string
  buyer: string
}

export const createTransfer = async (
  hotspotAddress: string,
  sellerAddress: string,
  buyerAddress: string,
  partialTransactions: string,
  amountToSeller: number,
) => {
  return postWallet('transfers', {
    gateway: hotspotAddress,
    seller: sellerAddress,
    buyer: buyerAddress,
    partial_transaction: partialTransactions,
    amount_to_seller: amountToSeller,
  })
}

export const getTransfer = async (
  hotspotAddress: string,
): Promise<Transfer | undefined> => {
  const transfer: TransferHTTP = await getWallet(`transfers/${hotspotAddress}`)
  return convertTransfer(transfer)
}

export const deleteTransfer = async (
  hotspotAddress: string,
  complete: boolean,
): Promise<boolean | undefined> => {
  try {
    const transfer: string = await deleteWallet(`transfers/${hotspotAddress}`, {
      complete,
    })
    return transfer === 'transfer deleted'
  } catch (e) {
    return false
  }
}

const convertTransfer = (transfer?: TransferHTTP): Transfer | undefined => {
  if (!transfer) return undefined
  return {
    amountToSeller: new Balance(
      transfer.amount_to_seller,
      CurrencyType.networkToken,
    ),
    partialTransaction: transfer.partial_transaction,
    gateway: transfer.gateway,
    seller: transfer.seller,
    buyer: transfer.buyer,
  }
}
