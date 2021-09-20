import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Hotspot } from '@helium/http'
import animalName from 'angry-purple-tiger'
import { useTranslation } from 'react-i18next'
import CarotRight from '@assets/images/carot-right.svg'
import LocationIcon from '@assets/images/location-icon.svg'
import Balance, { NetworkTokens } from '@helium/currency'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import { Pressable } from 'react-native'
import Box from './Box'
import Text from './Text'
import useCurrency from '../utils/useCurrency'
import { isRelay } from '../utils/hotspotUtils'
import HexBadge from '../features/hotspots/details/HexBadge'
import { useColors } from '../theme/themeHooks'
import Signal from '../assets/images/signal.svg'
import VisibilityOff from '../assets/images/visibility_off.svg'

type HotspotListItemProps = {
  onPress?: (hotspot: Hotspot) => void
  gateway: Hotspot
  totalReward?: Balance<NetworkTokens>
  showCarot?: boolean
  loading?: boolean
  showAddress?: boolean
  showRewardScale?: boolean
  distanceAway?: string
  showRelayStatus?: boolean
  showAntennaDetails?: boolean
  pressable?: boolean
  hidden?: boolean
}

const HotspotListItem = ({
  onPress,
  gateway,
  totalReward,
  loading = false,
  showCarot = false,
  showAddress = true,
  showRewardScale = false,
  showRelayStatus = false,
  showAntennaDetails = false,
  pressable = true,
  distanceAway,
  hidden,
}: HotspotListItemProps) => {
  const { t } = useTranslation()
  const colors = useColors()
  const { toggleConvertHntToCurrency, hntBalanceToDisplayVal } = useCurrency()
  const handlePress = useCallback(() => onPress?.(gateway), [gateway, onPress])
  const [reward, setReward] = useState('')

  const updateReward = useCallback(async () => {
    if (!totalReward) return

    const nextReward = await hntBalanceToDisplayVal(totalReward, false)
    setReward(`+${nextReward}`)
  }, [hntBalanceToDisplayVal, totalReward])

  useEffect(() => {
    updateReward()
  }, [updateReward])

  const locationText = useMemo(() => {
    const { geocode: geo } = gateway as Hotspot
    if (!geo || (!geo.longStreet && !geo.longCity && !geo.shortCountry)) {
      return t('hotspot_details.no_location_title')
    }
    return `${geo.longStreet}, ${geo.longCity}, ${geo.shortCountry}`
  }, [gateway, t])

  const isRelayed = useMemo(() => isRelay(gateway?.status?.listenAddrs), [
    gateway?.status,
  ])

  const statusBackgroundColor = useMemo(() => {
    if (hidden) return 'grayLightText'
    return gateway.status?.online === 'online' ? 'greenOnline' : 'yellow'
  }, [hidden, gateway.status?.online])

  return (
    <Box marginBottom="xxs">
      <Pressable onPress={handlePress} disabled={!pressable}>
        {({ pressed }) => (
          <Box
            backgroundColor={pressed ? 'grayHighlight' : 'grayBoxLight'}
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
                  backgroundColor={statusBackgroundColor}
                />
                <Text
                  variant="body2Medium"
                  color={hidden ? 'grayLightText' : 'offblack'}
                  paddingStart="s"
                  paddingEnd="s"
                  ellipsizeMode="tail"
                  numberOfLines={2}
                  maxWidth={220}
                >
                  {animalName(gateway.address)}
                </Text>
                {hidden && <VisibilityOff height={10} width={10} />}
              </Box>
              {showAddress && (
                <Text
                  variant="body3Light"
                  color={hidden ? 'grayLightText' : 'blueGray'}
                  marginTop="s"
                >
                  {locationText}
                </Text>
              )}
              <Box flexDirection="row" alignItems="center" marginTop="s">
                {loading && !totalReward && (
                  <SkeletonPlaceholder speed={3000}>
                    <SkeletonPlaceholder.Item
                      height={15}
                      width={168.5}
                      borderRadius={4}
                    />
                  </SkeletonPlaceholder>
                )}
                {totalReward !== undefined && (
                  <>
                    <Text
                      onPress={toggleConvertHntToCurrency}
                      variant="body2"
                      color={hidden ? 'grayLightText' : 'grayDarkText'}
                      paddingEnd="s"
                    >
                      {reward}
                    </Text>
                  </>
                )}
                {distanceAway !== undefined && (
                  <Box marginRight="s" flexDirection="row" alignItems="center">
                    <LocationIcon
                      color={colors.purpleMain}
                      width={10}
                      height={10}
                    />
                    <Text
                      color="grayText"
                      variant="regular"
                      fontSize={12}
                      marginLeft="xs"
                    >
                      {t('hotspot_details.distance_away', {
                        distance: distanceAway,
                      })}
                    </Text>
                  </Box>
                )}
                {showRewardScale && (
                  <HexBadge
                    hotspotId={gateway.address}
                    rewardScale={(gateway as Hotspot).rewardScale}
                    pressable={false}
                    badge={false}
                    fontSize={12}
                  />
                )}
                {showAntennaDetails && (
                  <Box marginLeft="s" flexDirection="row" alignItems="center">
                    <Signal width={10} height={10} color={colors.grayText} />
                    <Text
                      color="grayText"
                      variant="regular"
                      fontSize={12}
                      marginLeft="xs"
                    >
                      {t('generic.meters', {
                        distance: (gateway as Hotspot)?.elevation || 0,
                      })}
                    </Text>
                    {(gateway as Hotspot)?.gain !== undefined && (
                      <Text
                        color="grayText"
                        variant="regular"
                        fontSize={12}
                        marginLeft="xs"
                      >
                        {(((gateway as Hotspot).gain || 0) / 10).toFixed(1) +
                          t('antennas.onboarding.dbi')}
                      </Text>
                    )}
                  </Box>
                )}
                {showRelayStatus && isRelayed && (
                  <Text
                    color="grayText"
                    variant="regular"
                    fontSize={12}
                    marginLeft="s"
                  >
                    {t('hotspot_details.relayed')}
                  </Text>
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
