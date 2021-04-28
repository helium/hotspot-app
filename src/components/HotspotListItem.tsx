import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Hotspot } from '@helium/http'
import animalName from 'angry-purple-tiger'
import { useTranslation } from 'react-i18next'
import CarotRight from '@assets/images/carot-right.svg'
import Balance, { NetworkTokens } from '@helium/currency'
import { useSelector } from 'react-redux'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import { Pressable } from 'react-native'
import Box from './Box'
import Text from './Text'
import useCurrency from '../utils/useCurrency'
import { RootState } from '../store/rootReducer'
import { getSyncStatus, SyncStatus } from '../utils/hotspotUtils'

type HotspotListItemProps = {
  onPress?: (hotspot: Hotspot) => void
  hotspot: Hotspot
  totalReward?: Balance<NetworkTokens>
  showCarot?: boolean
  loading: boolean
}

const HotspotListItem = ({
  onPress,
  hotspot,
  totalReward,
  loading,
  showCarot = false,
}: HotspotListItemProps) => {
  const { t } = useTranslation()
  const { toggleConvertHntToCurrency, hntBalanceToDisplayVal } = useCurrency()
  const handlePress = useCallback(() => onPress?.(hotspot), [hotspot, onPress])
  const [reward, setReward] = useState('')

  const updateReward = useCallback(async () => {
    if (!totalReward) return

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

  const locationText = useMemo(() => {
    const { geocode: geo } = hotspot
    if (!geo || (!geo.longStreet && !geo.longCity && !geo.shortCountry)) {
      return t('hotspot_details.no_location_title')
    }
    return `${geo.longStreet}, ${geo.longCity}, ${geo.shortCountry}`
  }, [hotspot, t])

  return (
    <Box marginBottom="xxs">
      <Pressable onPress={handlePress}>
        {({ pressed }) => (
          <Box
            backgroundColor={pressed ? 'grayHighlight' : 'grayBox'}
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            padding="m"
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
                      ? 'greenOnline'
                      : 'yellow'
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
                {locationText}
              </Text>
              <Box flexDirection="row" alignItems="center" marginTop="s">
                {loading && !totalReward ? (
                  <SkeletonPlaceholder speed={3000}>
                    <SkeletonPlaceholder.Item
                      height={15}
                      width={168.5}
                      borderRadius={4}
                    />
                  </SkeletonPlaceholder>
                ) : (
                  <>
                    <Text
                      onPress={toggleConvertHntToCurrency}
                      variant="body2"
                      color="grayDarkText"
                      paddingEnd="s"
                    >
                      {reward}
                    </Text>
                    <Text variant="body2Light" color="blueGray">
                      {percentSynced}
                    </Text>
                  </>
                )}
              </Box>
            </Box>
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
            >
              {showCarot && (
                <Box marginStart="m">
                  <CarotRight color="#C4C8E5" />
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Pressable>
    </Box>
  )
}

export default memo(HotspotListItem)
