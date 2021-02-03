import React from 'react'
import { PendingTransaction, PaymentV1, PaymentV2 } from '@helium/http'
import Balance, { CurrencyType, NetworkTokens } from '@helium/currency'
import Box from '../../../../components/Box'
import PaymentItem from './PaymentItem'

type AnyPaymentTransaction = PaymentV1 | PaymentV2 | PendingTransaction
type Payments = { payee: string; amount: Balance<NetworkTokens> }[]

type Props = { item: AnyPaymentTransaction; address: string }
const Payment = ({ item, address }: Props) => {
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

const getPayer = (item: AnyPaymentTransaction): string => {
  if (item instanceof PaymentV2 || item instanceof PaymentV1) {
    return item.payer
  }

  return item?.txn?.payer
}

const getPayments = (item: AnyPaymentTransaction): Payments => {
  if (item instanceof PaymentV2) {
    return item.payments
  }

  if (item instanceof PaymentV1) {
    return [{ payee: item.payee, amount: item.amount }]
  }

  return (item?.txn?.payments || []).map(
    (p: { payee: string; amount: number }) => ({
      ...p,
      amount: new Balance(p.amount, CurrencyType.networkToken),
    }),
  )
}

export default Payment
