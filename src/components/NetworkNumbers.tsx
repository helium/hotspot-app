import MapboxGL, {
  OnPressEvent,
  SymbolLayerStyle,
} from '@react-native-mapbox-gl/maps'
import React, { memo, useCallback, useMemo } from 'react'
import { StyleProp } from 'react-native'

type Props = {
  onHexSelected?: (is: string) => void
  selectedHexId?: string
}

const NetworkNumbers = ({ onHexSelected, selectedHexId }: Props) => {
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
    </MapboxGL.VectorSource>
  )
}

export default memo(NetworkNumbers)
