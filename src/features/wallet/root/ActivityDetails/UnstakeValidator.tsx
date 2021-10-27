import React from 'react'
import { Transaction } from '../../../../store/activity/activitySlice'
import PaymentItem from './PaymentItem'

type Props = { item: Transaction }
const UnstakeValidator = ({ item }: Props) => {
  if (item.type !== 'unstake_validator_v1' || !item.address) return null

  return (
    <PaymentItem text={item.address} mode="from" isMyAccount isFirst isLast />
  )
}

export default UnstakeValidator
