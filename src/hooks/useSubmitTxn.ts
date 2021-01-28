import { AnyTransaction } from '@helium/http'
import activitySlice from '../store/activity/activitySlice'
import { useAppDispatch } from '../store/store'
import { submitTransaction } from '../utils/appDataClient'

type Submitter = (txn: AnyTransaction) => void

// make this a hook, useSubmitTxn
const useSubmitTxn = (): Submitter => {
  const dispatch = useAppDispatch()

  const submitter = async (txn: AnyTransaction) => {
    // serialize the txn
    const serializedTxn = txn.toString()
    // submit to blockchain
    const pendingTxn = await submitTransaction(serializedTxn)
    // construct mock pending txn
    pendingTxn.type = txn.type
    pendingTxn.status = 'pending'
    // pendingTxn.txn = { fee: txn.fee }
    // dispatch pending txn to activity slice
    dispatch(activitySlice.actions.addPendingTransaction(pendingTxn))
  }

  return submitter
}

export default useSubmitTxn
