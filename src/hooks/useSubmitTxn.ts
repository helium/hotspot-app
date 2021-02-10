import Balance, { CurrencyType } from '@helium/currency'
import { PendingTransaction, PaymentV2 as HttpPayment } from '@helium/http'
import {
  AddGatewayV1,
  AssertLocationV1,
  PaymentV2 as PaymentTxn,
  TokenBurnV1,
  TransferHotspotV1,
} from '@helium/transactions'
import { useSelector } from 'react-redux'

import activitySlice from '../store/activity/activitySlice'
import { RootState } from '../store/rootReducer'
import { useAppDispatch } from '../store/store'
import { submitTransaction } from '../utils/appDataClient'

type SignableTransaction =
  | PaymentTxn
  | AddGatewayV1
  | AssertLocationV1
  | TokenBurnV1
  | TransferHotspotV1

type Submitter = (txn: SignableTransaction) => Promise<PendingTransaction>

const useSubmitTxn = (): Submitter => {
  const dispatch = useAppDispatch()

  const {
    heliumData: { blockHeight },
  } = useSelector((state: RootState) => state)

  const submitter: Submitter = async (txn) => {
    // serialize the txn
    const serializedTxn = txn.toString()

    // submit to blockchain
    const pendingTxn = await submitTransaction(serializedTxn)

    // construct mock pending txn
    pendingTxn.type = txn.type
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
) => {
  if (txn instanceof PaymentTxn) {
    const pending = txn as PaymentTxn

    const data = {
      type: pending.type,
      fee: new Balance(pending.fee, CurrencyType.dataCredit),
      payer: txn.payer?.b58 || '',
      signature: '',
      payments: txn.payments.map((p) => ({
        payee: p.payee.b58,
        amount: new Balance(p.amount, CurrencyType.networkToken),
      })),
      height: blockHeight,
      hash,
    } as HttpPayment

    let totalAmount = new Balance(0, CurrencyType.networkToken)
    data.payments.forEach((p) => {
      totalAmount = totalAmount.plus(p.amount)
    })

    data.totalAmount = totalAmount

    return data
  }

  return txn
}

export default useSubmitTxn
