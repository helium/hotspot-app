import React from 'react'
import {
  PendingTransaction,
  PaymentV1,
  PaymentV2,
  AnyTransaction,
} from '@helium/http'
import Balance, { CurrencyType, NetworkTokens } from '@helium/currency'
import Box from '../../../../components/Box'
import PaymentItem from './PaymentItem'

type Payments = { payee: string; amount: Balance<NetworkTokens> }[]
type Props = { item: AnyTransaction | PendingTransaction; address: string }
const Payment = ({ item, address }: Props) => {
  if (item.type !== 'payment_v1' && item.type !== 'payment_v2') return null

  const payer = getPayer(item)
  const payments = getPayments(item)

  return (
    <Box flex={1}>
      <PaymentItem text={payer} mode="from" isMyAccount={payer === address} />
      {payments.map((p, index) => (
        <PaymentItem
          key={p.payee}
          text={p.payee}
          isMyAccount={p.payee === address}
          mode="to"
          isFirst={false}
          isLast={index === payments.length - 1}
        />
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

const getPayments = (item: AnyTransaction | PendingTransaction): Payments => {
  if (item instanceof PaymentV2) {
    return item.payments
  }

  if (item instanceof PaymentV1) {
    return [{ payee: item.payee, amount: item.amount }]
  }

  return ((item as PendingTransaction).txn?.payments || []).map(
    (p: { payee: string; amount: number }) => ({
      ...p,
      amount: new Balance(p.amount, CurrencyType.networkToken),
    }),
  )
}

export default Payment
