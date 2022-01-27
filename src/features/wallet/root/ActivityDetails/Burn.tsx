import React, { useMemo } from 'react'
import Box from '../../../../components/Box'
import PaymentItem from './PaymentItem'
import { HttpTransaction } from '../../../../store/activity/activitySlice'

type Props = { item: HttpTransaction; address: string }
const Burn = ({ item, address }: Props) => {
  const isPayer = useMemo(() => item.payer === address, [address, item.payer])

  if (item.type !== 'token_burn_v1') return null

  return (
    <Box flex={1} marginTop={isPayer ? 'none' : 'm'}>
      <PaymentItem
        text={item.payee || ''}
        mode="to"
        isMyAccount={item.payee === address}
      />
      <PaymentItem text={item.memo || ''} mode="memo" isFirst={false} isLast />
    </Box>
  )
}

export default Burn
