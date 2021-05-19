/* eslint-disable react/jsx-props-no-spreading */
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import MapboxGL, {
  CircleLayerStyle,
  LineLayerStyle,
  OnPressEvent,
  SymbolLayerStyle,
  Expression,
} from '@react-native-mapbox-gl/maps'
import { BoxProps } from '@shopify/restyle'
import { Platform, StyleProp } from 'react-native'
import { omit } from 'lodash'
import { Theme } from '../../../../theme/theme'
import Box from '../../../../components/Box'
import { DiscoveryResponse } from '../../../../store/discovery/discoveryTypes'
import { findBounds, hotspotsToFeatures } from '../../../../utils/mapUtils'
import { useColors } from '../../../../theme/themeHooks'
import { NetworkHotspot } from '../../../../store/networkHotspots/networkHotspotsSlice'
import useVisible from '../../../../utils/useVisible'

const styleURL = 'mapbox://styles/petermain/ckjtsfkfj0nay19o3f9jhft6v'

export type MapSelectDetail = {
  lat: number
  lng: number
  name: string
  address: string
}
type Props = BoxProps<Theme> & {
  hotspotAddress: string
  responses: DiscoveryResponse[]
  onSelect: ({ lat, lng, name }: MapSelectDetail) => void
  networkHotspots: Record<string, NetworkHotspot>
  selectedHotspot?: MapSelectDetail
}
const isAndroid = Platform.OS === 'android'

const DiscoveryMap = ({
  hotspotAddress,
  responses,
  onSelect,
  networkHotspots,
  selectedHotspot,
  ...props
}: Props) => {
  const cameraRef = useRef<MapboxGL.Camera>(null)
  const mapRef = useRef<MapboxGL.MapView>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const visible = useVisible({
    onDisappear: () => {
      if (!isAndroid) return

      setMapLoaded(false)
    },
  })
  const { purpleMuted, purpleMain } = useColors()

  const styles = useMemo(() => makeStyles({ purpleMuted, purpleMain }), [
    purpleMuted,
    purpleMain,
  ])

  const shapeSources = useMemo(() => {
    const responseAddresses = responses?.map((r) => r.hotspotAddress) || []
    const nearbyHotspots = omit(networkHotspots, [
      hotspotAddress,
      ...responseAddresses,
    ])

    const sources = {} as Record<
      'nearbyHotspotMarker' | 'responses',
      GeoJSON.FeatureCollection
    >
    sources.nearbyHotspotMarker = {
      type: 'FeatureCollection',
      features: hotspotsToFeatures(Object.values(nearbyHotspots)),
    } as GeoJSON.FeatureCollection

    if (responses) {
      const responseCollection = {
        type: 'FeatureCollection',
        features: responses.map((r) => ({
          type: 'Feature',
          id: r.hotspotAddress,
          properties: { ...r },
          geometry: {
            type: 'Point',
            coordinates: [r.long, r.lat],
          },
        })),
      } as GeoJSON.FeatureCollection
      sources.responses = responseCollection
    }

    return sources
  }, [hotspotAddress, networkHotspots, responses])

  const setupMap = useCallback(async () => {
    setMapLoaded(true)
  }, [])

  useEffect(() => {
    if (!mapLoaded || !visible) return

    if (responses.length === 0) {
      cameraRef.current?.setCamera({ zoomLevel: 1 })
      return
    }

    const coords = responses.map((r) => [r.long, r.lat])
    const bounds = findBounds(coords)
    if (responses.length === 1) {
      cameraRef.current?.setCamera({ zoomLevel: 12, bounds })
    } else {
      cameraRef.current?.setCamera({
        bounds,
      })
    }
  }, [mapLoaded, responses, visible])

  const onShapeSourcePress = useCallback(
    (event: OnPressEvent) => {
      const { properties } = event.features[0]
      if (properties) {
        onSelect({
          name: properties.name,
          lat: properties.lat,
          lng: properties.lng || properties.long,
          address: properties.address || properties.hotspotAddress,
        })
      }
    },
    [onSelect],
  )

  const nearbyCircleFilter = useMemo(
    () => ['==', 'address', selectedHotspot?.address] as Expression,
    [selectedHotspot?.address],
  )
  const responsesCircleFilter = useMemo(
    () => ['==', 'hotspotAddress', selectedHotspot?.address] as Expression,
    [selectedHotspot?.address],
  )

  return (
    <Box {...props}>
      {(visible || !isAndroid) && (
        <MapboxGL.MapView
          ref={mapRef}
          style={styles.map}
          styleURL={styleURL}
          logoEnabled={false}
          compassEnabled={false}
          onDidFinishLoadingMap={setupMap}
        >
          <MapboxGL.Camera ref={cameraRef} maxZoomLevel={12} />

          {shapeSources.nearbyHotspotMarker && (
            <MapboxGL.ShapeSource
              id="nearbyHotspots"
              shape={shapeSources.nearbyHotspotMarker}
              onPress={onShapeSourcePress}
            >
              <MapboxGL.CircleLayer
                id="selectedNearbyLayer"
                style={styles.selectedHotspot}
                filter={nearbyCircleFilter}
              />
              <MapboxGL.CircleLayer
                id="nearbyHotspotMarker"
                aboveLayerID="selectedNearbyLayer"
                style={styles.nearbyHotspotMarker}
              />
            </MapboxGL.ShapeSource>
          )}

          {shapeSources.responses && (
            <MapboxGL.ShapeSource
              id="responses"
              shape={shapeSources.responses}
              onPress={onShapeSourcePress}
            >
              <MapboxGL.CircleLayer
                id="selectedResponseLayer"
                style={styles.selectedHotspot}
                filter={responsesCircleFilter}
              />
              <MapboxGL.CircleLayer
                id="hotspotResponses"
                aboveLayerID="selectedResponseLayer"
                style={styles.responses}
              />
            </MapboxGL.ShapeSource>
          )}
        </MapboxGL.MapView>
      )}
    </Box>
  )
}

export default memo(DiscoveryMap)

const makeStyles = ({
  purpleMuted,
  purpleMain,
}: {
  purpleMuted: string
  purpleMain: string
}) => ({
  map: { height: '100%', width: '100%' },
  hotspotLocation: {
    circleRadius: 9,
    circleStrokeColor: 'white',
    circleStrokeWidth: 3,
    circleColor: purpleMain,
  } as StyleProp<CircleLayerStyle>,
  responses: {
    circleColor: '#F4B81B',
    circleRadius: 6,
  } as StyleProp<SymbolLayerStyle>,
  nearbyHotspotMarker: {
    circleColor: purpleMuted,
    circleRadius: 6,
  } as StyleProp<CircleLayerStyle>,
  selectedHotspot: {
    circleRadius: 9,
    circleStrokeColor: 'white',
    circleStrokeWidth: 2,
  } as StyleProp<CircleLayerStyle>,
  line: {
    lineColor: '#F4B81B',
    lineWidth: 2,
  } as StyleProp<LineLayerStyle>,
})
