import Balance, { CurrencyType } from '@helium/currency'
import {
  AddGatewayV1 as HttpAddGatewayV1,
  AssertLocationV1 as HttpAssertLocationV1,
  AssertLocationV2 as HttpAssertLocationV2,
  PaymentV2 as HttpPaymentV2,
  PendingTransaction as PendingTransactionType,
  TransferHotspotV1 as HttpTransferHotspotV1,
} from '@helium/http'
import PendingTransaction from '@helium/http/build/models/PendingTransaction'
import {
  AddGatewayV1,
  AssertLocationV1,
  AssertLocationV2,
  PaymentV2,
  TokenBurnV1,
  TransferHotspotV1,
} from '@helium/transactions'
import { useSelector } from 'react-redux'

import activitySlice from '../store/activity/activitySlice'
import { RootState } from '../store/rootReducer'
import { useAppDispatch } from '../store/store'
import { postWallet } from '../utils/walletClient'

type SignableTransaction =
  | PaymentV2
  | AddGatewayV1
  | AssertLocationV2
  | TokenBurnV1
  | TransferHotspotV1

type Submitter = (txn: SignableTransaction) => Promise<PendingTransactionType>

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
    const pendingTxn = new PendingTransaction(apiResponse)

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
  if (txn instanceof PaymentV2) {
    const pending = txn as PaymentV2

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
    } as HttpPaymentV2

    let totalAmount = new Balance(0, CurrencyType.networkToken)
    data.payments.forEach((p) => {
      totalAmount = totalAmount.plus(p.amount)
    })

    data.totalAmount = totalAmount

    return data
  }

  if (txn instanceof AssertLocationV1) {
    const pending = txn as AssertLocationV1

    const data = {
      type: pending.type,
      stakingFee: new Balance(pending.stakingFee, CurrencyType.dataCredit),
      payerSignature: '',
      payer: pending.payer?.b58 || '',
      ownerSignature: '',
      owner: pending.owner?.b58 || '',
      nonce: pending.nonce,
      location: pending.location,
      height: blockHeight,
      hash,
      gateway: pending.gateway?.b58 || '',
      gatewaySignature: '',
      fee: new Balance(pending.fee, CurrencyType.dataCredit),
    } as HttpAssertLocationV1

    return data
  }

  if (txn instanceof AssertLocationV2) {
    const pending = txn as AssertLocationV2
    return {
      type: pending.type,
      stakingFee: new Balance(pending.stakingFee, CurrencyType.dataCredit),
      payerSignature: '',
      payer: pending.payer?.b58 || '',
      ownerSignature: '',
      owner: pending.owner?.b58 || '',
      nonce: pending.nonce,
      location: pending.location,
      height: blockHeight,
      hash,
      gateway: pending.gateway?.b58 || '',
      fee: new Balance(pending.fee, CurrencyType.dataCredit),
      gain: pending.gain || 0,
      elevation: pending.elevation || 0,
    } as HttpAssertLocationV2
  }

  if (txn instanceof AddGatewayV1) {
    const pending = txn as AddGatewayV1

    const data = {
      type: pending.type,
      stakingFee: new Balance(pending.stakingFee, CurrencyType.dataCredit),
      payerSignature: '',
      payer: pending.payer?.b58 || '',
      ownerSignature: '',
      owner: pending.owner?.b58 || '',
      height: blockHeight,
      hash,
      gateway: pending.gateway?.b58 || '',
      gatewaySignature: '',
      fee: new Balance(pending.fee, CurrencyType.dataCredit),
    } as HttpAddGatewayV1

    return data
  }

  if (txn instanceof TransferHotspotV1) {
    const pending = txn as TransferHotspotV1

    const data = {
      type: pending.type,
      buyer: pending.buyer?.b58 || '',
      seller: pending.seller?.b58 || '',
      height: blockHeight,
      hash,
      gateway: pending.gateway?.b58 || '',
      fee: new Balance(pending.fee, CurrencyType.dataCredit),
    } as HttpTransferHotspotV1

    return data
  }
  return txn
}

export default useSubmitTxn
