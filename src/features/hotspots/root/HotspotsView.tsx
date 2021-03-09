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
import Text from '../../../components/Text'
import Box from '../../../components/Box'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import Add from '../../../assets/images/add.svg'
import Settings from '../../../assets/images/settings.svg'
import Map from '../../../components/Map'
import { RootState } from '../../../store/rootReducer'
import hotspotDetailsSlice from '../../../store/hotspotDetails/hotspotDetailsSlice'
import { fetchHotspotsData } from '../../../store/hotspots/hotspotsSlice'
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

type Props = {
  ownedHotspots?: Hotspot[]
  startOnMap?: boolean
  location?: number[]
}

const HotspotsView = ({ ownedHotspots, startOnMap, location }: Props) => {
  const navigation = useNavigation()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const colors = useColors()
  const hasHotspots = ownedHotspots && ownedHotspots.length > 0

  const [listIsDismissed, setListIsDismissed] = useState(!!startOnMap)
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
    if (listIsDismissed && !selectedHotspot) {
      if (ownedHotspots && ownedHotspots.length > 0) {
        setSelectedHotspot(ownedHotspots[0])
      } else {
        focusClosestHotspot()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listIsDismissed, networkHotspots])

  useEffect(() => {
    if (hasHotspots) {
      dispatch(fetchHotspotsData())
    }
    if (startOnMap) {
      detailsRef.current?.present()
    } else {
      listRef.current?.present()
    }
  }, [dispatch, hasHotspots, startOnMap])

  useEffect(() => {
    return navigation.addListener('focus', () => {
      dispatch(fetchHotspotsData())
    })
  }, [navigation, dispatch])

  const handleLayoutList = useCallback((event: LayoutChangeEvent) => {
    setListHeight(event.nativeEvent.layout.height - 166)
  }, [])

  const handlePresentDetails = useCallback((hotspot: Hotspot) => {
    setSelectedHotspot(hotspot)
    setDetailsSnapIndex(1)
    listRef.current?.dismiss()
  }, [])

  const handleDismissList = useCallback(() => {
    detailsRef.current?.present()
    setListIsDismissed(true)
  }, [])

  const handlePressMyHotspots = useCallback(() => {
    if (ownedHotspots && ownedHotspots.length > 0) {
      setSelectedHotspot(ownedHotspots[0])
    } else {
      focusClosestHotspot()
    }
    setDetailsSnapIndex(startOnMap ? 0 : 1)
    listRef.current?.dismiss()
  }, [focusClosestHotspot, ownedHotspots, startOnMap])

  const handleDismissDetails = useCallback(() => {
    setDetailsSnapIndex(0)
    if (listIsDismissed) {
      listRef.current?.present()
      setListIsDismissed(false)
    }
  }, [listIsDismissed])

  const handleBack = useCallback(() => {
    detailsRef.current?.dismiss()
    dispatch(hotspotDetailsSlice.actions.clearHotspotDetails())
  }, [dispatch])

  useEffect(() => {
    const navParent = navigation.dangerouslyGetParent() as BottomTabNavigationProp<RootStackParamList>
    if (!navParent) return

    return navParent.addListener('tabPress', () => {
      if (navigation.isFocused()) {
        handleBack()
      }
    })
  }, [handleBack, navigation])

  const onMapHotspotSelected = useCallback((properties: GeoJsonProperties) => {
    const hotspot = {
      ...properties,
    } as Hotspot
    setSelectedHotspot(hotspot)
  }, [])

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
        {listIsDismissed ? (
          <BackButton
            paddingHorizontal="none"
            paddingVertical="s"
            onPress={handleBack}
          />
        ) : (
          <Text variant="h3">
            {hasHotspots
              ? t('hotspots.owned.title')
              : t('hotspots.owned.title_no_hotspots')}
          </Text>
        )}

        <Box flexDirection="row" justifyContent="space-between">
          <TouchableOpacityBox onPress={toggleSettings} padding="s">
            <Settings width={22} height={22} color="white" />
          </TouchableOpacityBox>
          <TouchableOpacityBox
            onPress={() => navigation.navigate('HotspotSetup')}
            padding="s"
          >
            <Add width={22} height={22} />
          </TouchableOpacityBox>
        </Box>
      </Box>

      <BottomSheetModal
        ref={listRef}
        snapPoints={listSnapPoints}
        index={0}
        handleComponent={BSHandle}
        onDismiss={handleDismissList}
        animatedIndex={animatedListPosition}
      >
        {hasHotspots ? (
          <HotspotsList onSelectHotspot={handlePresentDetails} />
        ) : (
          <HotspotsEmpty onOpenExplorer={handleDismissList} lightTheme />
        )}
      </BottomSheetModal>

      <BottomSheetModal
        ref={detailsRef}
        snapPoints={detailSnapPoints}
        index={detailsSnapIndex}
        handleComponent={BSHandle}
        onDismiss={handleDismissDetails}
        animatedIndex={animatedDetailsPosition}
        dismissOnPanDown={false}
      >
        <HotspotDetails hotspot={selectedHotspot} />
      </BottomSheetModal>

      <HotspotSettingsProvider>
        <HotspotSettings hotspot={selectedHotspot} />
      </HotspotSettingsProvider>
    </Box>
  )
}

export default memo(HotspotsView)
