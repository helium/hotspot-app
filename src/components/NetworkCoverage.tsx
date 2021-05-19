import MapboxGL, {
  Expression,
  FillLayerStyle,
  LineLayerStyle,
  OnPressEvent,
} from '@react-native-mapbox-gl/maps'
import React, { memo, useCallback, useMemo } from 'react'
import { StyleProp } from 'react-native'
import { prettyPrintToConsole } from '../utils/logger'

export type HexProperties = {
  avg_reward_scale: number
  hotspot_count: number
  id: string
}

type Props = {
  fillColor?: string
  outlineColor?: string
  opacity?: number
  onHexSelected?: (hexProperties: HexProperties) => void
  visible?: boolean
  selectedHexId?: string
  outlineWidth?: number
  outline?: boolean
}

const NetworkCoverage = ({
  fillColor = '#4F5293',
  outlineColor = '#4F5293',
  opacity = 0.6,
  onHexSelected,
  visible = true,
  selectedHexId,
  outlineWidth = 1,
  outline = true,
}: Props) => {
  const styles = useMemo(
    () => makeStyles(fillColor, outlineColor, opacity, outlineWidth),
    [fillColor, opacity, outlineColor, outlineWidth],
  )

  const onPress = useCallback(
    (event: OnPressEvent) => {
      if (!onHexSelected) return
      prettyPrintToConsole(event)

      const { properties } = event.features[0]
      if (properties) {
        onHexSelected(properties as HexProperties)
      }
    },
    [onHexSelected],
  )

  const outlineFilter = useMemo(
    () => ['==', 'id', selectedHexId || ''] as Expression,
    [selectedHexId],
  )

  if (!visible) {
    return null
  }

  return (
    <MapboxGL.VectorSource
      id="tileServer"
      url="https://helium-hotspots.s3-us-west-2.amazonaws.com/public.h3_res8.json"
      onPress={onPress}
    >
      <MapboxGL.FillLayer
        id="hexagonFill"
        sourceID="tileServer"
        sourceLayerID="public.h3_res8"
        style={styles.hexagonFill}
      />
      {outline && (
        <MapboxGL.LineLayer
          id="hexagonLine"
          sourceID="tileServer"
          sourceLayerID="public.h3_res8"
          style={styles.line}
          filter={outlineFilter}
        />
      )}
    </MapboxGL.VectorSource>
  )
}

const makeStyles = (
  fillColor: string,
  outlineColor: string,
  opacity: number,
  lineWidth: number,
) => ({
  hexagonFill: {
    fillOpacity: opacity,
    fillColor,
    fillOutlineColor: '#1C1E3B',
  } as StyleProp<FillLayerStyle>,

  line: {
    lineWidth,
    lineColor: outlineColor,
  } as StyleProp<LineLayerStyle>,
})

export default memo(NetworkCoverage)
