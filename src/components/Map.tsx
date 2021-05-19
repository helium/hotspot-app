import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import MapboxGL, {
  FillLayerStyle,
  LineLayerStyle,
  RegionPayload,
  SymbolLayerStyle,
} from '@react-native-mapbox-gl/maps'
import { Feature, GeoJsonProperties, Point, Position } from 'geojson'
import { Hotspot } from '@helium/http'
import { BoxProps } from '@shopify/restyle'
import { StyleProp, ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
import { h3ToGeo, h3ToParent } from 'h3-js'
import Box from './Box'
import Text from './Text'
import NoLocation from '../assets/images/no-location.svg'
import { findBounds } from '../utils/mapUtils'
import CurrentLocationButton from './CurrentLocationButton'
import { theme, Theme } from '../theme/theme'
import { useColors } from '../theme/themeHooks'
import H3Grid from './H3Grid'
import NetworkCoverage, { HexProperties } from './NetworkCoverage'
import HotspotsCoverage from './HotspotsCoverage'

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
  selectedHotspot?: Hotspot
  witnesses?: Hotspot[]
  animationMode?: 'flyTo' | 'easeTo' | 'moveTo'
  animationDuration?: number
  maxZoomLevel?: number
  minZoomLevel?: number
  interactive?: boolean
  showUserLocation?: boolean
  showNoLocation?: boolean
  showNearbyHotspots?: boolean
  showH3Grid?: boolean
}
const Map = ({
  onMapMoved,
  onDidFinishLoadingMap,
  onMapMoving,
  currentLocationEnabled,
  zoomLevel,
  mapCenter,
  animationMode = 'moveTo',
  animationDuration = 500,
  ownedHotspots = [],
  selectedHotspot,
  witnesses = [],
  showUserLocation,
  maxZoomLevel = 16,
  minZoomLevel = 0,
  interactive = true,
  onFeatureSelected = () => {},
  showNoLocation,
  showNearbyHotspots = false,
  showH3Grid = false,
  ...props
}: Props) => {
  const colors = useColors()
  const { t } = useTranslation()
  const map = useRef<MapboxGL.MapView>(null)
  const camera = useRef<MapboxGL.Camera>(null)
  const [loaded, setLoaded] = useState(false)
  const [userCoords, setUserCoords] = useState({ latitude: 0, longitude: 0 })
  const [selectedHex, setSelectedHex] = useState<string>()
  const [mapBounds, setMapBounds] = useState<Position[]>()
  const styles = useMemo(() => makeStyles(colors), [colors])

  const onRegionDidChange = useCallback(async () => {
    if (onMapMoved) {
      const center = await map.current?.getCenter()
      onMapMoved(center)
    }
    const currentBounds = await map.current?.getVisibleBounds()
    setMapBounds(currentBounds)
  }, [onMapMoved])

  const centerUserLocation = useCallback(() => {
    camera.current?.setCamera({
      centerCoordinate: userCoords
        ? [userCoords.longitude, userCoords.latitude]
        : [-98.35, 15],
      zoomLevel: userCoords ? 16 : 2,
      animationDuration,
      heading: 0,
    })
  }, [animationDuration, userCoords])

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

    const loadMapBounds = async () => {
      const currentBounds = await map.current?.getVisibleBounds()
      setMapBounds(currentBounds)
    }
    loadMapBounds()
  }, [])

  const onHexSelected = (properties: HexProperties) => {
    setSelectedHex(properties.id)
    onFeatureSelected(properties) // TODO: update to pass hotspot in hex
  }

  useEffect(() => {
    if (loaded && userCoords) {
      onDidFinishLoadingMap?.(userCoords.latitude, userCoords.longitude)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCoords, loaded])

  const mapImages = useMemo(
    () => ({
      markerLocation: require('../assets/images/locationPurple.png'),
    }),
    [],
  )

  const bounds = useMemo(() => {
    const boundsLocations: number[][] = []

    if (mapCenter && !selectedHotspot && !selectedHex) {
      boundsLocations.push(mapCenter)
    }

    if (selectedHotspot && selectedHotspot.location) {
      const h3Location = h3ToParent(selectedHotspot.location, 8)
      boundsLocations.push(h3ToGeo(h3Location).reverse())
    }

    if (selectedHex && !selectedHotspot) {
      boundsLocations.push(h3ToGeo(selectedHex).reverse())
    }

    witnesses.forEach((w) => {
      if (w.location) {
        const h3Location = h3ToParent(w.location, 8)
        boundsLocations.push(h3ToGeo(h3Location).reverse())
      }
    })

    return findBounds(boundsLocations)
  }, [mapCenter, selectedHex, selectedHotspot, witnesses])

  const defaultCameraSettings = useMemo(
    () => ({
      zoomLevel,
      centerCoordinate: mapCenter,
    }),
    [mapCenter, zoomLevel],
  )

  const selectedHotspots = useMemo(() => {
    if (!selectedHotspot) return []
    return [selectedHotspot]
  }, [selectedHotspot])

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
          maxZoomLevel={maxZoomLevel}
          minZoomLevel={minZoomLevel}
          defaultSettings={defaultCameraSettings}
          bounds={bounds}
          animationMode={animationMode}
          animationDuration={animationDuration}
        />
        <MapboxGL.Images images={mapImages} />
        <NetworkCoverage
          onHexSelected={onHexSelected}
          visible={showNearbyHotspots}
        />
        <H3Grid bounds={mapBounds} visible={showH3Grid} />
        <HotspotsCoverage
          id="owned"
          hotspots={ownedHotspots}
          fill
          opacity={0.4}
        />
        <HotspotsCoverage
          id="witnesses"
          hotspots={witnesses}
          fill
          fillColor={colors.yellow}
        />

        <HotspotsCoverage
          id="selected"
          hotspots={selectedHotspots}
          outline
          outlineColor={colors.white}
          outlineWidth={2}
        />
      </MapboxGL.MapView>
      {currentLocationEnabled && (
        <CurrentLocationButton onPress={centerUserLocation} />
      )}
    </Box>
  )
}

const makeStyles = (colors: typeof theme.colors) => ({
  map: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  } as StyleProp<ViewStyle>,
  markerLocation: {
    iconImage: 'markerLocation',
    iconOffset: [0, -25 / 2],
  } as StyleProp<SymbolLayerStyle>,
  selectedHexagon: {
    lineWidth: 2,
    lineColor: colors.white,
  } as StyleProp<LineLayerStyle>,
  ownedFill: {
    fillOpacity: 0.4,
    fillColor: colors.blueBright,
    fillOutlineColor: '#1C1E3B',
  } as StyleProp<FillLayerStyle>,
  witnessFill: {
    fillOpacity: 0.4,
    fillColor: colors.yellow,
    fillOutlineColor: '#1C1E3B',
  } as StyleProp<FillLayerStyle>,
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

export default memo(Map, (prevProps, nextProps) => {
  const {
    mapCenter: prevMapCenter,
    ownedHotspots: prevOwnedHotspots,
    selectedHotspot: prevSelectedHotspot,
    witnesses: prevWitnesses,
    ...prevRest
  } = prevProps
  const {
    mapCenter,
    ownedHotspots,
    selectedHotspot,
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
  const selectedHotspotEqual =
    prevSelectedHotspot?.address === selectedHotspot?.address
  const witnessHotspotsEqual = hotspotsEqual(
    prevWitnesses || [],
    witnesses || [],
  )
  return (
    primitivesEqual &&
    mapCenterEqual &&
    ownedHotspotsEqual &&
    selectedHotspotEqual &&
    witnessHotspotsEqual
  )
})
