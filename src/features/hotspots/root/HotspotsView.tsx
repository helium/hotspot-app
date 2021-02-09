import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Hotspot } from '@helium/http'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { Extrapolate, useValue } from 'react-native-reanimated'
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
import { hp } from '../../../utils/layout'
import HotspotDetailCardHeader from '../details/HotspotDetailCardHeader'
import BackButton from '../../../components/BackButton'

type Props = {
  ownedHotspots: Hotspot[]
}

const DETAIL_COLLAPSED_CARD_HEIGHT = 120

const HotspotsView = ({ ownedHotspots }: Props) => {
  const navigation = useNavigation()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const listRef = useRef<BottomSheetModal>(null)
  const detailsRef = useRef<BottomSheetModal>(null)
  const colors = useColors()
  const listSnapPoints = useMemo(() => [hp(68)], [])
  const detailSnapPoints = useMemo(
    () => [DETAIL_COLLAPSED_CARD_HEIGHT, '75%'],
    [],
  )

  useEffect(() => {
    dispatch(fetchHotspotsData())
    listRef.current?.present()
  }, [dispatch])

  const [showWitnesses, toggleShowWitnesses] = useToggle(false)

  const {
    hotspotDetails: { witnesses },
  } = useSelector((state: RootState) => state)

  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot>()

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(fetchHotspotsData())
    })

    return unsubscribe
  }, [navigation, dispatch])

  const animatedListPosition = useValue(0)
  const animatedDetailsPosition = useValue(0)

  const handlePresentDetails = useCallback((hotspot: Hotspot) => {
    setSelectedHotspot(hotspot)
    detailsRef.current?.present()
  }, [])

  const handleDismissList = useCallback(() => {
    setSelectedHotspot(ownedHotspots[0])
    detailsRef.current?.present()
  }, [ownedHotspots])

  const handleDismissDetails = useCallback(() => {
    setSelectedHotspot(undefined)
    dispatch(hotspotDetailsSlice.actions.clearHotspotDetails())
    detailsRef.current?.dismiss()
    // listRef.current?.present()
  }, [dispatch])

  const handleReset = useCallback(() => {
    listRef.current?.present()
  }, [])

  const onMapHotspotSelected = useCallback((properties: GeoJsonProperties) => {
    const hotspot = {
      ...properties,
    } as Hotspot
    setSelectedHotspot(hotspot)
    detailsRef.current?.present()
  }, [])

  const backdropStyles = useMemo(() => {
    return {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: colors.purpleMain,
      opacity: animatedListPosition.interpolate({
        inputRange: [0, listSnapPoints[0]],
        outputRange: [0, 1],
        extrapolate: Extrapolate.CLAMP,
      }),
    }
  }, [animatedListPosition, colors, listSnapPoints])

  const backdropTitleStyles = useMemo(() => {
    return {
      transform: [
        {
          translateY: animatedListPosition.interpolate({
            inputRange: [0, listSnapPoints[0]],
            outputRange: [-100, 0],
            extrapolate: Extrapolate.CLAMP,
          }),
        },
      ],
    }
  }, [animatedListPosition, listSnapPoints])

  const containerStyles = useMemo(
    () => ({
      marginTop: 70,
    }),
    [],
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
        overflow="hidden"
      >
        <Map
          ownedHotspots={ownedHotspots}
          selectedHotspots={selectedHotspot ? [selectedHotspot] : undefined}
          zoomLevel={14}
          mapCenter={
            selectedHotspot
              ? [selectedHotspot.lng || 0, selectedHotspot.lat || 0]
              : [ownedHotspots[0].lng || 0, ownedHotspots[0].lat || 0]
          }
          witnesses={showWitnesses ? witnesses : []}
          animationMode="moveTo"
          offsetCenterRatio={2.2}
          onFeatureSelected={onMapHotspotSelected}
        />
        <HotspotMapButtons
          animatedPosition={animatedDetailsPosition}
          showWitnesses={showWitnesses}
          toggleShowWitnesses={toggleShowWitnesses}
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
            onPress={handleDismissList}
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
            onPress={handleDismissDetails}
          />
        ) : (
          <TouchableOpacityBox onPress={handleReset}>
            <Text variant="h3">{t('hotspots.owned.title')}</Text>
          </TouchableOpacityBox>
        )}

        <Box flexDirection="row" justifyContent="space-between">
          {/* TODO: Hotspot Search */}
          {/* <TouchableOpacityBox padding="s"> */}
          {/*  <Search width={22} height={22} /> */}
          {/* </TouchableOpacityBox> */}
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
        // dismissOnPanDown={false}
        animatedPosition={animatedListPosition}
      >
        <HotspotsList
          hotspots={ownedHotspots}
          onSelectHotspot={handlePresentDetails}
        />
      </BottomSheetModal>

      <BottomSheetModal
        ref={detailsRef}
        snapPoints={detailSnapPoints}
        index={0}
        handleComponent={HotspotDetailCardHeader}
        // onDismiss={handleDismissDetails}
        // dismissOnPanDown={false}
        animatedPosition={animatedDetailsPosition}
      >
        <HotspotDetails hotspot={selectedHotspot} />
      </BottomSheetModal>
    </Box>
  )
}

export default HotspotsView
