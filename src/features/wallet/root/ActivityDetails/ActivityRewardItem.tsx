import React from 'react'
import { useTranslation } from 'react-i18next'
import Balance, { NetworkTokens } from '@helium/currency'
import animalHash from 'angry-purple-tiger'
import Box from '../../../../components/Box'
import Text from '../../../../components/Text'
import HeliumReward from '../../../../assets/images/heliumReward.svg'
import LittleHotspot from '../../../../assets/images/littleHotspot.svg'

type Props = {
  reward: {
    type: string
    gateway: string
    amount: Balance<NetworkTokens>
    account: string
  }
  isFirst: boolean
  isLast: boolean
}
const ActivityRewardItem = ({ reward, isFirst, isLast }: Props) => {
  const { t } = useTranslation()

  const title = () => {
    if (reward.type === 'securities') {
      return t('activity_details.security_tokens')
    }
    return animalHash(reward.gateway)
  }

  const body = () => {
    if (reward.type === 'securities') {
      return t('activity_details.reward')
    }
    return t(`activity_details.rewardTypes.${reward.type}`)
  }

  const icon = () => {
    if (reward.type === 'securities') {
      return <HeliumReward />
    }
    return <LittleHotspot />
  }

  return (
    <Box
      height={68}
      backgroundColor="whitePurple"
      padding="ms"
      borderTopLeftRadius={isFirst ? 'm' : 'none'}
      borderTopRightRadius={isFirst ? 'm' : 'none'}
      borderBottomLeftRadius={isLast ? 'm' : 'none'}
      borderBottomRightRadius={isLast ? 'm' : 'none'}
      justifyContent="space-between"
      marginBottom={isLast ? 'l' : 'xxxs'}
    >
      <Box flexDirection="row" alignItems="center">
        {icon()}
        <Text variant="medium" fontSize={15} color="black" marginLeft="s">
          {title()}
        </Text>
      </Box>
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Text variant="light" fontSize={14} color="black">
          {body()}
        </Text>
        <Text variant="medium" fontSize={14} color="greenMain" marginLeft="s">
          {`+${reward.amount.toString()}`}
        </Text>
      </Box>
    </Box>
  )
}

export default ActivityRewardItem
