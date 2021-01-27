import React from 'react'
import { useTranslation } from 'react-i18next'
import Balance, { NetworkTokens } from '@helium/currency'
import animalHash from 'angry-purple-tiger'
import Box from '../../../../components/Box'
import Text from '../../../../components/Text'
import HeliumReward from '../../../../assets/images/heliumReward.svg'
import LittleHotspot from '../../../../assets/images/littleHotspot.svg'

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
  const { t } = useTranslation()

  const title = (reward: Reward) => {
    if (isSecurityToken) {
      return t('activity_details.security_tokens')
    }
    return animalHash(reward.gateway)
  }

  const body = (reward: Reward) => {
    if (isSecurityToken) {
      return t('activity_details.reward')
    }
    return t(`activity_details.rewardTypes.${reward.type}`)
  }

  const icon = () => {
    if (isSecurityToken) {
      return <HeliumReward />
    }
    return <LittleHotspot />
  }

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
        <>
          {idx === 0 && (
            <Box flexDirection="row" alignItems="center" marginBottom="s">
              {icon(reward)}
              <Text variant="medium" fontSize={15} color="black" marginLeft="s">
                {title(reward)}
              </Text>
            </Box>
          )}
          <Box
            marginTop="xs"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text variant="light" fontSize={14} color="black">
              {body(reward)}
            </Text>
            <Text
              variant="medium"
              fontSize={14}
              color="greenMain"
              marginLeft="s"
            >
              {`+${reward.amount.toString()}`}
            </Text>
          </Box>
        </>
      ))}
    </Box>
  )
}

export default ActivityRewardItem
