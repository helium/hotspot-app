/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { Animated, Easing, StyleProp } from 'react-native'
import { omit } from 'lodash'
import { Theme } from '../../../../theme/theme'
import Box from '../../../../components/Box'
import { DiscoveryResponse } from '../../../../store/discovery/discoveryTypes'
import { hotspotsToFeatures } from '../../../../utils/mapUtils'
import { useColors } from '../../../../theme/themeHooks'
import { NetworkHotspot } from '../../../../store/networkHotspots/networkHotspotsSlice'
import usePrevious from '../../../../utils/usePrevious'

const styleURL = 'mapbox://styles/petermain/ckjtsfkfj0nay19o3f9jhft6v'

export type MapSelectDetail = {
  lat: number
  lng: number
  name: string
  address: string
}
type Props = BoxProps<Theme> & {
  hotspotCoords: number[]
  hotspotAddress: string
  responses: DiscoveryResponse[]
  onSelect: ({ lat, lng, name }: MapSelectDetail) => void
  networkHotspots: Record<string, NetworkHotspot>
  selectedHotspot?: MapSelectDetail
  isPolling: boolean
  requestTime: number
  iterations: number
}
export const ANIM_LOOP_LENGTH_MS = 3000
const DiscoveryMap = ({
  hotspotCoords,
  hotspotAddress,
  responses,
  onSelect,
  networkHotspots,
  selectedHotspot,
  isPolling,
  requestTime,
  iterations,
  ...props
}: Props) => {
  const opacityAnim = useRef(new Animated.Value(0))
  const sizeAnim = useRef(new Animated.Value(0))
  const innerAnim = useRef(new Animated.Value(25))
  const cameraRef = useRef<MapboxGL.Camera>(null)
  const mapRef = useRef<MapboxGL.MapView>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const prevMapLoaded = usePrevious(mapLoaded)
  const anim = useRef(
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(opacityAnim.current, {
            toValue: 0.15,
            duration: ANIM_LOOP_LENGTH_MS / 2,
            useNativeDriver: false,
            easing: Easing.linear,
          }),
          Animated.timing(sizeAnim.current, {
            toValue: 55,
            duration: ANIM_LOOP_LENGTH_MS / 2,
            useNativeDriver: false,
          }),
          Animated.timing(innerAnim.current, {
            toValue: 35,
            duration: ANIM_LOOP_LENGTH_MS / 2,
            useNativeDriver: false,
          }),
        ]),
        Animated.timing(opacityAnim.current, {
          toValue: 0,
          duration: ANIM_LOOP_LENGTH_MS / 2,
          useNativeDriver: false,
          easing: Easing.linear,
        }),
      ]),
    ),
  )
  const { purpleMuted, purpleMain } = useColors()

  useEffect(() => {
    if (isPolling && !prevMapLoaded && mapLoaded) {
      anim.current.start()
    } else if (!isPolling && mapLoaded) {
      anim.current.reset()
    }
  }, [isPolling, mapLoaded, prevMapLoaded])

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

    const sources = {
      hotspot: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            id: hotspotAddress,
            geometry: {
              type: 'Point',
              coordinates: hotspotCoords,
            },
          },
        ],
      } as GeoJSON.FeatureCollection,
      nearbyHotspotMarker: {
        type: 'FeatureCollection',
        features: hotspotsToFeatures(Object.values(nearbyHotspots)),
      } as GeoJSON.FeatureCollection,
    } as Record<
      'hotspot' | 'nearbyHotspotMarker' | 'responses' | 'lines',
      GeoJSON.FeatureCollection
    >

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

      const lines = {
        type: 'FeatureCollection',
        features: responses.map((r) => ({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [hotspotCoords, [r.long, r.lat]],
          },
        })),
      } as GeoJSON.FeatureCollection
      sources.lines = lines
    }

    return sources
  }, [hotspotAddress, hotspotCoords, networkHotspots, responses])

  const setupMap = useCallback(async () => {
    setMapLoaded(true)
    cameraRef.current?.setCamera({
      centerCoordinate: hotspotCoords,
      zoomLevel: 13,
    })
  }, [hotspotCoords])

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
      <MapboxGL.MapView
        ref={mapRef}
        style={styles.map}
        styleURL={styleURL}
        logoEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        compassEnabled={false}
        onDidFinishLoadingMap={setupMap}
      >
        <MapboxGL.Camera ref={cameraRef} />

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

        <MapboxGL.ShapeSource id="line1" shape={shapeSources.lines}>
          <MapboxGL.LineLayer id="linelayer1" style={styles.line} />
        </MapboxGL.ShapeSource>

        <MapboxGL.ShapeSource id="sourceHotspot" shape={shapeSources.hotspot}>
          <MapboxGL.Animated.CircleLayer
            id="hotspotLocationOuterEllipse"
            style={{
              circleRadius: sizeAnim.current,
              circleColor: '#7679B0',
              circleOpacity: opacityAnim.current,
            }}
          />
          <MapboxGL.Animated.CircleLayer
            id="hotspotLocationInnerEllipse"
            aboveLayerID="hotspotLocationOuterEllipse"
            style={{
              circleRadius: innerAnim.current,
              circleColor: '#ccc',
              circleOpacity: opacityAnim.current,
            }}
          />
          <MapboxGL.CircleLayer
            id="hotspotLocation"
            aboveLayerID="hotspotLocationInnerEllipse"
            style={styles.hotspotLocation}
          />
        </MapboxGL.ShapeSource>
      </MapboxGL.MapView>
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
