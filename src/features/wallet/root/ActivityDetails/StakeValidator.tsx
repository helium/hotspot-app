import React from 'react'
import animalName from 'angry-purple-tiger'
import Cloud from '@assets/images/stakeCloud.svg'
import PaymentItem from './PaymentItem'
import Box from '../../../../components/Box'
import Text from '../../../../components/Text'
import { Transaction } from '../../../../store/activity/activitySlice'

type Props = { item: Transaction }
const StakeValidator = ({ item }: Props) => {
  if (item.type !== 'stake_validator_v1' || !item.address) return null

  return (
    <>
      <Box flexDirection="row" marginBottom="s">
        <Cloud color="#A667F6" />
        <Text variant="medium" fontSize={15} color="black" marginLeft="s">
          {animalName(item.address)}
        </Text>
      </Box>
      <PaymentItem text={item.address} mode="from" isMyAccount isLast isFirst />
    </>
  )
}

export default StakeValidator
