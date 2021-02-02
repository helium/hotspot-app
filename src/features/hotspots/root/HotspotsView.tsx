import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Hotspot } from '@helium/http'
import BottomSheet from '@gorhom/bottom-sheet'
import { Extrapolate, useValue } from 'react-native-reanimated'
import { useNavigation } from '@react-navigation/native'
import { GeoJsonProperties } from 'geojson'
import Text from '../../../components/Text'
import Box from '../../../components/Box'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import Add from '../../../assets/images/add.svg'
import { hp } from '../../../utils/layout'
import Map from '../../../components/Map'
import SheetNavigator from './SheetNavigator'
import { RootState } from '../../../store/rootReducer'
import { fetchHotspotDetails } from '../../../store/hotspotDetails/hotspotDetailsSlice'
import { fetchHotspotsData } from '../../../store/hotspots/hotspotsSlice'
import HotspotsHeader from './HotspotsHeader'
import BSHandle from '../../../components/BSHandle'
import HotspotMapButtons from './HotspotMapButtons'
import useToggle from '../../../utils/useToggle'
import HotspotSettings from '../settings/HotspotSettings'

type Props = {
  ownedHotspots: Hotspot[]
}

const HotspotsView = ({ ownedHotspots }: Props) => {
  const navigation = useNavigation()
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [showWitnesses, toggleShowWitnesses] = useToggle(false)

  const {
    hotspotDetails: { hotspot: selectedHotspot, witnesses },
  } = useSelector((state: RootState) => state)

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(fetchHotspotsData())
    })

    return unsubscribe
  }, [navigation, dispatch])

  const animatedIndex = useValue(1)
  const animatedValue = useValue(1)

  // TODO when we upgrade to bottom-sheet v3
  // we can use reanimated v2 to animate this value
  useEffect(() => {
    if (selectedHotspot) {
      animatedValue.setValue(0)
    }
  }, [selectedHotspot, animatedValue])

  const headerStyles = useMemo(() => {
    let animatedNode = animatedIndex
    if (selectedHotspot) {
      animatedNode = animatedValue
    }

    return [
      {
        opacity: animatedNode.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: Extrapolate.CLAMP,
        }),
        transform: [
          {
            translateY: animatedNode.interpolate({
              inputRange: [0, 1],
              outputRange: [480, 0],
              extrapolate: Extrapolate.CLAMP,
            }),
          },
        ],
      },
    ]
  }, [animatedIndex, animatedValue, selectedHotspot])

  const mapButtonStyles = useMemo(() => {
    return [
      {
        position: 'absolute',
        bottom: 200,
      },
      {
        opacity: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0],
          extrapolate: Extrapolate.CLAMP,
        }),
        transform: [
          {
            translateY: animatedIndex.interpolate({
              inputRange: [0, 1],
              outputRange: [140, 0],
              extrapolate: Extrapolate.CLAMP,
            }),
          },
        ],
      },
    ]
  }, [animatedIndex, animatedValue])

  const onMapHotspotSelected = (properties: GeoJsonProperties) => {
    const hotspot = {
      ...properties,
    } as Hotspot
    dispatch(fetchHotspotDetails(hotspot.address))
    navigation.navigate('HotspotDetails', { hotspot })
  }

  const snapPoints = useMemo(() => {
    return selectedHotspot ? [0.1, 140, '80%'] : [0.1, '38%', '80%']
  }, [selectedHotspot])

  return (
    <Box flex={1} flexDirection="column" justifyContent="space-between">
      <Box
        position="absolute"
        height="100%"
        width="100%"
        borderTopLeftRadius="xl"
        borderTopRightRadius="xl"
        style={{ marginTop: 70 }}
        overflow="hidden"
      >
        <Map
          ownedHotspots={ownedHotspots}
          selectedHotspots={selectedHotspot ? [selectedHotspot] : undefined}
          zoomLevel={14}
          // TODO could we bring this intelligence into the Map?
          // if no hotspots are selected and has location permissions
          // use user's position etc
          mapCenter={
            selectedHotspot
              ? [selectedHotspot.lng || 0, selectedHotspot.lat || 0]
              : [ownedHotspots[0].lng || 0, ownedHotspots[0].lat || 0]
          }
          witnesses={showWitnesses ? witnesses : []}
          animationMode="flyTo"
          offsetCenterRatio={2.2}
          onFeatureSelected={onMapHotspotSelected}
        />
      </Box>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        backgroundColor="primaryBackground"
        padding="m"
      >
        <Text variant="h3">{t('hotspots.owned.title')}</Text>

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

      <HotspotsHeader style={headerStyles} marginBottom={hp(38)} />

      <HotspotMapButtons
        style={mapButtonStyles}
        showWitnesses={showWitnesses}
        toggleShowWitnesses={toggleShowWitnesses}
      />

      <HotspotSettings />

      <BottomSheet
        snapPoints={snapPoints}
        index={1}
        animatedIndex={animatedIndex}
        handleComponent={BSHandle}
      >
        <SheetNavigator />
      </BottomSheet>
    </Box>
  )
}

export default HotspotsView
