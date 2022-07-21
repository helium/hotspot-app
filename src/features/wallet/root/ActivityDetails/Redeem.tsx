import React, { memo } from 'react'
import Box from '../../../../components/Box'
import PaymentItem from './PaymentItem'
import { HttpTransaction } from '../../../../store/activity/activitySlice'

type Props = { item: HttpTransaction; address: string }
const Redeem = ({ item, address }: Props) => {
  if (item.type !== 'token_redeem_v1') return null

  return (
    <Box flex={1} marginTop="m">
      <PaymentItem
        text={item.account || ''}
        mode="to"
        isMyAccount={item.account === address}
        isLast
        isFirst
      />
    </Box>
  )
}

export default memo(Redeem)
