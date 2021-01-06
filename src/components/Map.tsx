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
}
const Map = ({
  onMapMoved,
  onDidFinishLoadingMap,
  onMapMoving,
  currentLocationEnabled,
  zoomLevel,
  mapCenter,
  ownedHotspots,
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

  const flyTo = (lat?: number, lng?: number, duration = 500) => {
    if (!lat || !lng) return
    console.log(lat, lng)
    camera.current?.flyTo([lng, lat], duration)
  }

  const onShapeSourcePress = (event: OnPressEvent) => {
    const { properties } = event.features[0]
    flyTo(properties?.lat, properties?.lng)
  }

  useEffect(() => {
    if (loaded && currentLocation) {
      onDidFinishLoadingMap?.(
        currentLocation.latitude,
        currentLocation.longitude,
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocation, loaded])

  const markerImages = {
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
          maxZoomLevel={16}
          animationMode="moveTo"
          centerCoordinate={mapCenter}
        />
        <MapboxGL.Images images={markerImages} />
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
