import React from 'react'
import {
  AnyTransaction,
  PendingTransaction,
  TransferValidatorStakeV1,
} from '@helium/http'
import PaymentItem from './PaymentItem'

type Props = { item: AnyTransaction | PendingTransaction; address: string }
const TransferValidator = ({ item, address }: Props) => {
  if (item.type !== 'transfer_validator_stake_v1') return null

  const rewards = item as TransferValidatorStakeV1
  return (
    <>
      <PaymentItem
        text={rewards.oldAddress}
        mode="from"
        isMyAccount={rewards.oldAddress === address}
        isFirst
        isLast={false}
      />
      <PaymentItem
        text={rewards.newAddress}
        mode="to"
        isMyAccount={rewards.oldAddress === address}
        isFirst={false}
        isLast
      />
    </>
  )
}

export default TransferValidator
