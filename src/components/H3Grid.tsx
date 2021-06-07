import MapboxGL, { LineLayerStyle } from '@react-native-mapbox-gl/maps'
import React, { memo, useMemo } from 'react'
import { Feature, FeatureCollection, Position } from 'geojson'
import geojson2h3 from 'geojson2h3'
import { StyleProp } from 'react-native'
import { Colors } from '../theme/theme'
import { useColors } from '../theme/themeHooks'
import { boundsToFeature } from '../utils/mapUtils'

type Props = {
  bounds?: Position[]
  res?: number
  color?: Colors
  width?: number
  visible?: boolean
  zoomLevel: number
}

const H3Grid = ({
  bounds,
  res = 8,
  color = 'blueDarkest',
  width = 1,
  visible = true,
  zoomLevel,
}: Props) => {
  const colors = useColors()
  const styles = useMemo(() => makeStyles(colors[color], width), [
    color,
    colors,
    width,
  ])

  const boundingBox = useMemo(() => {
    if (zoomLevel < 11) return { type: 'Feature' } as Feature
    return boundsToFeature(bounds)
  }, [bounds, zoomLevel])

  const sourceSet = useMemo(() => {
    if (!bounds || !visible || zoomLevel < 11)
      return { type: 'FeatureCollection', features: [] } as FeatureCollection
    const hexagons = geojson2h3.featureToH3Set(boundingBox, res)
    return geojson2h3.h3SetToFeatureCollection(hexagons, (h3Index) => ({
      id: h3Index,
    }))
  }, [boundingBox, bounds, res, visible, zoomLevel])

  return (
    <MapboxGL.ShapeSource id="h3Grid" shape={sourceSet}>
      <MapboxGL.LineLayer
        id="h3GridLine"
        minZoomLevel={11}
        style={styles.gridLine}
      />
    </MapboxGL.ShapeSource>
  )
}

const makeStyles = (color: string, width: number) => ({
  gridLine: {
    lineWidth: width,
    lineColor: color,
  } as StyleProp<LineLayerStyle>,
})

export default memo(H3Grid)
