import React from 'react'
import {
  AnyTransaction,
  PendingTransaction,
  StakeValidatorV1,
} from '@helium/http'
import animalName from 'angry-purple-tiger'
import Cloud from '@assets/images/stakeCloud.svg'
import PaymentItem from './PaymentItem'
import Box from '../../../../components/Box'
import Text from '../../../../components/Text'

type Props = { item: AnyTransaction | PendingTransaction }
const StakeValidator = ({ item }: Props) => {
  if (item.type !== 'stake_validator_v1') return null

  const stakeValidator = item as StakeValidatorV1
  return (
    <>
      <Box flexDirection="row" marginBottom="s">
        <Cloud />
        <Text variant="medium" fontSize={15} color="black" marginLeft="s">
          {animalName(stakeValidator.address)}
        </Text>
      </Box>
      <PaymentItem
        text={stakeValidator.address}
        mode="from"
        isMyAccount
        isLast
        isFirst
      />
    </>
  )
}

export default StakeValidator
