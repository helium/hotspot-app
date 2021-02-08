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

const HotspotsView = ({ ownedHotspots }: Props) => {
  const navigation = useNavigation()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const listRef = useRef<BottomSheetModal>(null)
  const detailsRef = useRef<BottomSheetModal>(null)
  const colors = useColors()
  const listSnapPoints = useMemo(() => [hp(68)], [])

  useEffect(() => {
    listRef.current?.present()
  }, [])

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

  // const animatedIndex = useValue(1)
  // const animatedValue = useValue(1)
  const animatedPosition = useValue(0)

  // TODO when we upgrade to bottom-sheet v3
  // we can use reanimated v2 to animate this value
  // useEffect(() => {
  //   if (selectedHotspot) {
  //     animatedValue.setValue(0)
  //   }
  // }, [selectedHotspot, animatedValue])

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
    listRef.current?.present()
  }, [dispatch])

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
      // opacity: 0,
      opacity: animatedPosition.interpolate({
        inputRange: [0, listSnapPoints[0]],
        outputRange: [0, 1],
        extrapolate: Extrapolate.CLAMP,
      }),
    }
  }, [animatedPosition, colors, listSnapPoints])

  const backdropTitleStyles = useMemo(() => {
    return {
      transform: [
        {
          translateY: animatedPosition.interpolate({
            inputRange: [0, listSnapPoints[0]],
            outputRange: [-100, 0],
            extrapolate: Extrapolate.CLAMP,
          }),
        },
      ],
    }
  }, [animatedPosition, listSnapPoints])

  // const mapButtonStyles = useMemo(() => {
  //   return [
  //     {
  //       position: 'absolute',
  //       bottom: 200,
  //     },
  //     {
  //       opacity: animatedValue.interpolate({
  //         inputRange: [0, 1],
  //         outputRange: [1, 0],
  //         extrapolate: Extrapolate.CLAMP,
  //       }),
  //       transform: [
  //         {
  //           translateY: animatedIndex.interpolate({
  //             inputRange: [0, 1],
  //             outputRange: [140, 0],
  //             extrapolate: Extrapolate.CLAMP,
  //           }),
  //         },
  //       ],
  //     },
  //   ]
  // }, [animatedIndex, animatedValue])

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
          <Text variant="h3">{t('hotspots.owned.title')}</Text>
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

      <HotspotMapButtons
        // style={mapButtonStyles}
        showWitnesses={showWitnesses}
        toggleShowWitnesses={toggleShowWitnesses}
      />

      <BottomSheetModal
        ref={listRef}
        snapPoints={listSnapPoints}
        index={0}
        // animatedIndex={animatedIndex}
        handleComponent={BSHandle}
        onDismiss={handleDismissList}
        animatedPosition={animatedPosition}
      >
        <HotspotsList
          hotspots={ownedHotspots}
          onSelectHotspot={handlePresentDetails}
        />
      </BottomSheetModal>

      <BottomSheetModal
        ref={detailsRef}
        snapPoints={[180, '75%']}
        index={0}
        handleComponent={HotspotDetailCardHeader}
        onDismiss={handleDismissDetails}
        // dismissOnPanDown={false}
      >
        <HotspotDetails hotspot={selectedHotspot} />
      </BottomSheetModal>
    </Box>
  )
}

export default HotspotsView
