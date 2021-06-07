import React from 'react'
import {
  PendingTransaction,
  PaymentV1,
  PaymentV2,
  AnyTransaction,
} from '@helium/http'
import Balance, { CurrencyType } from '@helium/currency'
import { Payment as PaymentType } from '@helium/http/build/models/Transaction'
import Box from '../../../../components/Box'
import PaymentItem from './PaymentItem'
import { decodeMemoString, DEFAULT_MEMO } from '../../../../utils/transactions'

type Props = { item: AnyTransaction | PendingTransaction; address: string }
const Payment = ({ item, address }: Props) => {
  if (item.type !== 'payment_v1' && item.type !== 'payment_v2') return null

  const payer = getPayer(item)
  const payments = getPayments(item)

  return (
    <Box flex={1}>
      <PaymentItem text={payer} mode="from" isMyAccount={payer === address} />
      {payments.map((p, index) => (
        <Box key={p.payee}>
          <PaymentItem
            text={p.payee}
            isMyAccount={p.payee === address}
            mode="to"
            isFirst={false}
            isLast={
              (p.memo === undefined || p.memo === DEFAULT_MEMO) &&
              index === payments.length - 1
            }
          />
          {p.memo !== undefined && p.memo !== DEFAULT_MEMO && (
            <PaymentItem
              text={decodeMemoString(p.memo)}
              mode="memo"
              isFirst={false}
              isLast={index === payments.length - 1}
              isMemo
            />
          )}
        </Box>
      ))}
    </Box>
  )
}

const getPayer = (item: AnyTransaction | PendingTransaction): string => {
  if (item instanceof PaymentV2 || item instanceof PaymentV1) {
    return item.payer
  }

  return (item as PendingTransaction).txn?.payer
}

const getPayments = (
  item: AnyTransaction | PendingTransaction,
): PaymentType[] => {
  if (item instanceof PaymentV2) {
    return item.payments
  }

  if (item instanceof PaymentV1) {
    return [{ payee: item.payee, amount: item.amount }]
  }

  return ((item as PendingTransaction).txn?.payments || []).map(
    (p: { payee: string; amount: number; memo: string }) => ({
      ...p,
      amount: new Balance(p.amount, CurrencyType.networkToken),
    }),
  )
}

export default Payment
