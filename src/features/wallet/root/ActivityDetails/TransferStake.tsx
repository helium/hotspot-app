import React from 'react'
import { Transaction } from '../../../../store/activity/activitySlice'
import PaymentItem from './PaymentItem'

type Props = { item: Transaction; address: string }
const TransferValidator = ({ item, address }: Props) => {
  if (
    item.type !== 'transfer_validator_stake_v1' ||
    !item.oldAddress ||
    !item.newAddress
  )
    return null

  return (
    <>
      <PaymentItem
        text={item.oldAddress}
        mode="from"
        isMyAccount={item.oldAddress === address}
        isFirst
        isLast={false}
      />
      <PaymentItem
        text={item.newAddress}
        mode="to"
        isMyAccount={item.oldAddress === address}
        isFirst={false}
        isLast
      />
    </>
  )
}

export default TransferValidator
