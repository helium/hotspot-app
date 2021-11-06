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
  SymbolLayerStyle,
} from '@react-native-mapbox-gl/maps'
import { BoxProps } from '@shopify/restyle'
import { Platform, StyleProp } from 'react-native'
import { Position } from 'geojson'
import Config from 'react-native-config'
import { Theme } from '../../../../theme/theme'
import Box from '../../../../components/Box'
import { DiscoveryResponse } from '../../../../store/discovery/discoveryTypes'
import { findBounds } from '../../../../utils/mapUtils'
import { useColors } from '../../../../theme/themeHooks'
import useVisible from '../../../../utils/useVisible'
import Coverage from '../../../../components/Coverage'

type Props = BoxProps<Theme> & {
  responses: DiscoveryResponse[]
  onSelectHex: (id: string) => void
  selectedHexId?: string
}
const isAndroid = Platform.OS === 'android'

const DiscoveryMap = ({
  responses,
  onSelectHex,
  selectedHexId,
  ...props
}: Props) => {
  const cameraRef = useRef<MapboxGL.Camera>(null)
  const mapRef = useRef<MapboxGL.MapView>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapBounds, setMapBounds] = useState<Position[]>()
  const [mapZoom, setMapZoom] = useState(0)
  const visible = useVisible({
    onDisappear: () => {
      if (!isAndroid) return

      setMapLoaded(false)
    },
  })
  const { purpleMain } = useColors()

  const styles = useMemo(() => makeStyles({ purpleMain }), [purpleMain])

  const showCoverage = useMemo(() => {
    return responses.find((r) => !!r.location)
  }, [responses])

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

  const onRegionDidChange = useCallback(async () => {
    const zoom = (await mapRef.current?.getZoom()) || 0
    const currentBounds = await mapRef.current?.getVisibleBounds()
    setMapBounds(currentBounds)
    setMapZoom(zoom)
  }, [])

  const defaultSettings = useMemo(
    () => ({ centerCoordinate: [-122.4194, 37.7749] }),
    [],
  )

  return (
    <Box {...props}>
      {(visible || !isAndroid) && (
        <MapboxGL.MapView
          ref={mapRef}
          style={styles.map}
          styleURL={Config.MAPBOX_STYLE_URL}
          onRegionDidChange={onRegionDidChange}
          logoEnabled={false}
          compassEnabled={false}
          onDidFinishLoadingMap={setupMap}
        >
          <MapboxGL.Camera
            ref={cameraRef}
            defaultSettings={defaultSettings}
            maxZoomLevel={12}
            minZoomLevel={8}
            followUserLocation={responses.length === 0}
          />

          {showCoverage && (
            <Coverage
              bounds={mapBounds}
              mapZoom={mapZoom}
              onHexSelected={onSelectHex}
              selectedHexId={selectedHexId}
              witnesses={responses}
            />
          )}
        </MapboxGL.MapView>
      )}
    </Box>
  )
}

export default memo(DiscoveryMap)

const makeStyles = ({ purpleMain }: { purpleMain: string }) => ({
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
