import React, { memo, useCallback, useState, useEffect } from 'react'
import { Hotspot } from '@helium/http'
import animalName from 'angry-purple-tiger'
import { useTranslation } from 'react-i18next'
import CheckCircle from '@assets/images/check-circle.svg'
import Attention from '@assets/images/attention.svg'
import CarotRight from '@assets/images/carot-right.svg'
import Balance, { NetworkTokens } from '@helium/currency'
import TouchableOpacityBox from './BSTouchableOpacityBox'
import Box from './Box'
import Text from './Text'
import useCurrency from '../utils/useCurrency'

type HotspotListItemProps = {
  onPress?: (hotspot: Hotspot) => void
  hotspot: Hotspot
  totalReward: Balance<NetworkTokens>
  showCarot?: boolean
}

const HotspotListItem = ({
  onPress,
  hotspot,
  totalReward,
  showCarot = false,
}: HotspotListItemProps) => {
  const { t } = useTranslation()
  const { toggleConvertHntToCurrency, hntBalanceToDisplayVal } = useCurrency()
  const handlePress = useCallback(() => onPress?.(hotspot), [hotspot, onPress])
  const [reward, setReward] = useState('')
  const updateReward = useCallback(async () => {
    const nextReward = await hntBalanceToDisplayVal(totalReward, false)
    setReward(`+${nextReward}`)
  }, [hntBalanceToDisplayVal, totalReward])

  useEffect(() => {
    updateReward()
  }, [updateReward])

  return (
    <Box marginHorizontal="l" marginBottom="s">
      <TouchableOpacityBox
        backgroundColor="grayBox"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        padding="m"
        borderRadius="m"
        onPress={handlePress}
      >
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          flex={1}
        >
          <Box flexDirection="column">
            <Box flexDirection="row" alignItems="center" marginBottom="xxs">
              {hotspot.status?.online === 'online' ? (
                <CheckCircle width={17} height={17} />
              ) : (
                <Attention width={17} height={17} />
              )}
              <Text
                variant="body2Medium"
                color="offblack"
                paddingStart="s"
                ellipsizeMode="tail"
                numberOfLines={2}
                maxWidth={210}
              >
                {animalName(hotspot.address)}
              </Text>
            </Box>
            <Box marginTop="xs">
              <Text variant="body3Light" color="blueGray">
                {hotspot.location
                  ? `${hotspot.geocode?.longStreet}, ${hotspot.geocode?.longCity}, ${hotspot.geocode?.shortCountry}`
                  : t('hotspot_details.no_location_title')}
              </Text>
            </Box>
            <Text
              onPress={toggleConvertHntToCurrency}
              variant="body1Light"
              fontSize={16}
              color="purpleMain"
              paddingTop="s"
              paddingEnd="s"
              paddingBottom="s"
              marginBottom="n_s"
              alignSelf="flex-start"
            >
              {reward}
            </Text>
          </Box>
          <Box flexDirection="row" alignItems="center" justifyContent="center">
            {showCarot && (
              <Box marginStart="m">
                <CarotRight color="#C4C8E5" />
              </Box>
            )}
          </Box>
        </Box>
      </TouchableOpacityBox>
    </Box>
  )
}

export default memo(HotspotListItem)
