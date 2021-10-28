import React, { useMemo } from 'react'
import Box from '../../../../components/Box'
import PaymentItem from './PaymentItem'
import { decodeMemoString, DEFAULT_MEMO } from '../../../../utils/transactions'
import { HttpTransaction } from '../../../../store/activity/activitySlice'

type Props = { item: HttpTransaction; address: string }
const Payment = ({ item, address }: Props) => {
  const payments = useMemo((): {
    payee?: string | null
    amount?: number | null
    memo?: string | null
  }[] => {
    if (item.type === 'payment_v2') {
      return item.payments || []
    }

    if (item.type === 'payment_v1') {
      return [{ payee: item.payee, amount: item.amount }]
    }
    return []
  }, [item])

  if (item.type !== 'payment_v1' && item.type !== 'payment_v2') return null

  return (
    <Box flex={1}>
      <PaymentItem
        text={item.payer || ''}
        mode="from"
        isMyAccount={item.payer === address}
      />
      {payments.map((p, index) => (
        <Box key={p.payee}>
          <PaymentItem
            text={p.payee || ''}
            isMyAccount={p.payee === address}
            mode="to"
            isFirst={false}
            isLast={
              (p.memo === undefined || p.memo === DEFAULT_MEMO) &&
              index === payments.length - 1
            }
          />
          {(p.memo !== undefined || p.memo !== null) &&
            p.memo !== DEFAULT_MEMO && (
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

export default Payment
