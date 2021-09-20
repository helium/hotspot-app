import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { SectionList } from 'react-native'
import { Hotspot, Sum, Validator } from '@helium/http'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Search from '@assets/images/search.svg'
import Add from '@assets/images/add.svg'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { orderBy, sortBy, uniq } from 'lodash'
import { useAsync } from 'react-async-hook'
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
import { isHotspot } from '../../../utils/hotspotUtils'
import ElectedValidatorItem from '../../validators/explorer/ElectedValidatorItem'
import { fetchValidatorRewards } from '../../../store/validators/validatorsSlice'
import { useAppDispatch } from '../../../store/store'
import { isValidator } from '../../../utils/validatorUtils'

const HotspotsList = ({
  onSelectHotspot,
  visible,
  searchPressed,
  addHotspotPressed,
  accountRewards,
}: {
  onSelectHotspot: (hotspot: Hotspot | Validator, showNav: boolean) => void
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
  const dispatch = useAppDispatch()
  const loadingHotspotRewards = useSelector(
    (state: RootState) => state.hotspots.loadingRewards,
  )
  const {
    loadingRewards: loadingValidatorRewards,
    myValidatorsLoaded,
    followedValidatorsLoaded,
    rewards: validatorRewards,
  } = useSelector((state: RootState) => state.validators)

  const hotspots = useSelector((state: RootState) => state.hotspots.hotspots)
  const followedHotspots = useSelector(
    (state: RootState) => state.hotspots.followedHotspots,
  )
  const validators = useSelector(
    (state: RootState) => state.validators.validators.data,
  )
  const followedValidators = useSelector(
    (state: RootState) => state.validators.followedValidators.data,
  )
  const hiddenAddresses = useSelector(
    (state: RootState) => state.account.settings.hiddenAddresses,
  )
  const showHiddenHotspots = useSelector(
    (state: RootState) => state.account.settings.showHiddenHotspots,
  )
  const hotspotRewards = useSelector(
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

  useAsync(async () => {
    if (
      !myValidatorsLoaded ||
      !followedValidatorsLoaded ||
      loadingValidatorRewards
    ) {
      return
    }

    const allValidatorAddresses = uniq(
      [...followedValidators, ...validators].map(({ address }) => address),
    )
    const rewardsToFetch = allValidatorAddresses.flatMap((address) => {
      const reward = validatorRewards[address]
      if (!reward) return [address]
      return []
    })
    if (rewardsToFetch.length === 0) return
    await dispatch(fetchValidatorRewards(rewardsToFetch))
  }, [
    myValidatorsLoaded,
    followedValidatorsLoaded,
    validators,
    followedValidators,
    loadingValidatorRewards,
  ])

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

  const orderedGateways = useMemo((): (Hotspot | Validator)[] => {
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
        if (!hotspotRewards) {
          return hotspots
        }
        return sortBy(hotspots, [
          (h) =>
            hotspotRewards ? -hotspotRewards[h.address]?.integerBalance : 0,
        ])
      }
      case GatewaySort.Offline:
        return orderBy(hotspots, ['status.online', 'offline'])
      case GatewaySort.FollowedHotspots:
        return followedHotspots
      case GatewaySort.Unasserted:
        return hotspots.filter((h) => !hotspotHasValidLocation(h))
      case GatewaySort.FollowedValidators:
        return followedValidators
      case GatewaySort.Validators:
        return validators
    }
  }, [
    currentLocation,
    followedHotspots,
    followedValidators,
    gatewaySortOrder,
    hotspots,
    hotspotRewards,
    validators,
  ])

  const visibleHotspots = useMemo(() => {
    if (showHiddenHotspots || GatewaySort.FollowedValidators) {
      return orderedGateways
    }
    return (
      (orderedGateways as Hotspot[]).filter(
        (h) => !hiddenAddresses?.includes(h.address),
      ) || []
    )
  }, [hiddenAddresses, orderedGateways, showHiddenHotspots])

  const handlePress = useCallback(
    (hotspot: Hotspot | Validator) => {
      onSelectHotspot(hotspot, visibleHotspots.length > 1)
    },
    [onSelectHotspot, visibleHotspots.length],
  )

  const hasOfflineHotspot = useMemo(() => {
    if (GatewaySort.FollowedValidators) {
      return false
    }
    return (visibleHotspots as Hotspot[]).some(
      (h: Hotspot) => h.status?.online !== 'online',
    )
  }, [visibleHotspots])

  const sections = useMemo(() => {
    let data = visibleHotspots
    if (gatewaySortOrder === GatewaySort.Offline && hasOfflineHotspot) {
      data = (visibleHotspots as Hotspot[]).filter(
        (h) => h.status?.online !== 'online',
      )
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
          hasFollowedValidators={!!followedValidators.length}
          locationBlocked={locationBlocked}
          fleetModeEnabled={!!fleetModeEnabled}
          gatewaySort={gatewaySortOrder}
          handleFilterChange={setGatewaySortOrder}
          hasValidators={!!validators.length}
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
    followedValidators.length,
    locationBlocked,
    fleetModeEnabled,
    gatewaySortOrder,
    validators.length,
    hasOfflineHotspot,
    t,
  ])

  const renderItem = useCallback(
    ({ item }) => {
      if (isHotspot(item)) {
        return (
          <HotspotListItem
            onPress={handlePress}
            gateway={item}
            showCarot
            loading={loadingHotspotRewards}
            totalReward={hotspotRewards[item.address]}
            hidden={hiddenAddresses?.includes(item.address)}
          />
        )
      }
      if (isValidator(item)) {
        return (
          <ElectedValidatorItem
            validator={item}
            onSelectValidator={handlePress}
            rewardsLoading={loadingValidatorRewards}
          />
        )
      }
      return null
    },
    [
      handlePress,
      hiddenAddresses,
      loadingHotspotRewards,
      loadingValidatorRewards,
      hotspotRewards,
    ],
  )

  const contentContainerStyle = useMemo(
    () => ({
      paddingBottom: 30,
    }),
    [],
  )

  const topStyle = useMemo(() => ({ paddingTop: top }), [top])

  const keyExtractor = useCallback(
    (item: Hotspot | Validator) => item.address,
    [],
  )

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
