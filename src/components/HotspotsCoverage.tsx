import MapboxGL, {
  Expression,
  FillLayerStyle,
  LineLayerStyle,
  OnPressEvent,
} from '@react-native-mapbox-gl/maps'
import React, { memo, useCallback, useMemo } from 'react'
import { StyleProp } from 'react-native'
import { h3ToParent, H3Index } from 'h3-js'
import geojson2h3 from 'geojson2h3'
import { Hotspot } from '@helium/http'
import { DiscoveryResponse } from '../store/discovery/discoveryTypes'

type CoverageItem = DiscoveryResponse | Hotspot
type Props = {
  id: string
  hotspots?: CoverageItem[]
  fillColor?: string
  outlineColor?: string
  opacity?: number
  onHexSelected?: (id: string) => void
  visible?: boolean
  outlineWidth?: number
  fill?: boolean
  outline?: boolean
  selectedHexId?: string
}

const HotspotsCoverage = ({
  id,
  hotspots,
  fillColor = '#1D91F8',
  outlineColor = '#1C1E3B',
  outlineWidth = 1,
  opacity = 0.6,
  onHexSelected = () => {},
  visible = true,
  fill = false,
  outline = false,
  selectedHexId,
}: Props) => {
  const styles = useMemo(
    () => makeStyles(fillColor, outlineColor, opacity, outlineWidth),
    [fillColor, opacity, outlineColor, outlineWidth],
  )

  const onPress = useCallback(
    (event: OnPressEvent) => {
      if (!event.features.length || !event.features[0].id) return
      onHexSelected(event.features[0].id as string)
    },
    [onHexSelected],
  )

  const features = useMemo(() => {
    const ownedHexes = (hotspots || [])
      .map((h) => {
        if (!h.location) return null
        return h3ToParent(h.location, 8)
      })
      .filter((h) => h !== null) as H3Index[]
    const retVal = geojson2h3.h3SetToFeatureCollection(
      ownedHexes,
      (h3Index) => ({
        h3Index,
      }),
    )
    return retVal
  }, [hotspots])

  const outlineFilter = useMemo(
    () => ['==', 'h3Index', selectedHexId || ''] as Expression,
    [selectedHexId],
  )

  if (!visible || hotspots?.length === 0) {
    return null
  }

  return (
    <MapboxGL.ShapeSource
      id={`${id}Features`}
      shape={features}
      onPress={onPress}
    >
      {fill && <MapboxGL.FillLayer id={`${id}Fill`} style={styles.fill} />}
      {outline && (
        <MapboxGL.LineLayer
          id={`${id}Line`}
          style={styles.line}
          filter={outlineFilter}
        />
      )}
    </MapboxGL.ShapeSource>
  )
}

const makeStyles = (
  fillColor: string,
  outlineColor: string,
  opacity: number,
  lineWidth: number,
) => ({
  fill: {
    fillOpacity: opacity,
    fillColor,
    fillOutlineColor: outlineColor,
  } as StyleProp<FillLayerStyle>,
  line: {
    lineWidth,
    lineColor: outlineColor,
  } as StyleProp<LineLayerStyle>,
})

export default memo(HotspotsCoverage)
