import React, { memo, useCallback, useMemo, useRef, useState } from 'react'
import MapboxGL from '@react-native-mapbox-gl/maps'
import Config from 'react-native-config'
import Box from '../../../../components/Box'
import ImageBox from '../../../../components/ImageBox'
import Text from '../../../../components/Text'

const defaultLngLat = [-122.419418, 37.774929] // San Francisco

type Geocode = {
  shortStreet?: string
  shortState?: string
  shortCountry?: string
  shortCity?: string
  longStreet?: string
  longStat?: string
  longCountry?: string
  longCity?: string
}
type Props = {
  mapCenter?: number[]
  geocode?: Geocode
  locationName?: string
  movable?: boolean
  onMapMoved?: (center?: number[]) => void
}
const HotspotLocationPreview = ({
  mapCenter,
  geocode,
  locationName,
  movable = false,
  onMapMoved = () => {},
}: Props) => {
  const map = useRef<MapboxGL.MapView>(null)
  const [coords, setCoords] = useState(mapCenter)

  const onRegionDidChange = useCallback(async () => {
    if (!movable) return
    const center = (await map.current?.getCenter()) as number[]
    setCoords(center)
    onMapMoved(center)
  }, [movable, onMapMoved])

  const hasLocationName = useMemo(
    () => locationName !== undefined || geocode !== undefined,
    [geocode, locationName],
  )

  const LocationName = useCallback(
    () =>
      hasLocationName ? (
        <Box height="25%" padding="m" backgroundColor="purpleDull">
          <Text
            variant="bold"
            fontSize={15}
            numberOfLines={1}
            maxFontSizeMultiplier={1.2}
          >
            {locationName ||
              `${geocode?.longStreet}, ${geocode?.shortCity}, ${geocode?.shortCountry}`}
          </Text>
        </Box>
      ) : null,
    [
      geocode?.longStreet,
      geocode?.shortCity,
      geocode?.shortCountry,
      hasLocationName,
      locationName,
    ],
  )

  return (
    <Box borderRadius="l" overflow="hidden" height="100%">
      <MapboxGL.MapView
        ref={map}
        style={{ height: hasLocationName ? '75%' : '100%' }}
        styleURL={Config.MAPBOX_STYLE_URL}
        logoEnabled={false}
        rotateEnabled={movable}
        pitchEnabled={movable}
        scrollEnabled={movable}
        zoomEnabled={movable}
        compassEnabled={false}
        onRegionDidChange={onRegionDidChange}
      >
        <MapboxGL.Camera
          defaultSettings={{
            centerCoordinate: mapCenter || defaultLngLat,
            zoomLevel: 17,
          }}
          maxZoomLevel={17}
        />
        <MapboxGL.PointAnnotation
          id="locationMarker"
          coordinate={coords || defaultLngLat}
        >
          <ImageBox
            source={require('../../../../assets/images/locationWhite.png')}
          />
        </MapboxGL.PointAnnotation>
      </MapboxGL.MapView>
      <LocationName />
    </Box>
  )
}

export default memo(HotspotLocationPreview)
