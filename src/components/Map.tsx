import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import MapboxGL, {
  OnPressEvent,
  RegionPayload,
} from '@react-native-mapbox-gl/maps'
import { Feature, GeoJsonProperties, Point, Position } from 'geojson'
import { Hotspot } from '@helium/http'
import { BoxProps } from '@shopify/restyle'
import Box from './Box'
import { hotspotsToFeatures } from '../utils/mapUtils'
import CurrentLocationButton from './CurrentLocationButton'
import { Theme } from '../theme/theme'

const styleURL = 'mapbox://styles/petermain/ckjtsfkfj0nay19o3f9jhft6v'

type Props = BoxProps<Theme> & {
  onMapMoved?: (coords?: Position) => void
  onDidFinishLoadingMap?: (latitude: number, longitude: number) => void
  onMapMoving?: (feature: Feature<Point, RegionPayload>) => void
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
  onFeatureSelected?: (properties: GeoJsonProperties) => void
  showUserLocation?: boolean
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
  ...props
}: Props) => {
  const map = useRef<MapboxGL.MapView>(null)
  const camera = useRef<MapboxGL.Camera>(null)
  const [loaded, setLoaded] = useState(false)
  const [userCoords, setUserCoords] = useState({ latitude: 0, longitude: 0 })
  const [centerOffset, setCenterOffset] = useState(0)

  const onRegionDidChange = async () => {
    if (onMapMoved) {
      const center = await map.current?.getCenter()
      onMapMoved(center)
    }
  }

  const centerUserLocation = () => {
    camera.current?.setCamera({
      centerCoordinate: userCoords
        ? [userCoords.longitude, userCoords.latitude]
        : [-98.35, 15],
      zoomLevel: userCoords ? 16 : 2,
      animationDuration: 500,
      heading: 0,
    })
  }
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

  const onDidFinishLoad = () => {
    setLoaded(true)
  }

  const onShapeSourcePress = (event: OnPressEvent) => {
    const { properties } = event.features[0]
    if (properties) {
      flyTo(properties.lat, properties.lng)
      onFeatureSelected(properties)
    }
  }

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

  const mapImages = {
    markerOwned: require('../assets/images/owned-hotspot-marker.png'),
    markerSelected: require('../assets/images/selected-hotspot-marker.png'),
    markerWitness: require('../assets/images/witness-marker.png'),
    markerLocation: require('../assets/images/locationPurple.png'),
  }

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Box {...props}>
      <MapboxGL.MapView
        ref={map}
        onRegionDidChange={onRegionDidChange}
        onRegionWillChange={onMapMoving}
        onDidFinishLoadingMap={onDidFinishLoad}
        styleURL={styleURL}
        style={{ width: '100%', height: '100%', borderRadius: 40 }}
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
              style={{
                iconImage: 'markerLocation',
                iconOffset: [0, -25 / 2],
              }}
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
          id="ownedHotspots"
          shape={{ type: 'FeatureCollection', features: ownedHotspotFeatures }}
          onPress={onShapeSourcePress}
        >
          <MapboxGL.SymbolLayer
            id="markerOwned"
            style={{
              iconImage: 'markerOwned',
              iconAllowOverlap: true,
              iconSize: 1,
            }}
          />
        </MapboxGL.ShapeSource>
        <MapboxGL.ShapeSource
          id="witnesses"
          shape={{ type: 'FeatureCollection', features: witnessFeatures }}
          onPress={onShapeSourcePress}
        >
          <MapboxGL.SymbolLayer
            id="markerWitness"
            style={{
              iconImage: 'markerWitness',
              iconAllowOverlap: true,
              iconSize: 1,
            }}
          />
        </MapboxGL.ShapeSource>
        <MapboxGL.ShapeSource
          id="selectedHotspots"
          shape={{
            type: 'FeatureCollection',
            features: selectedHotspotFeatures,
          }}
          onPress={onShapeSourcePress}
        >
          <MapboxGL.SymbolLayer
            id="markerSelected"
            style={{
              iconImage: 'markerSelected',
              iconAllowOverlap: true,
              iconSize: 1,
            }}
          />
        </MapboxGL.ShapeSource>
      </MapboxGL.MapView>
      {currentLocationEnabled && (
        <CurrentLocationButton onPress={centerUserLocation} />
      )}
    </Box>
  )
}

export default Map
