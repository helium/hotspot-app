import { PendingTransaction } from '@helium/http'
import {
  AddGatewayV1,
  AssertLocationV1,
  PaymentV2,
  TokenBurnV1,
  TransferHotspotV1,
} from '@helium/transactions'
import activitySlice from '../store/activity/activitySlice'
import { useAppDispatch } from '../store/store'
import { submitTransaction } from '../utils/appDataClient'

type SignableTransaction =
  | PaymentV2
  | AddGatewayV1
  | AssertLocationV1
  | TokenBurnV1
  | TransferHotspotV1

type Submitter = (txn: SignableTransaction) => Promise<PendingTransaction>

const useSubmitTxn = (): Submitter => {
  const dispatch = useAppDispatch()

  const submitter: Submitter = async (txn) => {
    // serialize the txn
    const serializedTxn = txn.toString()

    // submit to blockchain
    const pendingTxn = await submitTransaction(serializedTxn)

    // construct mock pending txn
    pendingTxn.type = txn.type
    pendingTxn.status = 'pending'
    pendingTxn.txn = populatePendingTxn(txn)

    // dispatch pending txn to activity slice
    dispatch(activitySlice.actions.addPendingTransaction(pendingTxn))
    return pendingTxn
  }

  return submitter
}

const populatePendingTxn = (txn: SignableTransaction) => {
  const pendingTxn = { fee: txn.fee, type: txn.type } as Record<string, any>

  if (txn instanceof PaymentV2) {
    pendingTxn.payer = txn?.payer?.b58
    pendingTxn.payments = txn.payments.map((p) => ({
      payee: p.payee.b58,
      amount: p.amount,
    }))
    pendingTxn.nonce = txn.nonce
  }

  return pendingTxn
}

export default useSubmitTxn
