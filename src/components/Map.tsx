import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useSelector } from 'react-redux'
import { useAsync } from 'react-async-hook'
import MapboxGL, {
  CircleLayerStyle,
  OnPressEvent,
  RegionPayload,
  SymbolLayerStyle,
} from '@react-native-mapbox-gl/maps'
import { Feature, GeoJsonProperties, Point, Position } from 'geojson'
import { Hotspot } from '@helium/http'
import { BoxProps } from '@shopify/restyle'
import { StyleProp, ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
import Box from './Box'
import Text from './Text'
import NoLocation from '../assets/images/no-location.svg'
import { hotspotsToFeatures } from '../utils/mapUtils'
import CurrentLocationButton from './CurrentLocationButton'
import { Theme } from '../theme/theme'
import { useColors } from '../theme/themeHooks'
import { useAppDispatch } from '../store/store'
import { RootState } from '../store/rootReducer'
import { fetchNetworkHotspots } from '../store/networkHotspots/networkHotspotsSlice'

const styleURL = 'mapbox://styles/petermain/ckjtsfkfj0nay19o3f9jhft6v'

type Props = BoxProps<Theme> & {
  onMapMoved?: (coords?: Position) => void
  onDidFinishLoadingMap?: (latitude: number, longitude: number) => void
  onMapMoving?: (feature: Feature<Point, RegionPayload>) => void
  onFeatureSelected?: (properties: GeoJsonProperties) => void

  currentLocationEnabled?: boolean
  zoomLevel?: number
  mapCenter?: number[]
  ownedHotspots?: Hotspot[]
  selectedHotspots?: Hotspot[]
  witnesses?: Hotspot[]
  animationMode?: 'flyTo' | 'easeTo' | 'moveTo'
  animationDuration?: number
  offsetCenterRatio?: number
  maxZoomLevel?: number
  minZoomLevel?: number
  interactive?: boolean
  showUserLocation?: boolean
  showNoLocation?: boolean
}
const Map = ({
  onMapMoved,
  onDidFinishLoadingMap,
  onMapMoving,
  currentLocationEnabled,
  zoomLevel,
  mapCenter = [0, 0],
  animationMode = 'moveTo',
  animationDuration = 500,
  ownedHotspots = [],
  selectedHotspots = [],
  witnesses = [],
  offsetCenterRatio,
  showUserLocation,
  maxZoomLevel = 16,
  minZoomLevel = 0,
  interactive = true,
  onFeatureSelected = () => {},
  showNoLocation,
  ...props
}: Props) => {
  const dispatch = useAppDispatch()
  const colors = useColors()
  const { t } = useTranslation()
  const map = useRef<MapboxGL.MapView>(null)
  const camera = useRef<MapboxGL.Camera>(null)
  const [loaded, setLoaded] = useState(false)
  const [userCoords, setUserCoords] = useState({ latitude: 0, longitude: 0 })
  const [centerOffset, setCenterOffset] = useState(0)
  const styles = useMemo(() => makeStyles(colors), [colors])

  const {
    networkHotspots: { networkHotspots },
  } = useSelector((state: RootState) => state)

  useAsync(async () => {
    if (loaded) {
      const center = await map.current?.getCenter()
      if (center) {
        dispatch(
          fetchNetworkHotspots({ lat: center[1], lng: center[0], dist: 5000 }),
        )
      }
    }
  }, [loaded, dispatch])

  const onRegionDidChange = useCallback(async () => {
    if (onMapMoved) {
      const center = await map.current?.getCenter()
      onMapMoved(center)
      if (center) {
        dispatch(
          fetchNetworkHotspots({ lat: center[1], lng: center[0], dist: 5000 }),
        )
      }
    }
  }, [dispatch, onMapMoved])

  const centerUserLocation = useCallback(() => {
    camera.current?.setCamera({
      centerCoordinate: userCoords
        ? [userCoords.longitude, userCoords.latitude]
        : [-98.35, 15],
      zoomLevel: userCoords ? 16 : 2,
      animationDuration: 500,
      heading: 0,
    })
  }, [userCoords])

  const flyTo = useCallback(
    async (lat?: number, lng?: number, duration?: number) => {
      if (!lat || !lng) return

      camera.current?.flyTo(
        [lng, lat - centerOffset],
        duration || animationDuration,
      )
    },
    [animationDuration, centerOffset],
  )

  const handleUserLocationUpdate = useCallback(
    (loc) => {
      if (!loc?.coords || (userCoords.latitude && userCoords.longitude)) {
        return
      }

      setUserCoords(loc.coords)
    },
    [userCoords],
  )

  useEffect(() => {
    if (!showUserLocation || !userCoords.latitude || !userCoords.longitude)
      return

    camera.current?.setCamera({
      centerCoordinate: [userCoords.longitude, userCoords.latitude],
      zoomLevel,
    })
  }, [showUserLocation, userCoords, zoomLevel])

  const onDidFinishLoad = useCallback(() => {
    setLoaded(true)
  }, [])

  const onShapeSourcePress = useCallback(
    (event: OnPressEvent) => {
      const { properties } = event.features[0]
      if (properties) {
        flyTo(properties.lat, properties.lng)
        onFeatureSelected(properties)
      }
    },
    [flyTo, onFeatureSelected],
  )

  useEffect(() => {
    if (loaded && userCoords) {
      onDidFinishLoadingMap?.(userCoords.latitude, userCoords.longitude)
    }
    const calculateOffset = async () => {
      const bounds = await map?.current?.getVisibleBounds()
      const center = await map?.current?.getCenter()
      if (bounds && center) {
        const topLat = bounds[0][1]
        const centerLat = center[1]
        const scale = offsetCenterRatio || 1
        setCenterOffset((topLat - centerLat) / scale)
      }
    }
    if (offsetCenterRatio) {
      setTimeout(calculateOffset, animationDuration)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCoords, loaded, offsetCenterRatio])

  useEffect(() => {
    const hasWitnesses = witnesses ? witnesses.length > 0 : false
    const selectedHotspot = selectedHotspots && selectedHotspots[0]
    if (selectedHotspot) {
      camera?.current?.setCamera({
        centerCoordinate: [
          selectedHotspot?.lng || 0,
          (selectedHotspot?.lat || 0) - centerOffset,
        ],
        zoomLevel: hasWitnesses ? 11 : zoomLevel || 16,
        animationDuration: 500,
      })
    }
  }, [witnesses, centerOffset, selectedHotspots, zoomLevel])

  const ownedHotspotFeatures = useMemo(
    () => hotspotsToFeatures(ownedHotspots),
    [ownedHotspots],
  )

  const selectedHotspotFeatures = useMemo(
    () => hotspotsToFeatures(selectedHotspots),
    [selectedHotspots],
  )

  const witnessFeatures = useMemo(() => hotspotsToFeatures(witnesses), [
    witnesses,
  ])

  const networkHotspotFeatures = useMemo(
    () => hotspotsToFeatures(networkHotspots),
    [networkHotspots],
  )

  const mapImages = useMemo(
    () => ({
      markerSelected: require('../assets/images/selected-hotspot-marker.png'),
      markerLocation: require('../assets/images/locationPurple.png'),
    }),
    [],
  )

  const shapeSources = useMemo(
    () => ({
      ownedHotspotFeatures: {
        type: 'FeatureCollection',
        features: ownedHotspotFeatures,
      } as GeoJSON.FeatureCollection,
      witnessFeatures: {
        type: 'FeatureCollection',
        features: witnessFeatures,
      } as GeoJSON.FeatureCollection,
      selectedHotspotFeatures: {
        type: 'FeatureCollection',
        features: selectedHotspotFeatures,
      } as GeoJSON.FeatureCollection,
      networkHotspotFeatures: {
        type: 'FeatureCollection',
        features: networkHotspotFeatures,
      } as GeoJSON.FeatureCollection,
    }),
    [
      ownedHotspotFeatures,
      witnessFeatures,
      selectedHotspotFeatures,
      networkHotspotFeatures,
    ],
  )

  console.log('network hotspots', networkHotspotFeatures)

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Box {...props}>
      {showNoLocation && (
        <Box
          position="absolute"
          zIndex={100}
          top={0}
          left={0}
          right={0}
          bottom={250}
          justifyContent="center"
          alignItems="center"
        >
          <NoLocation color={colors.purpleMain} />
          <Text variant="h2" color="white" marginTop="m">
            {t('hotspot_details.no_location_title')}
          </Text>
          <Text variant="body2" color="purpleMuted" marginTop="s">
            {t('hotspot_details.no_location_body')}
          </Text>
        </Box>
      )}
      <MapboxGL.MapView
        ref={map}
        onRegionDidChange={onRegionDidChange}
        onRegionWillChange={onMapMoving}
        onDidFinishLoadingMap={onDidFinishLoad}
        styleURL={styleURL}
        style={styles.map}
        logoEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        scrollEnabled={interactive}
        zoomEnabled={interactive}
        compassEnabled={false}
      >
        {(showUserLocation || currentLocationEnabled) && (
          <MapboxGL.UserLocation onUpdate={handleUserLocationUpdate}>
            <MapboxGL.SymbolLayer
              id="markerLocation"
              style={styles.markerLocation}
            />
          </MapboxGL.UserLocation>
        )}
        <MapboxGL.Camera
          ref={camera}
          zoomLevel={zoomLevel}
          maxZoomLevel={maxZoomLevel}
          minZoomLevel={minZoomLevel}
          animationMode={animationMode}
          animationDuration={animationDuration}
          centerCoordinate={[mapCenter[0], mapCenter[1] - centerOffset]}
        />
        <MapboxGL.Images images={mapImages} />
        <MapboxGL.ShapeSource
          id="networkHotspots"
          shape={shapeSources.networkHotspotFeatures}
          onPress={onShapeSourcePress}
        >
          <MapboxGL.CircleLayer
            id="markerNetwork"
            style={styles.markerNetwork}
          />
        </MapboxGL.ShapeSource>
        <MapboxGL.ShapeSource
          id="ownedHotspots"
          shape={shapeSources.ownedHotspotFeatures}
          onPress={onShapeSourcePress}
        >
          <MapboxGL.CircleLayer id="markerOwned" style={styles.markerOwned} />
        </MapboxGL.ShapeSource>
        <MapboxGL.ShapeSource
          id="witnesses"
          shape={shapeSources.witnessFeatures}
          onPress={onShapeSourcePress}
        >
          <MapboxGL.CircleLayer
            id="markerWitness"
            style={styles.markerWitness}
          />
        </MapboxGL.ShapeSource>
        <MapboxGL.ShapeSource
          id="selectedHotspots"
          shape={shapeSources.selectedHotspotFeatures}
          onPress={onShapeSourcePress}
        >
          <MapboxGL.SymbolLayer
            id="markerSelected"
            style={styles.markerSelected}
          />
        </MapboxGL.ShapeSource>
      </MapboxGL.MapView>
      {currentLocationEnabled && (
        <CurrentLocationButton onPress={centerUserLocation} />
      )}
    </Box>
  )
}

const makeStyles = (colors) => ({
  map: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  } as StyleProp<ViewStyle>,
  markerLocation: {
    iconImage: 'markerLocation',
    iconOffset: [0, -25 / 2],
  } as StyleProp<SymbolLayerStyle>,
  markerWitness: {
    circleColor: colors.gold,
    circleRadius: 6,
  } as StyleProp<CircleLayerStyle>,
  markerOwned: {
    circleColor: colors.purpleMain,
    circleRadius: 6,
  } as StyleProp<CircleLayerStyle>,
  markerSelected: {
    iconImage: 'markerSelected',
    iconAllowOverlap: true,
    iconSize: 1,
  } as StyleProp<SymbolLayerStyle>,
  markerNetwork: {
    circleColor: colors.purpleMuted,
    circleRadius: 6,
  } as StyleProp<CircleLayerStyle>,
})

const hotspotsEqual = (prev: Hotspot[], next: Hotspot[]) => {
  if (prev.length !== next.length) return false

  const ownedHotspotsEqual = next === prev
  if (!ownedHotspotsEqual) {
    next.forEach((hotspot, index) => {
      const addressesEqual = hotspot.address === prev[index].address
      if (!addressesEqual) return false
    })
  }
  return true
}

// export default Map
export default memo(Map, (prevProps, nextProps) => {
  const {
    mapCenter: prevMapCenter,
    ownedHotspots: prevOwnedHotspots,
    selectedHotspots: prevSelectedHotspots,
    witnesses: prevWitnesses,
    ...prevRest
  } = prevProps
  const {
    mapCenter,
    ownedHotspots,
    selectedHotspots,
    witnesses,
    ...nextRest
  } = nextProps

  const primitivesEqual = Object.keys(prevRest).every(
    (key) => nextRest.hasOwnProperty(key) && nextRest[key] === prevRest[key],
  )
  let mapCenterEqual = mapCenter === prevMapCenter
  if (!mapCenterEqual && mapCenter && prevMapCenter) {
    mapCenterEqual =
      mapCenter[0] === prevMapCenter[0] && mapCenter[1] === prevMapCenter[1]
  }

  const ownedHotspotsEqual = hotspotsEqual(
    prevOwnedHotspots || [],
    ownedHotspots || [],
  )
  const selectedHotspotsEqual = hotspotsEqual(
    prevSelectedHotspots || [],
    selectedHotspots || [],
  )
  const witnessHotspotsEqual = hotspotsEqual(
    prevWitnesses || [],
    witnesses || [],
  )
  return (
    primitivesEqual &&
    mapCenterEqual &&
    ownedHotspotsEqual &&
    selectedHotspotsEqual &&
    witnessHotspotsEqual
  )
})
