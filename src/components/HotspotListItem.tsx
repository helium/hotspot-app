import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Hotspot } from '@helium/http'
import animalName from 'angry-purple-tiger'
import { useTranslation } from 'react-i18next'
import CarotRight from '@assets/images/carot-right.svg'
import Balance, { NetworkTokens } from '@helium/currency'
import { useSelector } from 'react-redux'
import TouchableOpacityBox from './BSTouchableOpacityBox'
import Box from './Box'
import Text from './Text'
import useCurrency from '../utils/useCurrency'
import { RootState } from '../store/rootReducer'
import { getSyncStatus, SyncStatus } from '../utils/hotspotUtils'

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
  const blockHeight = useSelector(
    (state: RootState) => state.heliumData.blockHeight,
  )

  useEffect(() => {
    updateReward()
  }, [updateReward])

  const percentSynced = useMemo(() => {
    const hotspotHeight = hotspot.status?.height || 0
    const { status, percent } = getSyncStatus(hotspotHeight, blockHeight)
    switch (status) {
      case SyncStatus.full:
        return ''
      case SyncStatus.partial:
        return t('hotspot_details.percent_synced', { percent })
      case SyncStatus.none:
        return t('hotspot_details.starting_sync')
    }
  }, [t, blockHeight, hotspot.status?.height])

  return (
    <Box marginHorizontal="l" marginBottom="xs">
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
            <Box flexDirection="row" alignItems="center">
              <Box
                height={10}
                width={10}
                borderRadius="m"
                backgroundColor={
                  hotspot.status?.online === 'online'
                    ? 'purpleMain'
                    : 'redMedium'
                }
              />
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
            <Text variant="body3Light" color="blueGray" marginTop="s">
              {hotspot.geocode
                ? `${hotspot.geocode?.longStreet}, ${hotspot.geocode?.longCity}, ${hotspot.geocode?.shortCountry}`
                : t('hotspot_details.no_location_title')}
            </Text>
            <Box flexDirection="row" alignItems="center" marginTop="s">
              <Text
                onPress={toggleConvertHntToCurrency}
                variant="body2"
                color="purpleMain"
                paddingEnd="s"
              >
                {reward}
              </Text>
              <Text variant="body2Light" color="blueGray">
                {percentSynced}
              </Text>
            </Box>
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
