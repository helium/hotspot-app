import { AnyTransaction, PendingTransaction, RewardsV1 } from '@helium/http'
import React from 'react'
import { groupBy } from 'lodash'
import ActivityRewardItem from './ActivityRewardItem'
import Box from '../../../../components/Box'

type Props = { item: AnyTransaction | PendingTransaction }
const Rewards = ({ item }: Props) => {
  if (item.type !== 'rewards_v1') return null

  const rewards = item as RewardsV1

  const grouped = groupBy(rewards.rewards, (reward) => reward.type)

  return (
    <Box marginTop="lx">
      {Object.keys(grouped).map((k, idx) =>
        grouped[k].map((r, index) => (
          <ActivityRewardItem
            reward={r}
            // eslint-disable-next-line react/no-array-index-key
            key={`${idx}.${index}`}
            isFirst={index === 0}
            isLast={index === grouped[k].length - 1}
          />
        )),
      )}
    </Box>
  )
}

export default Rewards
