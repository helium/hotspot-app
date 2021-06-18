import MapboxGL, {
  FillLayerStyle,
  LineLayerStyle,
  OnPressEvent,
} from '@react-native-mapbox-gl/maps'
import React, { memo, useCallback, useMemo } from 'react'
import { StyleProp } from 'react-native'
import { H3Index } from 'h3-js'
import geojson2h3 from 'geojson2h3'
import { Hotspot } from '@helium/http'
import { DiscoveryResponse } from '../store/discovery/discoveryTypes'

type CoverageItem = DiscoveryResponse | Hotspot
type Props = {
  id: string
  hotspots?: CoverageItem[]
  hexes?: H3Index[]
  fillColor?: string
  outlineColor?: string
  opacity?: number
  onHexSelected?: (id: string) => void
  visible?: boolean
  outlineWidth?: number
  fill?: boolean
  outline?: boolean
}

const HotspotsCoverage = ({
  id,
  hotspots,
  hexes,
  fillColor = '#1D91F8',
  outlineColor = '#1C1E3B',
  outlineWidth = 1,
  opacity = 0.6,
  onHexSelected = () => {},
  visible = true,
  fill = false,
  outline = false,
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
        if (!h.locationHex) return null
        return h.locationHex
      })
      .filter((h) => h !== null) as H3Index[]

    if (hexes) {
      ownedHexes.push(...hexes)
    }

    return geojson2h3.h3SetToFeatureCollection(ownedHexes, (h3Index) => ({
      h3Index,
    }))
  }, [hexes, hotspots])

  if (!visible || (hotspots?.length === 0 && hexes?.length === 0)) {
    return null
  }

  return (
    <MapboxGL.ShapeSource
      id={`${id}Features`}
      shape={features}
      onPress={onPress}
    >
      {fill && <MapboxGL.FillLayer id={`${id}Fill`} style={styles.fill} />}
      {outline && <MapboxGL.LineLayer id={`${id}Line`} style={styles.line} />}
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
