import { AnyTransaction, PendingTransaction, RewardsV1 } from '@helium/http'
import React from 'react'
import { groupBy } from 'lodash'
import ActivityRewardItem from './ActivityRewardItem'
import Box from '../../../../components/Box'

type Props = { item: AnyTransaction | PendingTransaction }
const Rewards = ({ item }: Props) => {
  if (item.type !== 'rewards_v1') return null

  const rewards = item as RewardsV1

  const grouped = groupBy(rewards.rewards, (reward) => {
    if (reward.type === 'securities') return reward.type

    return reward.gateway
  })

  const { securities, ...rewardsGroup } = grouped

  return (
    <Box marginTop="lx">
      {securities && securities.length > 0 && (
        <ActivityRewardItem
          rewards={securities}
          // eslint-disable-next-line react/no-array-index-key
          isFirst
          isSecurityToken
          isLast
        />
      )}
      {Object.keys(rewardsGroup).map((k, idx) => (
        <ActivityRewardItem
          rewards={rewardsGroup[k]}
          // eslint-disable-next-line react/no-array-index-key
          key={`${idx}}`}
          isFirst={idx === 0}
          isLast={idx === Object.keys(rewardsGroup).length - 1}
        />
      ))}
    </Box>
  )
}

export default Rewards
