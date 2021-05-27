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
import HotspotsViewHeader from './HotspotsViewHeader'
import useToggle from '../../../utils/useToggle'
import HotspotsList from './HotspotsList'
import HotspotDetails from '../details/HotspotDetails'
import BackButton from '../../../components/BackButton'
import HotspotsEmpty from './HotspotsEmpty'
import HotspotSettingsProvider from '../settings/HotspotSettingsProvider'
import HotspotSettings from '../settings/HotspotSettings'
import { RootStackParamList } from '../../../navigation/main/tabTypes'
import HotspotSheetHandle, {
  HOTSPOT_SHEET_HANDLE_HEIGHT,
} from './HotspotSheetHandle'
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
import { hp } from '../../../utils/layout'
import useMount from '../../../utils/useMount'
import { fetchHotspotsForHex } from '../../../store/discovery/discoverySlice'

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
  type BackStackEntry = {
    viewState: 'details' | 'search' | 'list'
    bottomSheetIndex: number
  }
  const [backStack, setBackStack] = useState<BackStackEntry[]>([])
  const navigation = useNavigation()
  const { params } = useRoute<Route>()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [linkedHotspotAddress, setLinkedHotspotAddress] = useState('')
  const [location, setLocation] = useState(propsLocation)
  const [showDetails, setShowDetails] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const listRef = useRef<BottomSheetModal>(null)
  const listHeight = useRef(hp(66))
  const [detailHeaderHeight, setDetailHeaderHeight] = useState(144)
  const [bottomSheetIndex, setBottomSheetIndex] = useState(startOnMap ? 0 : 1)
  const prevBottomSheetIndex = usePrevious(bottomSheetIndex)
  const visible = useVisible()
  const prevVisible = usePrevious(visible)
  const prevShowDetails = usePrevious(showDetails)
  const hotspotsForHexId = useSelector(
    (state: RootState) => state.discovery.hotspotsForHexId,
  )
  const [selectedHexId, setSelectedHexId] = useState<string>()
  const [selectedHotspotIndex, setSelectedHotspotIndex] = useState(0)
  const animatedIndex = useSharedValue<number>(0)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showWitnesses, toggleShowWitnesses] = useToggle(false)

  const selectedHotspot = useSelector(
    (state: RootState) => state.hotspots.selectedHotspot,
    isEqual,
  )
  const locationBlocked = useSelector(
    (state: RootState) => state.location.locationBlocked,
  )

  const hotspotAddress = useMemo(
    () => selectedHotspot?.address || linkedHotspotAddress || '',
    [selectedHotspot, linkedHotspotAddress],
  )

  useEffect(() => {
    const shouldShowDetails = !!hotspotAddress
    if (shouldShowDetails === showDetails) {
      return
    }
    if (visible && prevVisible) {
      animateTransition('HotspotsView.DetailsChange', false)
    }
    setShowDetails(shouldShowDetails)
  }, [hotspotAddress, linkedHotspotAddress, prevVisible, showDetails, visible])

  useEffect(() => {
    setLinkedHotspotAddress(params?.address || '')
  }, [params])

  useMount(() => {
    if (startOnMap) {
      setShowMap(true)
      return
    }

    setTimeout(() => {
      setShowMap(true)
    }, SHEET_ANIM_DURATION)
  })

  const snapPoints = useMemo(() => {
    if (showDetails) return [detailHeaderHeight, listHeight.current]
    return [1, listHeight.current]
  }, [detailHeaderHeight, listHeight, showDetails])

  const hasHotspots = useMemo(
    () => ownedHotspots?.length || followedHotspots?.length,
    [followedHotspots?.length, ownedHotspots?.length],
  )

  const hotspotDetailsData =
    useSelector(
      (state: RootState) => state.hotspotDetails.hotspotData[hotspotAddress],
    ) || {}
  const { witnesses } = hotspotDetailsData || {}

  const showHotspotDetails = useCallback(
    (hotspot?: Hotspot) => {
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
  }, [
    bottomSheetIndex,
    followedHotspots,
    hasUserLocation,
    hotspotAddress,
    ownedHotspots,
  ])

  const handleDetailHeaderLayout = useCallback((event: LayoutChangeEvent) => {
    setDetailHeaderHeight(event.nativeEvent.layout.height)
  }, [])

  const handlePresentDetails = useCallback(
    () => (hotspot: Hotspot) => {
      showHotspotDetails(hotspot)
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
    if (
      backStack.find(
        (entry, idx) =>
          idx !== backStack.length - 1 &&
          entry.bottomSheetIndex === 0 &&
          entry.viewState === 'list',
      )
    ) {
      setBackStack([])
      animateTransition('HotspotsView.HandleBack', false)
      showHotspotDetails(undefined)
      setLinkedHotspotAddress('')
      return
    }

    if (bottomSheetIndex === 0) {
      listRef.current?.snapTo(1)
      return
    }

    const last = backStack[backStack.length - 1]
    if (last.viewState === 'details') {
      animateTransition('HotspotsView.HandleBack', false)
      showHotspotDetails(undefined)
      setLinkedHotspotAddress('')
    }
  }, [backStack, bottomSheetIndex, showHotspotDetails])

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

  const hexHotspots = useMemo(() => {
    if (!selectedHexId) return []
    return hotspotsForHexId[selectedHexId]
  }, [hotspotsForHexId, selectedHexId])

  const onMapHexSelected = useCallback(
    async (hexId: string) => {
      setSelectedHexId(hexId)
      setSelectedHotspotIndex(0)
      const result = (await dispatch(fetchHotspotsForHex({ hexId }))) as {
        payload?: Hotspot[]
      }
      if (result && result.payload && result.payload.length) {
        showHotspotDetails(result.payload[0] as Hotspot)
      }
    },
    [dispatch, showHotspotDetails],
  )

  const onHotspotSelected = useCallback(
    (index, hotspot) => {
      setSelectedHotspotIndex(index)
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

  const cardHandle = useCallback(
    () => <HotspotSheetHandle showNav={false} />,
    [],
  )

  const updateBackStack = useCallback(
    (viewState: 'list' | 'details' | 'search') => {
      if (viewState === 'list' && bottomSheetIndex === 1) {
        setBackStack([{ viewState, bottomSheetIndex }])
        return
      }

      setBackStack((stack) => [...stack, { viewState, bottomSheetIndex }])
    },
    [bottomSheetIndex],
  )

  useEffect(() => {
    if (showDetails) {
      updateBackStack('details')
      return
    }

    if (isSearching) {
      updateBackStack('search')
      return
    }

    updateBackStack('list')
  }, [isSearching, showDetails, updateBackStack])

  const body = useMemo(() => {
    if (showDetails)
      return (
        <HotspotDetails
          hotspotAddress={linkedHotspotAddress}
          hotspot={selectedHotspot}
          onLayoutHeader={handleDetailHeaderLayout}
          onFailure={handleBack}
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
    handleBack,
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
    if (showDetails || bottomSheetIndex === 0) {
      return (
        <BackButton
          alignSelf="center"
          paddingHorizontal="none"
          paddingVertical="m"
          onPress={handleBack}
        />
      )
    }
    return <Text variant="h3">{title}</Text>
  }, [showDetails, bottomSheetIndex, title, handleBack])

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

          <FollowButton padding="s" address={hotspotAddress} />
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
    hotspotAddress,
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
        overflow="hidden"
      >
        {showMap && (
          <Map
            ownedHotspots={ownedHotspots}
            selectedHotspot={selectedHotspot}
            maxZoomLevel={13}
            zoomLevel={13}
            witnesses={showWitnesses ? witnesses : []}
            followedHotspots={followedHotspots}
            mapCenter={location}
            animationMode="easeTo"
            animationDuration={800}
            onHexSelected={onMapHexSelected}
            interactive={hotspotHasLocation}
            showNoLocation={!hotspotHasLocation}
            showNearbyHotspots
            showH3Grid
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
          buttonsVisible={
            !!hotspotAddress &&
            hotspotHasLocation &&
            showDetails &&
            prevShowDetails
          }
          showNoLocation={!locationIsValid(propsLocation) && !showDetails}
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
        handleComponent={cardHandle}
        animatedIndex={animatedIndex}
        onChange={setBottomSheetIndex}
        handleHeight={HOTSPOT_SHEET_HANDLE_HEIGHT}
        animationDuration={SHEET_ANIM_DURATION}
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
