import React, { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import NewestHotspot from '@assets/images/newestHotspot.svg'
import NearestHotspot from '@assets/images/nearestHotspot.svg'
import OfflineHotspot from '@assets/images/offlineHotspot.svg'
import FollowedHotspot from '@assets/images/follow.svg'
import TopHotspot from '@assets/images/topHotspot.svg'
import Box from '../../../components/Box'
import HeliumSelect from '../../../components/HeliumSelect'
import { HeliumSelectItemType } from '../../../components/HeliumSelectItem'
import { useSpacing } from '../../../theme/themeHooks'

export enum GatewaySort {
  New = 'new',
  Near = 'near',
  Earn = 'earn',
  FollowedHotspots = 'followed',
  Offline = 'offline',
  Unasserted = 'unasserted',
  FollowedValidators = 'followedValidators',
  Validators = 'validators',
}

type Props = {
  handleFilterChange: (sort: GatewaySort) => void
  gatewaySort: GatewaySort
  fleetModeEnabled: boolean
  locationBlocked: boolean
  hasFollowedValidators: boolean
  hasValidators: boolean
}
const HotspotsPicker = ({
  gatewaySort,
  handleFilterChange,
  fleetModeEnabled,
  locationBlocked,
  hasFollowedValidators,
  hasValidators,
}: Props) => {
  const { t } = useTranslation()
  const spacing = useSpacing()

  const handleValueChanged = useCallback(
    async (newOrder) => {
      handleFilterChange(newOrder)
    },
    [handleFilterChange],
  )

  const data = useMemo(() => {
    const opts: HeliumSelectItemType[] = []
    opts.push({
      label: t(`hotspots.owned.filter.${GatewaySort.New}`),
      value: GatewaySort.New,
      Icon: NewestHotspot,
      color: 'purpleMain',
    })
    opts.push({
      label: t(`hotspots.owned.filter.${GatewaySort.FollowedHotspots}`),
      value: GatewaySort.FollowedHotspots,
      Icon: FollowedHotspot,
      color: 'purpleBright',
    })
    if (hasValidators) {
      opts.push({
        label: t(`hotspots.owned.filter.${GatewaySort.Validators}`),
        value: GatewaySort.Validators,
        Icon: NewestHotspot,
        color: 'purpleMain',
      })
    }
    if (hasFollowedValidators) {
      opts.push({
        label: t(`hotspots.owned.filter.${GatewaySort.FollowedValidators}`),
        value: GatewaySort.FollowedValidators,
        Icon: FollowedHotspot,
        color: 'purpleMain',
      })
    }
    if (!locationBlocked) {
      opts.push({
        label: t(`hotspots.owned.filter.${GatewaySort.Near}`),
        value: GatewaySort.Near,
        Icon: NearestHotspot,
        color: 'purpleMain',
      })
    }
    if (!fleetModeEnabled) {
      opts.push({
        label: t(`hotspots.owned.filter.${GatewaySort.Earn}`),
        value: GatewaySort.Earn,
        Icon: TopHotspot,
        color: 'purpleMain',
      })
    }
    if (fleetModeEnabled) {
      opts.push({
        label: t(`hotspots.owned.filter.${GatewaySort.Unasserted}`),
        value: GatewaySort.Unasserted,
        Icon: TopHotspot,
        color: 'purpleMain',
      })
    }
    opts.push({
      label: t(`hotspots.owned.filter.${GatewaySort.Offline}`),
      value: GatewaySort.Offline,
      Icon: OfflineHotspot,
      color: 'purpleMain',
    })
    return opts
  }, [
    fleetModeEnabled,
    hasFollowedValidators,
    hasValidators,
    locationBlocked,
    t,
  ])

  const contentContainerStyle = useMemo(
    () => ({ paddingHorizontal: spacing.l }),
    [spacing.l],
  )

  return (
    <Box flexDirection="row" alignItems="center" width="100%">
      <HeliumSelect
        contentContainerStyle={contentContainerStyle}
        marginBottom="lm"
        data={data}
        selectedValue={gatewaySort}
        onValueChanged={handleValueChanged}
        marginVertical="s"
      />
    </Box>
  )
}

export default memo(HotspotsPicker)
