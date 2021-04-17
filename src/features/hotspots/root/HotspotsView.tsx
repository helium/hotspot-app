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
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import { useNavigation } from '@react-navigation/native'
import { GeoJsonProperties } from 'geojson'
import HotspotIcon from '@assets/images/hotspot-icon-white.svg'
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
import BSHandle from '../../../components/BSHandle'
import HotspotMapButtons from './HotspotMapButtons'
import useToggle from '../../../utils/useToggle'
import HotspotsList from './HotspotsList'
import HotspotDetails from '../details/HotspotDetails'
import { ReAnimatedBox } from '../../../components/AnimatedBox'
import { useColors } from '../../../theme/themeHooks'
import BackButton from '../../../components/BackButton'
import HotspotsEmpty from './HotspotsEmpty'
import HotspotSettingsProvider from '../settings/HotspotSettingsProvider'
import HotspotSettings from '../settings/HotspotSettings'
import { RootStackParamList } from '../../../navigation/main/tabTypes'
import HotspotDetailsHandle from '../details/HotspotDetailsHandle'
import HotspotSearch from './HotspotSearch'
import { getPlaceGeography, PlacePrediction } from '../../../utils/googlePlaces'
import hotspotSearchSlice from '../../../store/hotspotSearch/hotspotSearchSlice'
import animateTransition from '../../../utils/animateTransition'

type Props = {
  ownedHotspots?: Hotspot[]
  followedHotspots?: Hotspot[]
  startOnMap?: boolean
  location?: number[]
  onViewMap: (prompt: boolean) => void
}

type ViewState = 'list' | 'search' | 'details' | 'details_and_map' | 'map'

const HotspotsView = ({
  ownedHotspots,
  followedHotspots,
  startOnMap,
  onViewMap,
  location: propsLocation,
}: Props) => {
  const navigation = useNavigation()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const colors = useColors()
  const [viewState, setViewState] = useState<ViewState>(
    startOnMap ? 'map' : 'list',
  )
  const [location, setLocation] = useState(propsLocation)
  const [backViewState, setBackViewState] = useState<ViewState>(viewState)
  const [detailsSnapIndex, setDetailsSnapIndex] = useState(startOnMap ? 0 : 1)

  const listRef = useRef<BottomSheetModal>(null)
  const detailsRef = useRef<BottomSheetModal>(null)

  const [listHeight, setListHeight] = useState(0)
  const listSnapPoints = useMemo(() => [listHeight], [listHeight])
  const detailSnapPoints = useMemo(() => [100, '75%'], [])

  const animatedListPosition = useSharedValue<number>(0)
  const animatedDetailsPosition = useSharedValue<number>(0)

  const [showWitnesses, toggleShowWitnesses] = useToggle(false)
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot>()

  const { witnesses, loading } = useSelector(
    (state: RootState) => state.hotspotDetails,
  )
  const networkHotspots = useSelector(
    (state: RootState) => state.networkHotspots.networkHotspots,
    isEqual,
  )
  const locationBlocked = useSelector(
    (state: RootState) => state.location.locationBlocked,
  )

  const hasHotspots = useMemo(
    () => ownedHotspots?.length || followedHotspots?.length,
    [followedHotspots?.length, ownedHotspots?.length],
  )

  const updateViewState = useCallback(
    (nextState: ViewState, backState: ViewState = 'list') => {
      if (nextState === viewState) return

      setBackViewState(backState)
      if (viewState !== 'map') {
        animateTransition(false)
      }
      setViewState(nextState)
    },
    [viewState],
  )

  useEffect(() => {
    setLocation(propsLocation)
  }, [propsLocation])

  useEffect(() => {
    switch (viewState) {
      case 'details':
        setDetailsSnapIndex(1)
        listRef.current?.dismiss()
        detailsRef.current?.present()
        break
      case 'search':
      case 'list':
        listRef.current?.present()
        detailsRef.current?.dismiss()
        break
      case 'map':
        detailsRef.current?.dismiss()
        listRef.current?.dismiss()
        break
      case 'details_and_map':
        setDetailsSnapIndex(0)
        listRef.current?.dismiss()
        detailsRef.current?.present()
        break
    }
  }, [viewState, startOnMap])

  const focusClosestHotspot = useCallback(() => {
    const localHotspots = Object.values(networkHotspots)
    if (!hasHotspots && localHotspots && localHotspots[0]) {
      const hotspot = {
        ...localHotspots[0],
      } as Hotspot
      setSelectedHotspot(hotspot)
    }
  }, [hasHotspots, networkHotspots])

  useEffect(() => {
    if (
      viewState === 'map' &&
      !selectedHotspot &&
      (!location ||
        (location.length === 2 && location[0] === 0 && location[1] === 0))
    ) {
      if (ownedHotspots && ownedHotspots.length > 0) {
        setLocation([ownedHotspots[0].lng || 0, ownedHotspots[0].lat || 0]) // Set map loc to one of their hotspots
      } else {
        setLocation([122.4194, 37.7749]) // SF - This shouldn't actually be possible
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewState, networkHotspots])

  const handleLayoutList = useCallback((event: LayoutChangeEvent) => {
    setListHeight(event.nativeEvent.layout.height - 166)
  }, [])

  const handlePresentDetails = useCallback(
    (backView: ViewState) => (hotspot: Hotspot) => {
      updateViewState('details', backView)
      setSelectedHotspot(hotspot)
    },
    [updateViewState],
  )

  const handleListDismiss = useCallback(() => {
    if (viewState === 'details') return
    updateViewState('map')
    onViewMap(true)
  }, [updateViewState, viewState, onViewMap])

  const handleDetailsChange = useCallback((index: number) => {
    if (index === 1) {
      setViewState('details')
    } else if (index === 0) {
      setViewState('details_and_map')
    }
  }, [])

  const handleSelectPlace = useCallback(
    async (place: PlacePrediction) => {
      updateViewState('map', 'search')
      setSelectedHotspot(undefined)
      const placeLocation = await getPlaceGeography(place.placeId)
      setLocation([placeLocation.lng, placeLocation.lat])
    },
    [updateViewState],
  )

  const handlePressMyHotspots = useCallback(() => {
    if (ownedHotspots && ownedHotspots.length > 0) {
      setSelectedHotspot(ownedHotspots[0])
    } else {
      focusClosestHotspot()
    }
    updateViewState('details_and_map')
  }, [focusClosestHotspot, ownedHotspots, updateViewState])

  const dismissList = useCallback(() => {
    updateViewState('map')
  }, [updateViewState])

  const handleBack = useCallback(() => {
    updateViewState(backViewState)
    dispatch(hotspotDetailsSlice.actions.clearHotspotDetails())
    setSelectedHotspot(undefined)
  }, [dispatch, backViewState, updateViewState])

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
      setSelectedHotspot(hotspot)
      updateViewState(
        'details_and_map',
        backViewState === 'search' ? 'search' : 'list',
      )
    },
    [backViewState, updateViewState],
  )

  const backdropStyles = useAnimatedStyle(
    () => ({
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: colors.purpleMain,
      opacity: interpolate(
        animatedListPosition.value,
        [0, 1],
        [0, 1],
        Extrapolate.CLAMP,
      ),
    }),
    [animatedListPosition, colors, listSnapPoints],
  )

  const backdropTitleStyles = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateY: interpolate(
            animatedListPosition.value,
            [0, 1],
            [-100, 0],
            Extrapolate.CLAMP,
          ),
        },
      ],
    }),
    [animatedListPosition, listSnapPoints],
  )

  const containerStyles = useMemo(
    () => ({
      marginTop: 70,
    }),
    [],
  )

  const hasLocation = useMemo(() => {
    if (!selectedHotspot) return true
    return (
      selectedHotspot?.lat !== undefined && selectedHotspot?.lng !== undefined
    )
  }, [selectedHotspot])

  const toggleSettings = useCallback(() => {
    dispatch(hotspotDetailsSlice.actions.toggleShowSettings())
  }, [dispatch])

  const handleHotspotSetup = useCallback(
    () => navigation.navigate('HotspotSetup'),
    [navigation],
  )

  const detailsHandle = useCallback(() => {
    if (!selectedHotspot) return null

    return <HotspotDetailsHandle hotspot={selectedHotspot} />
  }, [selectedHotspot])

  const listBody = useMemo(() => {
    if (viewState === 'search') {
      return (
        <HotspotSearch
          onSelectHotspot={handlePresentDetails('search')}
          onSelectPlace={handleSelectPlace}
        />
      )
    }

    if (hasHotspots)
      return <HotspotsList onSelectHotspot={handlePresentDetails('list')} />

    return (
      <HotspotsEmpty
        onOpenExplorer={dismissList}
        locationBlocked={locationBlocked}
        lightTheme
      />
    )
  }, [
    dismissList,
    handlePresentDetails,
    handleSelectPlace,
    hasHotspots,
    locationBlocked,
    viewState,
  ])

  const detailBody = useMemo(() => {
    return <HotspotDetails hotspot={selectedHotspot} />
  }, [selectedHotspot])

  const setSearching = useCallback(
    (searching: boolean) => () => {
      if (searching) {
        updateViewState('search')
      } else {
        updateViewState('list')
      }
      dispatch(hotspotSearchSlice.actions.clear())
    },
    [dispatch, updateViewState],
  )

  const menuOptions = useMemo(() => {
    if (viewState === 'search') {
      return (
        <TouchableOpacityBox onPress={setSearching(false)} padding="s">
          <Close width={22} height={22} color="white" />
        </TouchableOpacityBox>
      )
    }
    if (viewState === 'details' || viewState === 'details_and_map') {
      return (
        <>
          <TouchableOpacityBox onPress={toggleSettings} padding="s">
            <Settings width={22} height={22} color="white" />
          </TouchableOpacityBox>
        </>
      )
    }
    if (viewState === 'list') {
      return (
        <>
          <TouchableOpacityBox onPress={setSearching(true)} padding="s">
            <Search width={22} height={22} color="white" />
          </TouchableOpacityBox>
          <TouchableOpacityBox onPress={handleHotspotSetup} padding="s">
            <Add width={22} height={22} />
          </TouchableOpacityBox>
        </>
      )
    }
    return null
  }, [handleHotspotSetup, setSearching, toggleSettings, viewState])

  const title = useMemo(() => {
    if (viewState === 'search') return t('hotspots.search.title')
    if (hasHotspots) return t('hotspots.owned.title')
    return t('hotspots.owned.title_no_hotspots')
  }, [hasHotspots, t, viewState])

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
          interactive={hasLocation}
          showNoLocation={!hasLocation}
          showNearbyHotspots
        />
        <HotspotMapButtons
          animatedPosition={animatedDetailsPosition}
          showWitnesses={showWitnesses}
          toggleShowWitnesses={toggleShowWitnesses}
          loading={loading}
          isVisible={!!selectedHotspot && hasLocation}
        />
        <ReAnimatedBox pointerEvents="none" style={backdropStyles} />
        <ReAnimatedBox
          position="absolute"
          top={0}
          width="100%"
          padding="m"
          style={backdropTitleStyles}
        >
          <TouchableOpacityBox
            flexDirection="row"
            justifyContent="center"
            onPress={handlePressMyHotspots}
          >
            <Box marginRight="s">
              <HotspotIcon />
            </Box>
            <Text variant="body1Bold" color="white">
              {hasHotspots
                ? t('hotspots.owned.title')
                : t('hotspots.owned.title_no_hotspots')}
            </Text>
          </TouchableOpacityBox>
        </ReAnimatedBox>
      </Box>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        padding="m"
      >
        {viewState !== 'list' && viewState !== 'search' ? (
          <BackButton
            paddingHorizontal="none"
            paddingVertical="s"
            onPress={handleBack}
          />
        ) : (
          <Text variant="h3">{title}</Text>
        )}

        <Box flexDirection="row" justifyContent="space-between">
          {menuOptions}
        </Box>
      </Box>

      <BottomSheetModal
        ref={listRef}
        snapPoints={listSnapPoints}
        index={0}
        handleComponent={BSHandle}
        animatedIndex={animatedListPosition}
        onDismiss={handleListDismiss}
      >
        {listBody}
      </BottomSheetModal>

      <BottomSheetModal
        ref={detailsRef}
        snapPoints={detailSnapPoints}
        index={detailsSnapIndex}
        handleComponent={detailsHandle}
        animatedIndex={animatedDetailsPosition}
        dismissOnPanDown={false}
        onChange={handleDetailsChange}
      >
        {detailBody}
      </BottomSheetModal>

      <HotspotSettingsProvider>
        <HotspotSettings hotspot={selectedHotspot} />
      </HotspotSettingsProvider>
    </Box>
  )
}

export default memo(HotspotsView)
