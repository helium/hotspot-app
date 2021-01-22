import React from 'react'
import {
  AnyTransaction,
  PendingTransaction,
  PaymentV1,
  PaymentV2,
} from '@helium/http'
import Balance, { NetworkTokens } from '@helium/currency'
import Box from '../../../../components/Box'
import Text from '../../../../components/Text'
import { isPayer } from '../../../../utils/transactions'
import PaymentItem from './PaymentItem'

type Props = { item: AnyTransaction | PendingTransaction; address: string }
const SentHNT = ({ item, address }: Props) => {
  if (
    (item.type !== 'payment_v1' && item.type !== 'payment_v2') ||
    !isPayer(address, item)
  )
    return null

  const v1 = (item as unknown) as PaymentV1

  const v2 = (item as unknown) as PaymentV2
  let payments: { payee: string; amount: Balance<NetworkTokens> }[] = []
  if (v2.payments !== undefined) {
    payments = v2.payments.map((p) => ({
      payee: p.payee,
      amount: p.amount,
    }))
  } else if (v1.payee !== undefined) {
    payments = [{ payee: v1.payee, amount: v1.amount || 0 }]
  }
  return (
    <Box flex={1}>
      <Text
        variant="light"
        fontSize={15}
        color="blueBright"
        alignSelf="flex-end"
        marginBottom="m"
      >
        {`-${v2.fee.toString()}`}
      </Text>

      <PaymentItem address={v1.payer} isPayer />
      {payments.map((p) => (
        <PaymentItem address={p.payee} isPayer={p.payee === address} />
      ))}
    </Box>
  )
}

export default SentHNT
