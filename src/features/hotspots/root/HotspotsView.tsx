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
import Text from '../../../components/Text'
import Box from '../../../components/Box'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import Add from '../../../assets/images/add.svg'
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

type Props = {
  ownedHotspots: Hotspot[]
}

const HotspotsView = ({ ownedHotspots }: Props) => {
  const navigation = useNavigation()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const colors = useColors()

  const [listIsDismissed, setListIsDismissed] = useState(false)
  const [detailsSnapIndex, setDetailsSnapIndex] = useState(1)

  const listRef = useRef<BottomSheetModal>(null)
  const detailsRef = useRef<BottomSheetModal>(null)

  const [listHeight, setListHeight] = useState(0)
  const listSnapPoints = useMemo(() => [listHeight], [listHeight])
  const detailSnapPoints = useMemo(() => [100, '75%'], [])

  const animatedListPosition = useSharedValue<number>(0)
  const animatedDetailsPosition = useSharedValue<number>(0)

  useEffect(() => {
    dispatch(fetchHotspotsData())
    listRef.current?.present()
  }, [dispatch])

  const [showWitnesses, toggleShowWitnesses] = useToggle(false)

  const {
    hotspotDetails: { witnesses, loading },
  } = useSelector((state: RootState) => state)

  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot>()

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(fetchHotspotsData())
    })

    return unsubscribe
  }, [navigation, dispatch])

  const handleLayoutList = useCallback((event: LayoutChangeEvent) => {
    setListHeight(event.nativeEvent.layout.height - 166)
  }, [])

  const handlePresentDetails = useCallback((hotspot: Hotspot) => {
    setSelectedHotspot(hotspot)
    detailsRef.current?.present()
  }, [])

  const handleDismissList = useCallback(() => {
    setSelectedHotspot(ownedHotspots[0])
    setDetailsSnapIndex(0)
    detailsRef.current?.present()
    setListIsDismissed(true)
  }, [ownedHotspots])

  const handlePressMyHotspots = useCallback(() => {
    setSelectedHotspot(ownedHotspots[0])
    setDetailsSnapIndex(1)
    detailsRef.current?.present()
  }, [ownedHotspots])

  const handleDismissDetails = useCallback(() => {
    setSelectedHotspot(undefined)
    setDetailsSnapIndex(1)
    dispatch(hotspotDetailsSlice.actions.clearHotspotDetails())
    if (listIsDismissed) {
      listRef.current?.present()
      setListIsDismissed(false)
    }
  }, [dispatch, listIsDismissed])

  const handleBack = useCallback(() => {
    detailsRef.current?.dismiss()
    setSelectedHotspot(undefined)
    dispatch(hotspotDetailsSlice.actions.clearHotspotDetails())
  }, [dispatch])

  useEffect(() => {
    const navParent = navigation.dangerouslyGetParent()
    if (!navParent) return

    const unsubscribe = navParent.addListener('tabPress', () => {
      if (navigation.isFocused()) {
        handleBack()
      }
    })

    return unsubscribe
  }, [handleBack, navigation])

  const onMapHotspotSelected = useCallback((properties: GeoJsonProperties) => {
    const hotspot = {
      ...properties,
    } as Hotspot
    setSelectedHotspot(hotspot)
    detailsRef.current?.present()
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
  const selectedHotspots = useMemo(
    () => (selectedHotspot && hasLocation ? [selectedHotspot] : undefined),
    [selectedHotspot, hasLocation],
  )
  const mapCenter = useMemo(
    () =>
      selectedHotspot
        ? [selectedHotspot.lng || 0, selectedHotspot.lat || 0]
        : [ownedHotspots[0].lng || 0, ownedHotspots[0].lat || 0],
    [selectedHotspot, ownedHotspots],
  )

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
          selectedHotspots={selectedHotspots}
          zoomLevel={14}
          mapCenter={mapCenter}
          witnesses={showWitnesses ? witnesses : []}
          animationMode="easeTo"
          animationDuration={500}
          offsetCenterRatio={2.2}
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
              {t('hotspots.owned.title')}
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
        {selectedHotspot ? (
          <BackButton
            paddingHorizontal="none"
            paddingVertical="s"
            onPress={handleBack}
          />
        ) : (
          <Text variant="h3">{t('hotspots.owned.title')}</Text>
        )}

        <Box flexDirection="row" justifyContent="space-between">
          {/* <TouchableOpacityBox
            onPress={handleToggleSettings}
            padding="s"
            marginRight="s"
          >
            <Settings width={22} height={22} color="white" />
          </TouchableOpacityBox> */}
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
        <HotspotsList onSelectHotspot={handlePresentDetails} />
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
    </Box>
  )
}

export default memo(HotspotsView)
