import React, { useRef, useState, useEffect, useMemo } from 'react'
import MapboxGL, {
  OnPressEvent,
  RegionPayload,
} from '@react-native-mapbox-gl/maps'
import { useSelector } from 'react-redux'
import { Feature, GeoJsonProperties, Point, Position } from 'geojson'
import { Hotspot } from '@helium/http'
import Box from './Box'
import CurrentLocationButton from './CurrentLocationButton'
import { RootState } from '../store/rootReducer'
import { useAppDispatch } from '../store/store'
import { getLocation } from '../store/user/appSlice'
import { hotspotsToFeatures } from '../utils/mapUtils'

const styleURL = 'mapbox://styles/petermain/ckjtsfkfj0nay19o3f9jhft6v'

type Props = {
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
  maxZoomLevel = 16,
  minZoomLevel = 0,
  interactive = true,
  onFeatureSelected = () => {},
}: Props) => {
  const map = useRef<MapboxGL.MapView>(null)
  const camera = useRef<MapboxGL.Camera>(null)
  const [loaded, setLoaded] = useState(false)
  const {
    app: { currentLocation, isLoadingLocation },
  } = useSelector((state: RootState) => state)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (currentLocationEnabled && !currentLocation && !isLoadingLocation) {
      dispatch(getLocation())
    }
  }, [dispatch, currentLocation, isLoadingLocation, currentLocationEnabled])

  const onRegionDidChange = async () => {
    if (onMapMoved) {
      const center = await map.current?.getCenter()
      onMapMoved(center)
    }
  }

  const centerUserLocation = () => {
    camera.current?.setCamera({
      centerCoordinate: currentLocation
        ? [currentLocation.longitude, currentLocation.latitude]
        : [-98.35, 15],
      zoomLevel: currentLocation ? 16 : 2,
      animationDuration: 500,
      heading: 0,
    })
  }

  const onDidFinishLoad = () => {
    setLoaded(true)
  }

  const flyTo = (lat?: number, lng?: number, duration?: number) => {
    if (!lat || !lng) return
    camera.current?.flyTo(
      [lng, lat - centerOffset],
      duration || animationDuration,
    )
  }

  const onShapeSourcePress = (event: OnPressEvent) => {
    const { properties } = event.features[0]
    if (properties) {
      flyTo(properties.lat, properties.lng)
      onFeatureSelected(properties)
    }
  }

  const [centerOffset, setCenterOffset] = useState(0)
  useEffect(() => {
    if (loaded && currentLocation) {
      onDidFinishLoadingMap?.(
        currentLocation.latitude,
        currentLocation.longitude,
      )
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
  }, [currentLocation, loaded, offsetCenterRatio])

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
  }

  return (
    <Box>
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
