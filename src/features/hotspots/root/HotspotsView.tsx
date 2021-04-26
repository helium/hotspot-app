import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { LayoutChangeEvent } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Hotspot } from '@helium/http'
import BottomSheet, { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useSharedValue } from 'react-native-reanimated'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { GeoJsonProperties } from 'geojson'
import { isEqual } from 'lodash'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import Search from '@assets/images/search.svg'
import Close from '@assets/images/closeMenu.svg'
import Text from '../../../components/Text'
import Box from '../../../components/Box'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import Add from '../../../assets/images/add.svg'
import Settings from '../../../assets/images/settings.svg'
import Map from '../../../components/Map'
import { RootState } from '../../../store/rootReducer'
import hotspotDetailsSlice from '../../../store/hotspotDetails/hotspotDetailsSlice'
import HotspotMapButtons from './HotspotMapButtons'
import useToggle from '../../../utils/useToggle'
import HotspotsList from './HotspotsList'
import HotspotDetails from '../details/HotspotDetails'
import BackButton from '../../../components/BackButton'
import HotspotsEmpty from './HotspotsEmpty'
import HotspotSettingsProvider from '../settings/HotspotSettingsProvider'
import HotspotSettings from '../settings/HotspotSettings'
import { RootStackParamList } from '../../../navigation/main/tabTypes'
import HotspotDetailsHandle from '../details/HotspotDetailsHandle'
import HotspotSearch from './HotspotSearch'
import { getPlaceGeography, PlacePrediction } from '../../../utils/googlePlaces'
import hotspotSearchSlice from '../../../store/hotspotSearch/hotspotSearchSlice'
import FollowButton from '../../../components/FollowButton'
import hotspotsSlice from '../../../store/hotspots/hotspotsSlice'
import {
  locationIsValid,
  hotspotHasValidLocation,
} from '../../../utils/location'
import { HotspotStackParamList } from './hotspotTypes'
import animateTransition from '../../../utils/animateTransition'
import usePrevious from '../../../utils/usePrevious'
import useVisible from '../../../utils/useVisible'

type Props = {
  ownedHotspots?: Hotspot[]
  followedHotspots?: Hotspot[]
  startOnMap?: boolean
  location?: number[]
  onViewMap: (prompt: boolean) => void
}

type Route = RouteProp<HotspotStackParamList, 'HotspotsScreen'>

const HotspotsView = ({
  ownedHotspots,
  followedHotspots,
  startOnMap,
  onViewMap,
  location: propsLocation,
}: Props) => {
  const navigation = useNavigation()
  const { params } = useRoute<Route>()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [linkedHotspotAddress, setLinkedHotspotAddress] = useState('')
  const [location, setLocation] = useState(propsLocation)
  const [showDetailsNav, setShowDetailsNav] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const listRef = useRef<BottomSheetModal>(null)
  const [listHeight, setListHeight] = useState(144)
  const [detailHeaderHeight, setDetailHeaderHeight] = useState(144)
  const [bottomSheetIndex, setBottomSheetIndex] = useState(startOnMap ? 0 : 1)
  const prevBottomSheetIndex = usePrevious(bottomSheetIndex)
  const visible = useVisible()
  const prevVisible = usePrevious(visible)

  const animatedIndex = useSharedValue<number>(0)

  const [showWitnesses, toggleShowWitnesses] = useToggle(false)

  const networkHotspots = useSelector(
    (state: RootState) => state.networkHotspots.networkHotspots,
    isEqual,
  )
  const selectedHotspot = useSelector(
    (state: RootState) => state.hotspots.selectedHotspot,
    isEqual,
  )
  const locationBlocked = useSelector(
    (state: RootState) => state.location.locationBlocked,
  )

  useEffect(() => {
    const shouldShowDetails = !!selectedHotspot || !!linkedHotspotAddress
    if (shouldShowDetails === showDetails) return

    if (visible && prevVisible) animateTransition(false)
    setShowDetails(shouldShowDetails)
  }, [linkedHotspotAddress, prevVisible, selectedHotspot, showDetails, visible])

  useEffect(() => {
    setLinkedHotspotAddress(params?.address || '')
  }, [params])

  const snapPoints = useMemo(() => {
    if (showDetails) return [detailHeaderHeight, listHeight]
    return [0, listHeight]
  }, [detailHeaderHeight, listHeight, showDetails])

  const hasHotspots = useMemo(
    () => ownedHotspots?.length || followedHotspots?.length,
    [followedHotspots?.length, ownedHotspots?.length],
  )

  const hotspotDetailsData =
    useSelector(
      (state: RootState) =>
        state.hotspotDetails.hotspotData[selectedHotspot?.address || ''],
    ) || {}
  const { witnesses, loading } = hotspotDetailsData || {}

  const showHotspotDetails = useCallback(
    (hotspot?: Hotspot, showNav = false) => {
      setShowDetailsNav(showNav)
      dispatch(hotspotsSlice.actions.selectHotspot(hotspot))
    },
    [dispatch],
  )

  useEffect(() => {
    setLocation(propsLocation)
  }, [propsLocation])

  useEffect(() => {
    if (
      isSearching ||
      showDetails ||
      bottomSheetIndex !== 0 ||
      bottomSheetIndex === prevBottomSheetIndex
    )
      return

    onViewMap(true)
  }, [
    bottomSheetIndex,
    isSearching,
    onViewMap,
    prevBottomSheetIndex,
    showDetails,
  ])

  const hasUserLocation = useMemo(
    () =>
      location &&
      location.length === 2 &&
      location[0] !== 0 &&
      location[1] !== 0,
    [location],
  )

  useEffect(() => {
    if (animatedIndex.value === 0 && !selectedHotspot && !hasUserLocation) {
      if (ownedHotspots && ownedHotspots.length > 0) {
        setLocation([ownedHotspots[0].lng || 0, ownedHotspots[0].lat || 0]) // Set map loc to one of their hotspots
      } else {
        setLocation([122.4194, 37.7749]) // SF - This shouldn't actually be possible
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkHotspots])

  const handleLayoutList = useCallback((event: LayoutChangeEvent) => {
    setListHeight(event.nativeEvent.layout.height - 166)
  }, [])

  const handleDetailHeaderLayout = useCallback((event: LayoutChangeEvent) => {
    setDetailHeaderHeight(event.nativeEvent.layout.height)
  }, [])

  const handlePresentDetails = useCallback(
    () => (hotspot: Hotspot, showNav = false) => {
      showHotspotDetails(hotspot, showNav)
    },
    [showHotspotDetails],
  )

  const handleSelectPlace = useCallback(
    async (place: PlacePrediction) => {
      showHotspotDetails(undefined)
      const placeLocation = await getPlaceGeography(place.placeId)
      setLocation([placeLocation.lng, placeLocation.lat])
      listRef.current?.snapTo(0)
    },
    [showHotspotDetails],
  )

  const handleBack = useCallback(async () => {
    if (bottomSheetIndex === 0) {
      listRef.current?.snapTo(1)
      return
    }

    if (showDetails) {
      animateTransition(false)
      showHotspotDetails(undefined)
      setLinkedHotspotAddress('')
    }
  }, [bottomSheetIndex, showDetails, showHotspotDetails])

  const dismissList = useCallback(() => {
    listRef.current?.snapTo(0)
  }, [])

  useEffect(() => {
    const navParent = navigation.dangerouslyGetParent() as BottomTabNavigationProp<RootStackParamList>
    if (!navParent) return

    return navParent.addListener('tabPress', () => {
      if (navigation.isFocused()) {
        handleBack()
      }
    })
  }, [handleBack, navigation])

  const onMapHotspotSelected = useCallback(
    (properties: GeoJsonProperties) => {
      const hotspot = {
        ...properties,
      } as Hotspot
      showHotspotDetails(hotspot)
    },
    [showHotspotDetails],
  )

  const containerStyles = useMemo(
    () => ({
      marginTop: 70,
    }),
    [],
  )

  const hotspotHasLocation = useMemo(() => {
    if (!selectedHotspot) return true
    return hotspotHasValidLocation(selectedHotspot)
  }, [selectedHotspot])

  const toggleSettings = useCallback(() => {
    dispatch(hotspotDetailsSlice.actions.toggleShowSettings())
  }, [dispatch])

  const handleHotspotSetup = useCallback(
    () => navigation.navigate('HotspotSetup'),
    [navigation],
  )

  const handle = useCallback(() => {
    const hide = !selectedHotspot && !linkedHotspotAddress

    return <HotspotDetailsHandle showNav={!hide && showDetailsNav} />
  }, [selectedHotspot, linkedHotspotAddress, showDetailsNav])

  const body = useMemo(() => {
    if (showDetails)
      return (
        <HotspotDetails
          hotspotAddress={linkedHotspotAddress}
          hotspot={selectedHotspot}
          onLayoutHeader={handleDetailHeaderLayout}
        />
      )

    if (isSearching) {
      return (
        <HotspotSearch
          onSelectHotspot={handlePresentDetails()}
          onSelectPlace={handleSelectPlace}
        />
      )
    }

    if (hasHotspots)
      return <HotspotsList onSelectHotspot={handlePresentDetails()} />

    return (
      <HotspotsEmpty
        onOpenExplorer={dismissList}
        locationBlocked={locationBlocked}
        lightTheme
      />
    )
  }, [
    dismissList,
    handleDetailHeaderLayout,
    handlePresentDetails,
    handleSelectPlace,
    hasHotspots,
    isSearching,
    linkedHotspotAddress,
    locationBlocked,
    selectedHotspot,
    showDetails,
  ])

  const handleSearching = useCallback(
    (searching: boolean) => () => {
      setIsSearching(searching)
      dispatch(hotspotSearchSlice.actions.clear())
    },
    [dispatch],
  )

  const title = useMemo(() => {
    if (isSearching) return t('hotspots.search.title')
    if (hasHotspots) return t('hotspots.owned.title')
    return t('hotspots.owned.title_no_hotspots')
  }, [hasHotspots, isSearching, t])

  const leftMenuOptions = useMemo(() => {
    if (showDetails || bottomSheetIndex === 0)
      return (
        <BackButton
          alignSelf="center"
          paddingHorizontal="none"
          paddingVertical="m"
          onPress={handleBack}
        />
      )
    return <Text variant="h3">{title}</Text>
  }, [handleBack, bottomSheetIndex, showDetails, title])

  const rightMenuOptions = useMemo(() => {
    if (isSearching && !showDetails && bottomSheetIndex === 1) {
      return (
        <TouchableOpacityBox onPress={handleSearching(false)} padding="s">
          <Close width={22} height={22} color="white" />
        </TouchableOpacityBox>
      )
    }
    if (showDetails) {
      return (
        <>
          <TouchableOpacityBox onPress={toggleSettings} padding="s">
            <Settings width={22} height={22} color="white" />
          </TouchableOpacityBox>

          <FollowButton
            padding="s"
            address={linkedHotspotAddress || selectedHotspot?.address || ''}
          />
        </>
      )
    }
    if (bottomSheetIndex === 1)
      return (
        <>
          <TouchableOpacityBox onPress={handleSearching(true)} padding="s">
            <Search width={22} height={22} color="white" />
          </TouchableOpacityBox>
          <TouchableOpacityBox onPress={handleHotspotSetup} padding="s">
            <Add width={22} height={22} />
          </TouchableOpacityBox>
        </>
      )
    return null
  }, [
    isSearching,
    showDetails,
    bottomSheetIndex,
    handleSearching,
    handleHotspotSetup,
    toggleSettings,
    linkedHotspotAddress,
    selectedHotspot?.address,
  ])

  return (
    <Box flex={1} flexDirection="column" justifyContent="space-between">
      <Box
        position="absolute"
        height="100%"
        width="100%"
        borderTopLeftRadius="xl"
        borderTopRightRadius="xl"
        style={containerStyles}
        onLayout={handleLayoutList}
        overflow="hidden"
      >
        <Map
          ownedHotspots={ownedHotspots}
          selectedHotspot={selectedHotspot}
          maxZoomLevel={14}
          zoomLevel={14}
          witnesses={showWitnesses ? witnesses : []}
          mapCenter={location}
          animationMode="easeTo"
          animationDuration={800}
          onFeatureSelected={onMapHotspotSelected}
          interactive={hotspotHasLocation}
          showNoLocation={!hotspotHasLocation}
          showNearbyHotspots
        />
        <HotspotMapButtons
          animatedPosition={animatedIndex}
          showWitnesses={showWitnesses}
          toggleShowWitnesses={toggleShowWitnesses}
          loading={loading}
          detailHeaderHeight={detailHeaderHeight}
          isVisible={!!selectedHotspot && hotspotHasLocation}
          showNoLocation={!locationIsValid(propsLocation)}
        />
      </Box>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal="m"
        height={75}
      >
        {leftMenuOptions}

        <Box flexDirection="row" justifyContent="space-between">
          {rightMenuOptions}
        </Box>
      </Box>

      <BottomSheet
        ref={listRef}
        snapPoints={snapPoints}
        index={bottomSheetIndex}
        handleComponent={handle}
        animatedIndex={animatedIndex}
        onChange={setBottomSheetIndex}
        enableContentPanningGesture={
          !isSearching || (isSearching && showDetails)
        }
        enableHandlePanningGesture={
          !isSearching || (isSearching && showDetails)
        }
      >
        {body}
      </BottomSheet>

      <HotspotSettingsProvider>
        <HotspotSettings hotspot={selectedHotspot} />
      </HotspotSettingsProvider>
    </Box>
  )
}

export default memo(HotspotsView)
