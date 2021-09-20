import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { SectionList } from 'react-native'
import { Hotspot, Sum } from '@helium/http'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Search from '@assets/images/search.svg'
import Add from '@assets/images/add.svg'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { orderBy, sortBy } from 'lodash'
import { useColors } from '../../../theme/themeHooks'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import HotspotListItem from '../../../components/HotspotListItem'
import { RootState } from '../../../store/rootReducer'
import WelcomeOverview from './WelcomeOverview'
import HotspotsPicker, { GatewaySort } from './HotspotsPicker'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import { wh } from '../../../utils/layout'
import FocusAwareStatusBar from '../../../components/FocusAwareStatusBar'
import { CacheRecord } from '../../../utils/cacheUtils'
import { distance, hotspotHasValidLocation } from '../../../utils/location'
import useGetLocation from '../../../utils/useGetLocation'
import usePrevious from '../../../utils/usePrevious'
import useMount from '../../../utils/useMount'
import useVisible from '../../../utils/useVisible'

const HotspotsList = ({
  onSelectHotspot,
  visible,
  searchPressed,
  addHotspotPressed,
  accountRewards,
}: {
  onSelectHotspot: (hotspot: Hotspot, showNav: boolean) => void
  visible: boolean
  searchPressed?: () => void
  addHotspotPressed?: () => void
  accountRewards: CacheRecord<Sum>
}) => {
  const { t } = useTranslation()
  const colors = useColors()
  const { top } = useSafeAreaInsets()
  const [gatewaySortOrder, setGatewaySortOrder] = useState<GatewaySort>(
    GatewaySort.FollowedHotspots,
  )
  const loadingRewards = useSelector(
    (state: RootState) => state.hotspots.loadingRewards,
  )
  const hotspots = useSelector((state: RootState) => state.hotspots.hotspots)
  const followedHotspots = useSelector(
    (state: RootState) => state.hotspots.followedHotspots,
  )
  const hiddenAddresses = useSelector(
    (state: RootState) => state.account.settings.hiddenAddresses,
  )
  const showHiddenHotspots = useSelector(
    (state: RootState) => state.account.settings.showHiddenHotspots,
  )
  const rewards = useSelector(
    (state: RootState) => state.hotspots.rewards || {},
  )
  const maybeGetLocation = useGetLocation()
  const fleetModeEnabled = useSelector(
    (state: RootState) => state.account.settings.isFleetModeEnabled,
  )

  const { currentLocation, locationBlocked } = useSelector(
    (state: RootState) => state.location,
  )
  const prevOrder = usePrevious(gatewaySortOrder)

  const locationDeniedHandler = useCallback(() => {
    setGatewaySortOrder(GatewaySort.New)
  }, [])

  useMount(() => {
    if (!fleetModeEnabled) {
      // On mount if fleet mode is off, default to New filter
      setGatewaySortOrder(GatewaySort.New)
    }
  })

  useVisible({
    onAppear: () => {
      // if fleet mode is on and they're on the new filter, bring them to followed when this view appears
      if (fleetModeEnabled && gatewaySortOrder === GatewaySort.New) {
        setGatewaySortOrder(GatewaySort.FollowedHotspots)
      }
    },
  })

  useVisible({
    onAppear: () => {
      maybeGetLocation(false, locationDeniedHandler)
    },
  })

  useEffect(() => {
    if (
      currentLocation ||
      gatewaySortOrder !== GatewaySort.Near ||
      prevOrder === GatewaySort.Near
    )
      return

    // They've switched to Nearest filter and we don't have a location
    maybeGetLocation(true, locationDeniedHandler)
  }, [
    currentLocation,
    gatewaySortOrder,
    locationDeniedHandler,
    maybeGetLocation,
    prevOrder,
  ])

  const orderedHotspots = useMemo(() => {
    switch (gatewaySortOrder) {
      case GatewaySort.New:
        return orderBy(hotspots, 'blockAdded', 'desc')
      case GatewaySort.Near: {
        if (!currentLocation) {
          return hotspots
        }
        return sortBy(hotspots, [
          (h) =>
            distance(currentLocation || { latitude: 0, longitude: 0 }, {
              latitude: h.lat || 0,
              longitude: h.lng || 0,
            }),
        ])
      }
      case GatewaySort.Earn: {
        if (!rewards) {
          return hotspots
        }
        return sortBy(hotspots, [
          (h) => (rewards ? -rewards[h.address]?.integerBalance : 0),
        ])
      }
      case GatewaySort.Offline:
        return orderBy(hotspots, ['status.online', 'offline'])
      case GatewaySort.FollowedHotspots:
        return followedHotspots
      case GatewaySort.Unasserted:
        return hotspots.filter((h) => !hotspotHasValidLocation(h))
    }
  }, [currentLocation, followedHotspots, gatewaySortOrder, hotspots, rewards])

  const visibleHotspots = useMemo(() => {
    if (showHiddenHotspots) {
      return orderedHotspots
    }
    return (
      orderedHotspots.filter((h) => !hiddenAddresses?.includes(h.address)) || []
    )
  }, [hiddenAddresses, orderedHotspots, showHiddenHotspots])

  const handlePress = useCallback(
    (hotspot: Hotspot) => {
      onSelectHotspot(hotspot, visibleHotspots.length > 1)
    },
    [onSelectHotspot, visibleHotspots.length],
  )

  const hasOfflineHotspot = useMemo(
    () => visibleHotspots.some((h: Hotspot) => h.status?.online !== 'online'),
    [visibleHotspots],
  )

  const sections = useMemo(() => {
    let data = visibleHotspots
    if (gatewaySortOrder === GatewaySort.Offline && hasOfflineHotspot) {
      data = visibleHotspots.filter((h) => h.status?.online !== 'online')
    }
    return [
      {
        data,
      },
    ]
  }, [gatewaySortOrder, hasOfflineHotspot, visibleHotspots])

  const renderHeader = useCallback(() => {
    const filterHasHotspots = visibleHotspots && visibleHotspots.length > 0
    return (
      <Box
        paddingVertical="s"
        borderTopRightRadius="m"
        borderTopLeftRadius="m"
        backgroundColor="white"
      >
        <HotspotsPicker
          locationBlocked={locationBlocked}
          fleetModeEnabled={!!fleetModeEnabled}
          gatewaySort={gatewaySortOrder}
          handleFilterChange={setGatewaySortOrder}
        />
        {gatewaySortOrder === GatewaySort.Offline &&
          !hasOfflineHotspot &&
          filterHasHotspots && (
            <Box paddingHorizontal="l">
              <Text
                variant="body3Medium"
                color="grayDark"
                marginTop="xs"
                marginBottom="xl"
                letterSpacing={1}
              >
                {t('hotspots.list.no_offline')}
              </Text>
              <Text variant="body3Medium" color="grayDark" letterSpacing={1}>
                {t('hotspots.list.online')}
              </Text>
            </Box>
          )}
        {!filterHasHotspots && (
          <Box paddingHorizontal="l">
            <Text variant="body1" color="grayDark" padding="m">
              {t('hotspots.list.no_results')}
            </Text>
          </Box>
        )}
      </Box>
    )
  }, [
    visibleHotspots,
    locationBlocked,
    fleetModeEnabled,
    gatewaySortOrder,
    hasOfflineHotspot,
    t,
  ])

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <HotspotListItem
          onPress={handlePress}
          hotspot={item}
          showCarot
          loading={loadingRewards}
          totalReward={rewards[item.address]}
          hidden={hiddenAddresses?.includes(item.address)}
        />
      )
    },
    [handlePress, hiddenAddresses, loadingRewards, rewards],
  )

  const contentContainerStyle = useMemo(
    () => ({
      paddingBottom: 30,
    }),
    [],
  )

  const topStyle = useMemo(() => ({ paddingTop: top }), [top])

  const keyExtractor = useCallback((item: Hotspot) => item.address, [])

  return (
    <Box
      backgroundColor="white"
      top={visible ? 0 : wh}
      left={0}
      right={0}
      bottom={visible ? 0 : wh}
      position="absolute"
    >
      {visible && <FocusAwareStatusBar barStyle="dark-content" />}
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        style={topStyle}
      >
        <TouchableOpacityBox onPress={searchPressed} padding="l">
          <Search width={22} height={22} color={colors.purpleGrayLight} />
        </TouchableOpacityBox>
        <TouchableOpacityBox onPress={addHotspotPressed} padding="l">
          <Add width={22} height={22} color={colors.purpleGrayLight} />
        </TouchableOpacityBox>
      </Box>

      <SectionList
        sections={sections}
        keyExtractor={keyExtractor}
        ListHeaderComponent={
          <WelcomeOverview accountRewards={accountRewards} />
        }
        renderSectionHeader={renderHeader}
        renderItem={renderItem}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
      />
    </Box>
  )
}

export default memo(HotspotsList)
