import React from 'react'
import {
  AnyTransaction,
  PendingTransaction,
  UnstakeValidatorV1,
} from '@helium/http'
import PaymentItem from './PaymentItem'

type Props = { item: AnyTransaction | PendingTransaction }
const UnstakeValidator = ({ item }: Props) => {
  if (item.type !== 'unstake_validator_v1') return null

  const rewards = item as UnstakeValidatorV1
  return <PaymentItem text={rewards.address} mode="from" isMyAccount />
}

export default UnstakeValidator
