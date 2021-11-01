import {
  AddGatewayV1,
  AssertLocationV2,
  PaymentV2,
  TokenBurnV1,
  TransferHotspotV1,
  TransferHotspotV2,
} from '@helium/transactions'
import { useSelector } from 'react-redux'
import { TxnType } from '../features/wallet/root/walletTypes'

import activitySlice, {
  HttpTransaction,
  HttpPendingTransaction,
} from '../store/activity/activitySlice'
import { RootState } from '../store/rootReducer'
import { useAppDispatch } from '../store/store'
import { postWallet } from '../utils/walletClient'

type SignableTransaction =
  | PaymentV2
  | AddGatewayV1
  | AssertLocationV2
  | TokenBurnV1
  | TransferHotspotV1
  | TransferHotspotV2

type Submitter = (txn: SignableTransaction) => Promise<HttpPendingTransaction>

const useSubmitTxn = (): Submitter => {
  const dispatch = useAppDispatch()

  const {
    heliumData: { blockHeight },
  } = useSelector((state: RootState) => state)

  const submitter: Submitter = async (txn) => {
    // serialize the txn
    const serializedTxn = txn.toString()

    // submit to blockchain
    const apiResponse = await postWallet('transactions', {
      txn: serializedTxn,
    })
    const pendingTxn = apiResponse as HttpPendingTransaction

    // construct mock pending txn
    pendingTxn.type = txn.type as TxnType
    pendingTxn.status = 'pending'
    pendingTxn.txn = populatePendingTxn(txn, blockHeight || 0, pendingTxn.hash)

    // dispatch pending txn to activity slice
    dispatch(activitySlice.actions.addPendingTransaction(pendingTxn))
    return pendingTxn
  }

  return submitter
}

const populatePendingTxn = (
  txn: SignableTransaction,
  blockHeight: number,
  hash: string,
): HttpTransaction => {
  if (txn instanceof PaymentV2) {
    const pending = txn as PaymentV2

    const data = {
      time: 0,
      type: pending.type,
      fee: pending.fee,
      payer: pending.payer?.b58 || '',
      signature: '',
      payments: pending.payments.map((p) => ({
        payee: p.payee.b58,
        amount: p.amount,
      })),
      height: blockHeight,
      hash,
    } as HttpTransaction

    return data
  }

  if (txn instanceof AssertLocationV2) {
    const pending = txn as AssertLocationV2
    return {
      time: 0,
      type: pending.type,
      stakingFee: pending.stakingFee,
      payerSignature: '',
      payer: pending.payer?.b58 || '',
      ownerSignature: '',
      owner: pending.owner?.b58 || '',
      nonce: pending.nonce,
      location: pending.location,
      height: blockHeight,
      hash,
      gateway: pending.gateway?.b58 || '',
      fee: pending.fee,
      gain: pending.gain || 0,
      elevation: pending.elevation || 0,
    } as HttpTransaction
  }

  if (txn instanceof AddGatewayV1) {
    const pending = txn as AddGatewayV1

    const data = {
      time: 0,
      type: pending.type,
      stakingFee: pending.stakingFee,
      payerSignature: '',
      payer: pending.payer?.b58 || '',
      ownerSignature: '',
      owner: pending.owner?.b58 || '',
      height: blockHeight,
      hash,
      gateway: pending.gateway?.b58 || '',
      gatewaySignature: '',
      fee: pending.fee,
    } as HttpTransaction

    return data
  }

  if (txn instanceof TransferHotspotV1) {
    const pending = txn as TransferHotspotV1

    const data = {
      time: 0,
      type: pending.type,
      buyer: pending.buyer?.b58 || '',
      seller: pending.seller?.b58 || '',
      height: blockHeight,
      hash,
      gateway: pending.gateway?.b58 || '',
      fee: pending.fee,
    } as HttpTransaction

    return data
  }

  return {} as HttpTransaction
}

export default useSubmitTxn
