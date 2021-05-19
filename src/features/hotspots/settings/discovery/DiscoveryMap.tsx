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
import { Hotspot } from '@helium/http'
import { Theme } from '../../../../theme/theme'
import Box from '../../../../components/Box'
import { DiscoveryResponse } from '../../../../store/discovery/discoveryTypes'
import { findBounds } from '../../../../utils/mapUtils'
import { useColors } from '../../../../theme/themeHooks'
import useVisible from '../../../../utils/useVisible'
import H3Grid from '../../../../components/H3Grid'
import NetworkCoverage, {
  HexProperties,
} from '../../../../components/NetworkCoverage'
import HotspotsCoverage from '../../../../components/HotspotsCoverage'

const styleURL = 'mapbox://styles/petermain/ckjtsfkfj0nay19o3f9jhft6v'

type Props = BoxProps<Theme> & {
  responses: DiscoveryResponse[]
  onSelectHex: (id: string) => void
  selectedHotspots: Hotspot[]
  selectedHexId?: string
}
const isAndroid = Platform.OS === 'android'

const DiscoveryMap = ({
  responses,
  onSelectHex,
  selectedHexId,
  ...props
}: Props) => {
  const colors = useColors()
  const cameraRef = useRef<MapboxGL.Camera>(null)
  const mapRef = useRef<MapboxGL.MapView>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapBounds, setMapBounds] = useState<Position[]>()
  const visible = useVisible({
    onDisappear: () => {
      if (!isAndroid) return

      setMapLoaded(false)
    },
  })
  const { purpleMain } = useColors()

  const styles = useMemo(() => makeStyles({ purpleMain }), [purpleMain])

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
    const currentBounds = await mapRef.current?.getVisibleBounds()
    setMapBounds(currentBounds)
  }, [])

  const handleNetworkHexPress = useCallback(
    (hexProps: HexProperties) => {
      onSelectHex(hexProps.id)
    },
    [onSelectHex],
  )
  return (
    <Box {...props}>
      {(visible || !isAndroid) && (
        <MapboxGL.MapView
          ref={mapRef}
          style={styles.map}
          styleURL={styleURL}
          onRegionDidChange={onRegionDidChange}
          logoEnabled={false}
          compassEnabled={false}
          onDidFinishLoadingMap={setupMap}
        >
          <MapboxGL.Camera ref={cameraRef} maxZoomLevel={12} />

          <H3Grid bounds={mapBounds} />
          <NetworkCoverage
            onHexSelected={handleNetworkHexPress}
            selectedHexId={selectedHexId}
            outlineColor={colors.white}
            outlineWidth={2}
          />
          <HotspotsCoverage
            id="responders"
            hotspots={responses}
            fill
            onHexSelected={onSelectHex}
            fillColor={colors.yellow}
            selectedHexId={selectedHexId}
            outline
            outlineColor={colors.white}
            outlineWidth={2}
          />
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
