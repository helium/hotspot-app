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
import { Feature, Point, Position } from 'geojson'
import { Hotspot, Witness } from '@helium/http'
import { BoxProps } from '@shopify/restyle'
import {
  PixelRatio,
  Platform,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native'
import { useTranslation } from 'react-i18next'
import { h3ToGeo } from 'h3-js'
import Config from 'react-native-config'
import { isFinite } from 'lodash'
import Box from './Box'
import Text from './Text'
import NoLocation from '../assets/images/no-location.svg'
import { findBounds } from '../utils/mapUtils'
import CurrentLocationButton from './CurrentLocationButton'
import { theme, Theme } from '../theme/theme'
import { useColors } from '../theme/themeHooks'
import Coverage from './Coverage'
import { distance } from '../utils/location'

const defaultLngLat = [-122.419418, 37.774929] // San Francisco

export const NO_FEATURES = 'no_features'

type Props = BoxProps<Theme> & {
  onMapMoved?: (coords?: Position) => void
  onDidFinishLoadingMap?: (latitude: number, longitude: number) => void
  onMapMoving?: (feature: Feature<Point, RegionPayload>) => void
  onHexSelected?: (id: string) => void
  cameraBottomOffset?: number
  currentLocationEnabled?: boolean
  zoomLevel?: number
  mapCenter?: number[]
  ownedHotspots?: Hotspot[]
  followedHotspots?: Hotspot[]
  selectedHotspot?: Hotspot | Witness
  selectedHex?: string
  witnesses?: Witness[]
  animationMode?: 'flyTo' | 'easeTo' | 'moveTo'
  animationDuration?: number
  maxZoomLevel?: number
  minZoomLevel?: number
  interactive?: boolean
  showUserLocation?: boolean
  showNoLocation?: boolean
  showNearbyHotspots?: boolean
  showH3Grid?: boolean
  showRewardScale?: boolean
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
  onHexSelected = () => {},
  showNoLocation,
  showNearbyHotspots = false,
  showH3Grid = false,
  followedHotspots,
  showRewardScale,
  cameraBottomOffset,
  selectedHex,
  ...props
}: Props) => {
  const colors = useColors()
  const { t } = useTranslation()
  const map = useRef<MapboxGL.MapView>(null)
  const camera = useRef<MapboxGL.Camera>(null)
  const [loaded, setLoaded] = useState(false)
  const [userCoords, setUserCoords] = useState({ latitude: 0, longitude: 0 })
  const [mapBounds, setMapBounds] = useState<Position[]>()
  const [mapZoomLevel, setMapZoomLevel] = useState<number>()
  const styles = useMemo(() => makeStyles(colors), [colors])

  const onRegionDidChange = useCallback(async () => {
    if (onMapMoved) {
      const center = await map.current?.getCenter()
      onMapMoved(center)
    }
    const currentBounds = await map.current?.getVisibleBounds()
    setMapBounds(currentBounds)

    const currentZoomLevel = await map.current?.getZoom()
    setMapZoomLevel(currentZoomLevel)
  }, [onMapMoved])

  const centerUserLocation = useCallback(() => {
    const hasCoords =
      userCoords &&
      isFinite(userCoords.longitude) &&
      isFinite(userCoords.latitude)
    camera.current?.setCamera({
      centerCoordinate: hasCoords
        ? [userCoords.longitude, userCoords.latitude]
        : defaultLngLat,
      zoomLevel: hasCoords ? 16 : 2,
      animationDuration,
      heading: 0,
    })
  }, [animationDuration, userCoords])

  const handleUserLocationUpdate = useCallback(
    (loc: MapboxGL.Location) => {
      if (!loc?.coords || (userCoords.latitude && userCoords.longitude)) {
        return
      }

      setUserCoords(loc.coords)
    },
    [userCoords],
  )

  useEffect(() => {
    if (
      !showUserLocation ||
      !isFinite(userCoords.latitude) ||
      !isFinite(userCoords.longitude)
    )
      return

    camera.current?.setCamera({
      centerCoordinate: [userCoords.longitude, userCoords.latitude],
      zoomLevel,
    })
  }, [showUserLocation, userCoords, zoomLevel])

  const onDidFinishLoad = useCallback(() => {
    setLoaded(true)

    const loadMapBoundsAndZoom = async () => {
      const currentBounds = await map.current?.getVisibleBounds()
      setMapBounds(currentBounds)

      const currentZoomLevel = await map.current?.getZoom()
      setMapZoomLevel(currentZoomLevel)
    }
    loadMapBoundsAndZoom()
  }, [])

  const selectedHexId = useMemo(
    () => selectedHex || selectedHotspot?.locationHex,
    [selectedHex, selectedHotspot?.locationHex],
  )

  const onHexPress = useCallback(
    (id: string) => {
      onHexSelected(id)
    },
    [onHexSelected],
  )

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
    if (selectedHexId === NO_FEATURES) return
    const boundsLocations: number[][] = []
    let hotspotCoords: number[] | undefined

    if (mapCenter && !selectedHotspot && !selectedHexId) {
      boundsLocations.push(mapCenter)
    }

    if (selectedHotspot && selectedHotspot.locationHex) {
      const h3Location = selectedHotspot.locationHex
      hotspotCoords = h3ToGeo(h3Location).reverse()
      boundsLocations.push(hotspotCoords)
    }

    if (selectedHexId && !selectedHotspot) {
      boundsLocations.push(h3ToGeo(selectedHexId).reverse())
    }

    if (hotspotCoords) {
      const hotspotLatLng = {
        latitude: hotspotCoords[1],
        longitude: hotspotCoords[0],
      }
      witnesses.forEach((w) => {
        if (w.locationHex) {
          const h3Location = w.locationHex
          const coords = h3ToGeo(h3Location).reverse()
          const distanceKM = distance(
            { latitude: coords[1], longitude: coords[0] },
            hotspotLatLng,
          )
          if (distanceKM < 200) {
            boundsLocations.push(coords)
          }
        }
      })
    }

    return findBounds(boundsLocations, cameraBottomOffset)
  }, [mapCenter, cameraBottomOffset, selectedHexId, selectedHotspot, witnesses])

  const defaultCameraSettings = useMemo(() => {
    const centerCoordinate =
      mapCenter?.length === 2 &&
      isFinite(mapCenter[0]) &&
      isFinite(mapCenter[1])
        ? mapCenter
        : defaultLngLat
    return {
      zoomLevel,
      centerCoordinate,
    }
  }, [mapCenter, zoomLevel])

  const onPressMap = useCallback(
    async (event) => {
      if (selectedHexId !== NO_FEATURES) {
        onHexPress('')
      }
      const { locationX, locationY } = event.nativeEvent
      let locX = locationX
      let locY = locationY

      if (Platform.OS === 'android') {
        locX = locationX * PixelRatio.get()
        locY = locationY * PixelRatio.get()
      }

      if (!map.current) return
      const stuff = await map.current.queryRenderedFeaturesAtPoint(
        [locX, locY],
        undefined,
        ['hexagonFill'],
      )

      if (!stuff?.features[0]?.properties?.id) {
        onHexPress(NO_FEATURES)
      } else {
        onHexPress(stuff.features[0].properties.id)
      }
    },
    [onHexPress, selectedHexId],
  )

  return (
    <Pressable onPress={onPressMap}>
      <Box
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      >
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
          styleURL={Config.MAPBOX_STYLE_URL}
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
          {showNearbyHotspots && (
            <Coverage
              showGrid={showH3Grid}
              bounds={mapBounds}
              mapZoom={mapZoomLevel}
              selectedHexId={selectedHexId === NO_FEATURES ? '' : selectedHexId}
              witnesses={witnesses}
              ownedHotspots={ownedHotspots}
              followedHotspots={followedHotspots}
              showRewardScale={showRewardScale}
            />
          )}
        </MapboxGL.MapView>
        {currentLocationEnabled && (
          <CurrentLocationButton onPress={centerUserLocation} />
        )}
      </Box>
    </Pressable>
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

const hotspotsEqual = (
  prev: Hotspot[] | Witness[],
  next: Hotspot[] | Witness[],
) => {
  if (prev.length !== next.length) return false

  const ownedHotspotsEqual = next === prev
  if (!ownedHotspotsEqual) {
    next.forEach((hotspot: Hotspot | Witness, index: number) => {
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

  const primitivesEqual = Object.keys(prevRest).every((key) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return nextRest.hasOwnProperty(key) && nextRest[key] === prevRest[key]
  })
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
