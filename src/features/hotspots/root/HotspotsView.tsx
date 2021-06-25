import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { LayoutChangeEvent } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Hotspot, Witness } from '@helium/http'
import { useSharedValue } from 'react-native-reanimated'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { RootStackParamList } from '../../../navigation/main/tabTypes'
import Box from '../../../components/Box'
import Map from '../../../components/Map'
import { RootState } from '../../../store/rootReducer'
import hotspotDetailsSlice, {
  fetchHotspotData,
} from '../../../store/hotspotDetails/hotspotDetailsSlice'
import HotspotsViewHeader from './HotspotsViewHeader'
import HotspotsList from './HotspotsList'
import HotspotDetails from '../details/HotspotDetails'
import HotspotsEmpty from './HotspotsEmpty'
import HotspotSettingsProvider from '../settings/HotspotSettingsProvider'
import HotspotSettings from '../settings/HotspotSettings'
import HotspotSearch from './HotspotSearch'
import { getPlaceGeography, PlacePrediction } from '../../../utils/googlePlaces'
import hotspotSearchSlice from '../../../store/hotspotSearch/hotspotSearchSlice'
import {
  hotspotHasValidLocation,
  locationIsValid,
} from '../../../utils/location'
import { HotspotStackParamList } from './hotspotTypes'
import animateTransition from '../../../utils/animateTransition'
import usePrevious from '../../../utils/usePrevious'
import useVisible from '../../../utils/useVisible'
import useMount from '../../../utils/useMount'
import { fetchHotspotsForHex } from '../../../store/discovery/discoverySlice'
import { MapFilters } from '../../map/MapFiltersButton'
import MapFilterModal from '../../map/MapFilterModal'
import ShortcutNav, { GlobalOpt, IS_GLOBAL_OPT } from './ShortcutNav'

type Props = {
  ownedHotspots?: Hotspot[]
  followedHotspots?: Hotspot[]
  startOnMap?: boolean
  location?: number[]
  onViewMap: (prompt: boolean) => void
}

type Route = RouteProp<HotspotStackParamList, 'HotspotsScreen'>

const SHEET_ANIM_DURATION = 500
const HotspotsView = ({
  ownedHotspots,
  followedHotspots,
  startOnMap,
  onViewMap,
  location: propsLocation,
}: Props) => {
  const navigation = useNavigation()
  const { params } = useRoute<Route>()
  const dispatch = useDispatch()
  const [location, setLocation] = useState(propsLocation)
  const [showMap, setShowMap] = useState(false)
  const [detailHeaderHeight, setDetailHeaderHeight] = useState(144)
  const visible = useVisible()
  const prevVisible = usePrevious(visible)
  const hotspotsForHexId = useSelector(
    (state: RootState) => state.discovery.hotspotsForHexId,
  )
  const [selectedHexId, setSelectedHexId] = useState<string>()
  const [selectedHotspotIndex, setSelectedHotspotIndex] = useState(0)
  // TODO: Fix hotspot detail header animated position
  const animatedIndex = useSharedValue<number>(0)
  const [mapFilter, setMapFilter] = useState(MapFilters.owned)
  const [shortcutItem, setShortcutItem] = useState<
    GlobalOpt | Hotspot | Witness
  >(startOnMap ? 'explore' : 'home')
  const prevShorcutItem = usePrevious(shortcutItem)

  const locationBlocked = useSelector(
    (state: RootState) => state.location.locationBlocked,
  )

  const hotspotAddress = useMemo(() => {
    if (shortcutItem && typeof shortcutItem !== 'string') {
      return shortcutItem.address
    }
    return ''
  }, [shortcutItem])

  const selectedHotspot = useMemo(() => {
    if (!shortcutItem || IS_GLOBAL_OPT(shortcutItem)) return

    return shortcutItem
  }, [shortcutItem])

  const showWitnesses = useMemo(() => mapFilter === MapFilters.witness, [
    mapFilter,
  ])

  const showOwned = useMemo(() => mapFilter === MapFilters.owned, [mapFilter])

  const showRewardScale = useMemo(() => mapFilter === MapFilters.reward, [
    mapFilter,
  ])

  useEffect(() => {
    if (shortcutItem === 'explore' && prevShorcutItem !== 'explore') {
      onViewMap(true)
    }
  }, [onViewMap, prevShorcutItem, shortcutItem])

  useEffect(() => {
    if (prevShorcutItem !== shortcutItem && visible && prevVisible) {
      animateTransition('HotspotsView.DetailsChange', false)
    }
  }, [prevShorcutItem, prevVisible, shortcutItem, visible])

  const setGlobalOption = useCallback((opt: GlobalOpt) => {
    setShortcutItem(opt)
    setSelectedHexId(undefined)
    setSelectedHotspotIndex(0)
  }, [])

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
    () => ownedHotspots?.length || followedHotspots?.length,
    [followedHotspots?.length, ownedHotspots?.length],
  )

  const hotspotDetailsData =
    useSelector(
      (state: RootState) => state.hotspotDetails.hotspotData[hotspotAddress],
    ) || {}
  const { witnesses } = hotspotDetailsData || {}

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
      setLocation([122.4194, 37.7749]) // SF - This shouldn't actually be possible
    }
  }, [followedHotspots, hasUserLocation, hotspotAddress, ownedHotspots])

  const handleDetailHeaderLayout = useCallback((event: LayoutChangeEvent) => {
    setDetailHeaderHeight(event.nativeEvent.layout.height)
  }, [])

  const onMapHexSelected = useCallback(
    async (hexId: string, address?: string) => {
      const hotspots = (await dispatch(fetchHotspotsForHex({ hexId }))) as {
        payload?: Hotspot[]
      }

      let index = 0
      if (address && hotspots?.payload) {
        const foundIndex = hotspots.payload.findIndex(
          (h) => h?.address === address,
        )
        if (foundIndex >= 0) {
          index = foundIndex
        }
      }
      setSelectedHexId(hexId)
      setSelectedHotspotIndex(index)
      if (hotspots?.payload?.length) {
        setShortcutItem(hotspots.payload[index] as Hotspot)
      }
    },
    [dispatch],
  )

  const handlePresentDetails = useCallback(
    async (hotspot: Hotspot | Witness) => {
      setShortcutItem(hotspot)

      if (!hotspot.locationHex) return

      onMapHexSelected(hotspot.locationHex, hotspot.address)
    },
    [onMapHexSelected],
  )

  const handleItemSelected = useCallback(
    (item?: GlobalOpt | Hotspot) => {
      if (!item) {
        setGlobalOption('home')
        return
      }
      if (IS_GLOBAL_OPT(item)) {
        setGlobalOption(item)
      } else if (item) {
        handlePresentDetails(item)
      }
    },
    [handlePresentDetails, setGlobalOption],
  )

  useEffect(() => {
    if (!params?.address) return

    const fetchHotspot = async () => {
      const hotspot = (await dispatch(fetchHotspotData(params.address))) as {
        payload?: { hotspot: Hotspot }
      }
      if (!hotspot.payload?.hotspot) return

      handlePresentDetails(hotspot.payload.hotspot)
    }

    fetchHotspot()
  }, [dispatch, handlePresentDetails, params])

  const handleSelectPlace = useCallback(
    async (place: PlacePrediction) => {
      const placeLocation = await getPlaceGeography(place.placeId)
      setGlobalOption('explore')
      setLocation([placeLocation.lng, placeLocation.lat])
    },
    [setGlobalOption],
  )

  const dismissList = useCallback(() => {
    setGlobalOption('explore')
  }, [setGlobalOption])

  const hexHotspots = useMemo(() => {
    if (!selectedHexId) return []
    return hotspotsForHexId[selectedHexId]
  }, [hotspotsForHexId, selectedHexId])

  const onHotspotSelected = useCallback((index, hotspot) => {
    setSelectedHotspotIndex(index)
    setShortcutItem(hotspot)
  }, [])

  const hotspotHasLocation = useMemo(() => {
    if (!hotspotAddress || !selectedHotspot) return true

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
    if (hasHotspots) {
      return (
        <>
          <HotspotSearch
            onSelectHotspot={handlePresentDetails}
            onSelectPlace={handleSelectPlace}
            visible={shortcutItem === 'search'}
          />
          <HotspotDetails
            visible={typeof shortcutItem !== 'string'}
            hotspot={selectedHotspot}
            onLayoutHeader={handleDetailHeaderLayout}
            onFailure={handleItemSelected}
            onSelectHotspot={handlePresentDetails}
            toggleSettings={toggleSettings}
            animatedPosition={animatedIndex}
          />

          <HotspotsList
            onSelectHotspot={handlePresentDetails}
            visible={shortcutItem === 'home'}
            searchPressed={handleSearching(true)}
            addHotspotPressed={handleHotspotSetup}
          />
        </>
      )
    }

    return (
      <HotspotsEmpty
        onOpenExplorer={dismissList}
        locationBlocked={locationBlocked}
        lightTheme
      />
    )
  }, [
    animatedIndex,
    dismissList,
    handleDetailHeaderLayout,
    handleHotspotSetup,
    handleItemSelected,
    handlePresentDetails,
    handleSearching,
    handleSelectPlace,
    hasHotspots,
    locationBlocked,
    selectedHotspot,
    shortcutItem,
    toggleSettings,
  ])

  const onChangeMapFilter = useCallback((filter: MapFilters) => {
    setMapFilter(filter)
  }, [])

  return (
    <>
      <Box flex={1} flexDirection="column" justifyContent="space-between">
        <Box position="absolute" height="100%" width="100%">
          {showMap && (
            <Map
              ownedHotspots={showOwned ? ownedHotspots : []}
              selectedHotspot={selectedHotspot}
              maxZoomLevel={13}
              zoomLevel={13}
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
            />
          )}
          <HotspotsViewHeader
            animatedPosition={animatedIndex}
            hexHotspots={hexHotspots}
            ownedHotspots={ownedHotspots}
            detailHeaderHeight={detailHeaderHeight}
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
        ownedHotspots={ownedHotspots || []}
        followedHotspots={followedHotspots || []}
        selectedItem={shortcutItem}
        onItemSelected={handleItemSelected}
      />
    </>
  )
}

export default memo(HotspotsView)
