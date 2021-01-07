import React, { useRef, useState, useEffect } from 'react'
import MapboxGL, {
  OnPressEvent,
  RegionPayload,
} from '@react-native-mapbox-gl/maps'
import { useSelector } from 'react-redux'
import { Feature, Point, Position } from 'geojson'
import Box from './Box'
import CurrentLocationButton from './CurrentLocationButton'
import { RootState } from '../store/rootReducer'
import { useAppDispatch } from '../store/store'
import { getLocation } from '../store/user/appSlice'

const styleURL = 'mapbox://styles/petermain/cjsdsbmjb1h7c1grzv4clr7y7'

type Props = {
  onMapMoved?: (coords?: Position) => void
  onDidFinishLoadingMap?: (latitude: number, longitude: number) => void
  onMapMoving?: (feature: Feature<Point, RegionPayload>) => void
  currentLocationEnabled?: boolean
  zoomLevel?: number
  mapCenter?: number[]
  ownedHotspots?: Feature[]
  animationMode?: 'flyTo' | 'easeTo' | 'moveTo'
  animationDuration?: number
  offsetMapCenter?: boolean
  maxZoomLevel?: number
  minZoomLevel?: number
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
  ownedHotspots,
  offsetMapCenter,
  maxZoomLevel = 16,
  minZoomLevel = 0,
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

  const flyTo = (lat?: number, lng?: number) => {
    if (!lat || !lng) return
    camera.current?.flyTo([lng, lat - centerOffset], animationDuration)
  }

  const onShapeSourcePress = (event: OnPressEvent) => {
    const { properties } = event.features[0]
    flyTo(properties?.lat, properties?.lng)
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
        setCenterOffset((topLat - centerLat) / 1.5)
      }
    }
    if (offsetMapCenter) {
      setTimeout(calculateOffset, animationDuration)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocation, loaded, offsetMapCenter])

  const mapImages = {
    markerOwned: require('../assets/images/owned-hotspot-marker.png'),
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
        {ownedHotspots && (
          <MapboxGL.ShapeSource
            id="ownedHotspots"
            shape={{ type: 'FeatureCollection', features: ownedHotspots }}
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
        )}
      </MapboxGL.MapView>
      {currentLocationEnabled && (
        <CurrentLocationButton onPress={centerUserLocation} />
      )}
    </Box>
  )
}

export default Map
