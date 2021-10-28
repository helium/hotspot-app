import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Balance, { CurrencyType } from '@helium/currency'
import animalHash from 'angry-purple-tiger'
import HeliumReward from '@assets/images/heliumReward.svg'
import LittleHotspot from '@assets/images/littleHotspot.svg'
import Box from '../../../../components/Box'
import Text from '../../../../components/Text'
import useCurrency from '../../../../utils/useCurrency'
import { useColors } from '../../../../theme/themeHooks'
import { HttpReward } from '../../../../store/activity/activitySlice'

type Props = {
  reward: HttpReward
  isSecurityToken?: boolean
  showTitle: boolean
}

const ActivityRewardLine = ({
  reward: { amount, type, gateway },
  isSecurityToken,
  showTitle,
}: Props) => {
  const { t } = useTranslation()
  const colors = useColors()
  const { hntBalanceToDisplayVal, toggleConvertHntToCurrency } = useCurrency()
  const [reward, setReward] = useState('')

  const updateReward = useCallback(async () => {
    const nextReward = await hntBalanceToDisplayVal(
      new Balance(amount, CurrencyType.networkToken),
      false,
      3,
    )
    setReward(`+${nextReward}`)
  }, [hntBalanceToDisplayVal, amount])

  useEffect(() => {
    updateReward()
  }, [updateReward])

  const title = useMemo(() => {
    if (isSecurityToken) {
      return t('activity_details.security_tokens')
    }
    return animalHash(gateway)
  }, [isSecurityToken, gateway, t])

  const body = useMemo(() => {
    if (isSecurityToken) {
      return t('activity_details.reward')
    }
    return t(`activity_details.rewardTypes.${type}`)
  }, [isSecurityToken, type, t])

  const icon = useCallback(() => {
    if (isSecurityToken) {
      return <HeliumReward color={colors.purpleBright} />
    }
    return <LittleHotspot />
  }, [colors.purpleBright, isSecurityToken])

  return (
    <Box>
      {showTitle && (
        <Box flexDirection="row" alignItems="center" marginBottom="s">
          {icon()}
          <Text variant="medium" fontSize={15} color="black" marginLeft="s">
            {title}
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
          {body}
        </Text>
        <Text
          variant="medium"
          fontSize={14}
          color="greenMain"
          marginLeft="s"
          onPress={toggleConvertHntToCurrency}
        >
          {reward}
        </Text>
      </Box>
    </Box>
  )
}

export default ActivityRewardLine
