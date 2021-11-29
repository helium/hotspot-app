import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { LayoutAnimation, Platform } from 'react-native'
import { useSelector } from 'react-redux'
import { Hotspot, Validator } from '@helium/http'
import { useSharedValue } from 'react-native-reanimated'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { useAsync } from 'react-async-hook'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { RootStackParamList } from '../../../navigation/main/tabTypes'
import Box from '../../../components/Box'
import Map, { NO_FEATURES } from '../../../components/Map'
import { RootState } from '../../../store/rootReducer'
import hotspotDetailsSlice, {
  fetchHotspotData,
} from '../../../store/hotspotDetails/hotspotDetailsSlice'
import HotspotsViewHeader from './HotspotsViewHeader'
import HotspotsList from './HotspotsList'
import HotspotDetails, { HotspotSnapPoints } from '../details/HotspotDetails'
import HotspotSettingsProvider from '../settings/HotspotSettingsProvider'
import HotspotSettings from '../settings/HotspotSettings'
import HotspotSearch from './HotspotSearch'
import { getPlaceGeography, PlacePrediction } from '../../../utils/googlePlaces'
import hotspotSearchSlice from '../../../store/hotspotSearch/hotspotSearchSlice'
import {
  hotspotHasValidLocation,
  locationIsValid,
} from '../../../utils/location'
import { GlobalOpt, HotspotStackParamList } from './hotspotTypes'
import animateTransition from '../../../utils/animateTransition'
import usePrevious from '../../../utils/usePrevious'
import useMount from '../../../utils/useMount'
import { fetchHotspotsForHex } from '../../../store/discovery/discoverySlice'
import { MapFilters } from '../../map/MapFiltersButton'
import MapFilterModal from '../../map/MapFilterModal'
import ShortcutNav from './ShortcutNav'
import { useAppDispatch } from '../../../store/store'
import { fetchAccountRewards } from '../../../store/account/accountSlice'
import {
  fetchFollowedValidators,
  fetchMyValidators,
  fetchValidator,
} from '../../../store/validators/validatorsSlice'
import ValidatorDetails from '../../validators/ValidatorDetails'
import {
  isWitness,
  isGlobalOption,
  isHotspot,
} from '../../../utils/hotspotUtils'
import { isValidator } from '../../../utils/validatorUtils'
import ValidatorExplorer from '../../validators/explorer/ValidatorExplorer'
import HeliumSelect from '../../../components/HeliumSelect'
import { HeliumSelectItemType } from '../../../components/HeliumSelectItem'
import HotspotsEmpty from './HotspotsEmpty'
import { hasValidCache } from '../../../utils/cacheUtils'

type Props = {
  ownedHotspots?: Hotspot[]
  followedHotspots?: Hotspot[]
  ownedValidators: Validator[]
  followedValidators: Validator[]
  startOnMap?: boolean
  location?: number[]
  onRequestShowMap: (prompt: boolean) => void
}

type Route = RouteProp<HotspotStackParamList, 'HotspotsScreen'>

const SHEET_ANIM_DURATION = 500
const HotspotsView = ({
  ownedHotspots,
  followedHotspots,
  ownedValidators,
  followedValidators,
  startOnMap,
  onRequestShowMap,
  location: propsLocation,
}: Props) => {
  const navigation = useNavigation()
  const { params } = useRoute<Route>()
  const dispatch = useAppDispatch()
  const { top } = useSafeAreaInsets()
  const { t } = useTranslation()
  const [location, setLocation] = useState(propsLocation)
  const [showMap, setShowMap] = useState(false)
  const [detailSnapPoints, setDetailSnapPoints] = useState<HotspotSnapPoints>({
    collapsed: 0,
    expanded: 0,
  })
  const [detailHeight, setDetailHeight] = useState(0)
  const fleetModeEnabled = useSelector(
    (state: RootState) => state.account.settings.isFleetModeEnabled,
  )
  const hotspotsForHexId = useSelector(
    (state: RootState) => state.discovery.hotspotsForHexId,
  )
  const accountRewards = useSelector(
    (state: RootState) => state.account.rewardsSum,
  )
  const hotspotsLoaded = useSelector(
    (state: RootState) => state.hotspots.hotspotsLoaded,
  )
  const myValidatorsLoaded = useSelector(
    (state: RootState) => state.validators.myValidatorsLoaded,
  )
  const followedValidatorsLoaded = useSelector(
    (state: RootState) => state.validators.followedValidatorsLoaded,
  )
  const loadingHotspotsForHex = useSelector(
    (state: RootState) => state.discovery.loadingHotspotsForHex,
  )
  const [selectedHexId, setSelectedHexId] = useState<string>()
  const [selectedHotspotIndex, setSelectedHotspotIndex] = useState(0)
  const animatedIndex = useSharedValue<number>(0)
  const [mapFilter, setMapFilter] = useState(MapFilters.owned)
  const [showTabs, setShowTabs] = useState(true)
  const [exploreType, setExploreType] = useState<'validators' | 'hotspots'>(
    'hotspots',
  )
  const [shortcutItem, setShortcutItem] = useState<
    GlobalOpt | Hotspot | Validator
  >(startOnMap ? 'explore' : 'home')
  const prevShorcutItem = usePrevious(shortcutItem)

  const hotspotAddress = useMemo(() => {
    if (!isHotspot(shortcutItem)) return ''

    return shortcutItem.address
  }, [shortcutItem])

  const selectedHotspot = useMemo(() => {
    if (!shortcutItem || (!isHotspot(shortcutItem) && !isWitness(shortcutItem)))
      return

    return shortcutItem
  }, [shortcutItem])

  const selectedValidator = useMemo(() => {
    if (!shortcutItem || !isValidator(shortcutItem)) return

    return shortcutItem
  }, [shortcutItem])

  const showWitnesses = useMemo(() => mapFilter === MapFilters.witness, [
    mapFilter,
  ])

  const showOwned = useMemo(() => mapFilter === MapFilters.owned, [mapFilter])

  const showRewardScale = useMemo(() => mapFilter === MapFilters.reward, [
    mapFilter,
  ])

  useMount(() => {
    dispatch(fetchAccountRewards())
    dispatch(fetchMyValidators())
    dispatch(fetchFollowedValidators())
  })

  useEffect(() => {
    if (shortcutItem === 'explore' && prevShorcutItem !== 'explore') {
      onRequestShowMap(true)
    }
  }, [onRequestShowMap, prevShorcutItem, shortcutItem])

  const handleShortcutItemSelected = useCallback(
    (item: GlobalOpt | Hotspot | Validator) => {
      if (shortcutItem === item) return

      let animConfig = LayoutAnimation.Presets.spring

      const springDamping = Platform.select({ ios: 0.9, android: 2 })
      animConfig = {
        ...animConfig,
        create: { ...animConfig.create, springDamping },
        update: { ...animConfig.update, springDamping },
        delete: { ...animConfig.delete, springDamping },
      }
      animateTransition('HotspotsView.ShortcutChanged', {
        enabledOnAndroid: false,
        config: animConfig,
      })
      setShortcutItem(item)
    },
    [shortcutItem],
  )

  const setGlobalOption = useCallback(
    (opt: GlobalOpt) => {
      handleShortcutItemSelected(opt)
      setSelectedHexId(undefined)
      setSelectedHotspotIndex(0)
      setShowTabs(true)
    },
    [handleShortcutItemSelected],
  )

  useEffect(() => {
    const navParent = navigation.dangerouslyGetParent() as BottomTabNavigationProp<RootStackParamList>
    if (!navParent) return

    return navParent.addListener('tabPress', () => {
      if (navigation.isFocused()) {
        setGlobalOption('home')
      }
    })
  }, [navigation, setGlobalOption])

  useMount(() => {
    if (startOnMap) {
      setShowMap(true)
      return
    }

    setTimeout(() => {
      setShowMap(true)
    }, SHEET_ANIM_DURATION)
  })

  const hasHotspots = useMemo(
    () => !!(ownedHotspots?.length || followedHotspots?.length),
    [followedHotspots?.length, ownedHotspots?.length],
  )

  const hotspotDetailsData =
    useSelector(
      (state: RootState) => state.hotspotDetails.hotspotData[hotspotAddress],
    ) || {}

  const { witnesses } = hotspotDetailsData || {}

  useEffect(() => {
    if (showWitnesses && !witnesses) {
      dispatch(fetchHotspotData(hotspotAddress))
    }
  }, [mapFilter, hotspotAddress, dispatch, witnesses, showWitnesses])

  const hasUserLocation = useMemo(
    () =>
      location &&
      location.length === 2 &&
      location[0] !== 0 &&
      location[1] !== 0,
    [location],
  )

  useEffect(() => {
    if (hotspotAddress || hasUserLocation) return

    if (
      ownedHotspots &&
      ownedHotspots.length > 0 &&
      hotspotHasValidLocation(ownedHotspots[0])
    ) {
      setLocation([ownedHotspots[0].lng || 0, ownedHotspots[0].lat || 0]) // Set map loc to one of their hotspots
    } else if (
      followedHotspots &&
      followedHotspots.length > 0 &&
      hotspotHasValidLocation(followedHotspots[0])
    ) {
      setLocation([followedHotspots[0].lng || 0, followedHotspots[0].lat || 0]) // Set map loc to one of their followed hotspots
    } else {
      setLocation([-122.4194, 37.7749]) // SF - Browsing map without location permission and hotspots
    }
  }, [followedHotspots, hasUserLocation, hotspotAddress, ownedHotspots])

  const onMapHexSelected = useCallback(
    async (hexId: string, address?: string) => {
      if (loadingHotspotsForHex) return

      // set UI until hotspots load
      setSelectedHexId(hexId)

      setShowTabs(false)
      handleShortcutItemSelected({ address, locationHex: hexId } as Hotspot)

      let hotspots: Hotspot[] = []
      if (hexId && hexId !== NO_FEATURES) {
        // load hotspots in hex and update ui

        const existing = hotspotsForHexId[hexId]
        if (hasValidCache(existing, 60)) {
          hotspots = existing.hotspots
        } else {
          const response = (await dispatch(fetchHotspotsForHex({ hexId }))) as {
            payload?: Hotspot[]
          }
          if (response.payload) {
            hotspots = response.payload
          }
        }
      }
      let index = 0
      if (address && hotspots) {
        const foundIndex = hotspots.findIndex((h) => h?.address === address)
        if (foundIndex >= 0) {
          index = foundIndex
        }
      }
      setSelectedHotspotIndex(index)
      if (hotspots?.length) {
        handleShortcutItemSelected(hotspots[index] as Hotspot)
      }
    },
    [
      dispatch,
      handleShortcutItemSelected,
      hotspotsForHexId,
      loadingHotspotsForHex,
    ],
  )

  const handlePresentHotspot = useCallback(
    async (gateway: Hotspot | Validator) => {
      if (isGlobalOption(shortcutItem)) {
        setDetailHeight(detailSnapPoints.collapsed)
      }
      handleShortcutItemSelected(gateway)

      if (!isHotspot(gateway) || !gateway.locationHex) return

      await onMapHexSelected(gateway.locationHex, gateway.address)
    },
    [
      detailSnapPoints.collapsed,
      handleShortcutItemSelected,
      onMapHexSelected,
      shortcutItem,
    ],
  )
  const handlePresentValidator = useCallback(
    (validator: Validator) => {
      handleShortcutItemSelected(validator)
    },
    [handleShortcutItemSelected],
  )

  const handleItemSelected = useCallback(
    async (item?: GlobalOpt | Hotspot | Validator) => {
      if (!item) {
        setGlobalOption('home')
        return
      }
      if (isGlobalOption(item)) {
        setGlobalOption(item)
      } else if (isHotspot(item)) {
        await handlePresentHotspot(item)
      } else {
        handlePresentValidator(item)
      }
    },
    [handlePresentHotspot, handlePresentValidator, setGlobalOption],
  )

  const handleHotspotLink = useCallback(
    async (address: string) => {
      const hotspot = (await dispatch(fetchHotspotData(address))) as {
        payload?: { hotspot: Hotspot }
      }
      if (!hotspot.payload?.hotspot) return

      handlePresentHotspot(hotspot.payload.hotspot)
    },
    [dispatch, handlePresentHotspot],
  )

  const handleValidatorLink = useCallback(
    async (address: string) => {
      const validator = (await dispatch(fetchValidator(address))) as {
        payload: Validator
      }
      if (!validator.payload) return

      handlePresentValidator(validator.payload)
    },
    [dispatch, handlePresentValidator],
  )

  useAsync(async () => {
    if (!params?.address) return

    // Deep link handling
    if (params.resource === 'validator') {
      handleValidatorLink(params.address)
    } else {
      handleHotspotLink(params.address)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  const handleSelectPlace = useCallback(
    async (place: PlacePrediction) => {
      const placeLocation = await getPlaceGeography(place.placeId)
      setGlobalOption('explore')
      setExploreType('hotspots')
      setLocation([placeLocation.lng, placeLocation.lat])
    },
    [setGlobalOption],
  )

  const hexHotspots = useMemo(() => {
    if (!selectedHexId) return []
    return hotspotsForHexId[selectedHexId]?.hotspots
  }, [hotspotsForHexId, selectedHexId])

  const onHotspotSelected = useCallback(
    (index, hotspot) => {
      setSelectedHotspotIndex(index)
      handleShortcutItemSelected(hotspot)
    },
    [handleShortcutItemSelected],
  )

  const hotspotHasLocation = useMemo(() => {
    if (!hotspotAddress || !selectedHotspot || !selectedHotspot?.owner)
      return true

    return hotspotHasValidLocation(
      selectedHotspot || hotspotDetailsData.hotspot,
    )
  }, [hotspotAddress, hotspotDetailsData.hotspot, selectedHotspot])

  const toggleSettings = useCallback(() => {
    dispatch(hotspotDetailsSlice.actions.toggleShowSettings())
  }, [dispatch])

  const handleHotspotSetup = useCallback(
    () => navigation.navigate('HotspotSetup'),
    [navigation],
  )

  const onPressMapFilter = useCallback(() => {
    dispatch(hotspotDetailsSlice.actions.toggleShowMapFilter())
  }, [dispatch])

  const handleSearching = useCallback(
    (searching: boolean) => () => {
      setGlobalOption(searching ? 'search' : 'home')
      dispatch(hotspotSearchSlice.actions.clear())
    },
    [dispatch, setGlobalOption],
  )

  const body = useMemo(() => {
    return (
      <>
        <HotspotSearch
          onSelectHotspot={handlePresentHotspot}
          onSelectPlace={handleSelectPlace}
          onSelectValidator={handlePresentValidator}
          visible={shortcutItem === 'search'}
        />
        <ValidatorExplorer
          visible={shortcutItem === 'explore' && exploreType === 'validators'}
          onSelectValidator={handlePresentValidator}
        />
        <HotspotDetails
          visible={isHotspot(shortcutItem)}
          hotspot={selectedHotspot}
          onLayoutSnapPoints={setDetailSnapPoints}
          onChangeHeight={setDetailHeight}
          onFailure={handleItemSelected}
          onSelectHotspot={handlePresentHotspot}
          toggleSettings={toggleSettings}
          animatedPosition={animatedIndex}
        />
        <HotspotsList
          onSelectHotspot={handlePresentHotspot}
          visible={hasHotspots && shortcutItem === 'home'}
          searchPressed={handleSearching(true)}
          addHotspotPressed={handleHotspotSetup}
          accountRewards={accountRewards}
        />
        <HotspotsEmpty
          visible={!hasHotspots && shortcutItem === 'home'}
          onSearchPressed={handleSearching(true)}
        />
        <ValidatorDetails validator={selectedValidator} />
      </>
    )
  }, [
    handlePresentHotspot,
    handleSelectPlace,
    handlePresentValidator,
    shortcutItem,
    exploreType,
    selectedHotspot,
    handleItemSelected,
    toggleSettings,
    animatedIndex,
    handleSearching,
    handleHotspotSetup,
    hasHotspots,
    accountRewards,
    selectedValidator,
  ])

  const onChangeMapFilter = useCallback((filter: MapFilters) => {
    setMapFilter(filter)
  }, [])

  const cameraBottomOffset = useMemo(() => {
    if (isGlobalOption(shortcutItem)) return
    return detailHeight
  }, [detailHeight, shortcutItem])

  const onMenuChanged = useCallback((value) => {
    animateTransition('HotspotsView.ExploreTabs')
    setExploreType(value)
  }, [])

  const menuData = useMemo(
    () =>
      [
        {
          label: t('explore_hotspots'),
          value: 'hotspots',
          color: 'blueBright40',
          textColor: 'purpleText',
          selectedTextColor: 'blueBright',
        },
        {
          label: t('explore_validators'),
          value: 'validators',
          color: 'purpleBright40',
          textColor: 'purpleText',
          selectedTextColor: 'purpleBright',
        },
      ] as HeliumSelectItemType[],
    [t],
  )

  return (
    <>
      <Box flex={1} flexDirection="column" justifyContent="space-between">
        <Box position="absolute" height="100%" width="100%">
          <Box style={{ marginTop: top }} visible={showTabs} height={65}>
            <HeliumSelect
              data={menuData}
              selectedValue={exploreType}
              variant="bubbleBold"
              onValueChanged={onMenuChanged}
              showGradient={false}
              scrollEnabled={false}
              marginVertical="m"
              backgroundColor="primaryBackground"
              contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
            />
          </Box>
          {showMap && (
            <Map
              cameraBottomOffset={cameraBottomOffset}
              ownedHotspots={showOwned ? ownedHotspots : []}
              selectedHotspot={selectedHotspot}
              selectedHex={selectedHexId}
              maxZoomLevel={12}
              zoomLevel={12}
              witnesses={showWitnesses ? witnesses : []}
              followedHotspots={showOwned ? followedHotspots : []}
              mapCenter={location}
              animationMode="easeTo"
              animationDuration={800}
              onHexSelected={onMapHexSelected}
              interactive={hotspotHasLocation}
              showNoLocation={!hotspotHasLocation}
              showNearbyHotspots
              showH3Grid
              showRewardScale={showRewardScale}
              overflow="hidden"
              borderTopLeftRadius="l"
              borderTopRightRadius="l"
            />
          )}
          <HotspotsViewHeader
            animatedPosition={animatedIndex}
            hexHotspots={hexHotspots}
            ownedHotspots={ownedHotspots}
            detailHeaderHeight={detailSnapPoints.collapsed}
            onHotspotSelected={onHotspotSelected}
            followedHotspots={followedHotspots}
            selectedHotspotIndex={selectedHotspotIndex}
            mapFilter={mapFilter}
            onPressMapFilter={onPressMapFilter}
            showDetails={typeof shortcutItem !== 'string'}
            buttonsVisible
            showNoLocation={
              !locationIsValid(propsLocation) && shortcutItem === 'explore'
            }
          />
        </Box>
        {body}

        <HotspotSettingsProvider>
          {selectedHotspot && <HotspotSettings hotspot={selectedHotspot} />}
        </HotspotSettingsProvider>
        <MapFilterModal
          mapFilter={mapFilter}
          onChangeMapFilter={onChangeMapFilter}
        />
      </Box>

      <ShortcutNav
        ownedHotspots={!fleetModeEnabled && ownedHotspots ? ownedHotspots : []}
        followedHotspots={followedHotspots || []}
        ownedValidators={
          !fleetModeEnabled && ownedValidators ? ownedValidators : []
        }
        followedValidators={followedValidators || []}
        selectedItem={shortcutItem}
        onItemSelected={handleItemSelected}
        initialDataLoaded={
          hotspotsLoaded && myValidatorsLoaded && followedValidatorsLoaded
        }
      />
    </>
  )
}

export default memo(HotspotsView)
