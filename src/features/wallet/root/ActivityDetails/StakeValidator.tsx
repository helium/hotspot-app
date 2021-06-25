import React from 'react'
import {
  AnyTransaction,
  PendingTransaction,
  StakeValidatorV1,
} from '@helium/http'
import PaymentItem from './PaymentItem'

type Props = { item: AnyTransaction | PendingTransaction }
const StakeValidator = ({ item }: Props) => {
  if (item.type !== 'stake_validator_v1') return null

  const rewards = item as StakeValidatorV1
  return (
    <PaymentItem
      text={rewards.address}
      mode="from"
      isMyAccount
      isLast
      isFirst
    />
  )
}

export default StakeValidator
