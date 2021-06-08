import MapboxGL, {
  CircleLayerStyle,
  OnPressEvent,
  SymbolLayerStyle,
} from '@react-native-mapbox-gl/maps'
import React, { memo, useCallback, useMemo } from 'react'
import { StyleProp } from 'react-native'

type Props = {
  onHexSelected?: (is: string) => void
  selectedHexId?: string
  showRewardScale: boolean
}

const NetworkPointCoverage = ({
  onHexSelected,
  selectedHexId,
  showRewardScale,
}: Props) => {
  const onPress = useCallback(
    (event: OnPressEvent) => {
      if (!onHexSelected) return

      const { properties } = event.features[0]
      if (properties) {
        onHexSelected(properties.id)
      }
    },
    [onHexSelected],
  )

  const numberStyle = useMemo(
    (): StyleProp<SymbolLayerStyle> => ({
      textFont: ['Inter Semi Bold'],
      textField: '{hotspot_count}',
      textColor: [
        'case',
        ['==', ['get', 'id'], selectedHexId || ''],
        '#FFFFFF',
        '#000000',
      ],
      textOpacity: ['case', ['==', ['get', 'hotspot_count'], 1], 0, 1],
    }),
    [selectedHexId],
  )

  const commonStyles = useMemo(
    (): CircleLayerStyle => ({
      circleRadius: ['interpolate', ['linear'], ['zoom'], 1, 1.5, 9, 4],
      circleOpacity: ['interpolate', ['linear'], ['zoom'], 1, 0.02, 9, 0.2],
    }),
    [],
  )

  const defaultCircleStyle = useMemo(
    (): StyleProp<CircleLayerStyle> => ({
      ...commonStyles,
      circleColor: '#29d391',
    }),
    [commonStyles],
  )

  const rewardScaleStyle = useMemo(
    (): StyleProp<CircleLayerStyle> => ({
      ...commonStyles,
      circleColor: [
        'case',
        ['==', ['get', 'avg_reward_scale'], 0],
        '#4F5293',
        [
          'interpolate',
          ['linear'],
          ['get', 'avg_reward_scale'],
          0,
          '#FF6666',
          0.2,
          '#FC8745',
          0.4,
          '#FEA053',
          0.6,
          '#FCC945',
          0.8,
          '#9FE14A',
          1,
          '#29D344',
        ],
      ],
    }),
    [commonStyles],
  )

  return (
    <MapboxGL.VectorSource
      id="tileServerPoints"
      url="https://helium-hotspots.s3-us-west-2.amazonaws.com/public.points.json"
      onPress={onPress}
    >
      <MapboxGL.SymbolLayer
        id="hotspotCount"
        sourceID="tileServerPoints"
        sourceLayerID="public.points"
        minZoomLevel={11}
        style={numberStyle}
      />
      <MapboxGL.CircleLayer
        id="hotspotPoints"
        sourceID="tileServerPoints"
        sourceLayerID="public.points"
        maxZoomLevel={9}
        style={showRewardScale ? rewardScaleStyle : defaultCircleStyle}
      />
    </MapboxGL.VectorSource>
  )
}

export default memo(NetworkPointCoverage)
