import React from 'react'
import Balance, { NetworkTokens } from '@helium/currency'
import Box from '../../../../components/Box'
import ActivityRewardLine from './ActivityRewardLine'

type Reward = {
  type: string
  gateway: string
  amount: Balance<NetworkTokens>
  account: string
}

type Props = {
  rewards: Reward[]
  isFirst: boolean
  isLast: boolean
  isSecurityToken?: boolean
}

const ActivityRewardItem = ({
  rewards,
  isFirst,
  isLast,
  isSecurityToken,
}: Props) => {
  return (
    <Box
      backgroundColor={isSecurityToken ? 'whitePurple' : 'grayBox'}
      padding="ms"
      borderTopLeftRadius={isFirst ? 'm' : 'none'}
      borderTopRightRadius={isFirst ? 'm' : 'none'}
      borderBottomLeftRadius={isLast ? 'm' : 'none'}
      borderBottomRightRadius={isLast ? 'm' : 'none'}
      justifyContent="space-between"
      marginBottom={isLast ? 'l' : 'xxxs'}
    >
      {rewards.map((reward, idx) => (
        <ActivityRewardLine
          // eslint-disable-next-line react/no-array-index-key
          key={idx}
          showTitle={idx === 0}
          isSecurityToken={isSecurityToken}
          reward={reward}
        />
      ))}
    </Box>
  )
}

export default ActivityRewardItem
