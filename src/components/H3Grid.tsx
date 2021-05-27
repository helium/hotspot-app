import MapboxGL, { LineLayerStyle } from '@react-native-mapbox-gl/maps'
import React, { memo, useMemo } from 'react'
import { Feature, Position } from 'geojson'
import geojson2h3 from 'geojson2h3'
import { StyleProp } from 'react-native'
import { Colors } from '../theme/theme'
import { useColors } from '../theme/themeHooks'

type Props = {
  bounds?: Position[]
  res?: number
  color?: Colors
  width?: number
  visible?: boolean
}

const H3Grid = ({
  bounds,
  res = 8,
  color = 'blueDarkest',
  width = 1,
  visible = true,
}: Props) => {
  const colors = useColors()
  const styles = useMemo(() => makeStyles(colors[color], width), [
    color,
    colors,
    width,
  ])

  const boundingBox = useMemo(() => {
    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: bounds
          ? [
              [
                [bounds[0][0], bounds[0][1]],
                [bounds[0][0], bounds[1][1]],
                [bounds[1][0], bounds[1][1]],
                [bounds[1][0], bounds[0][1]],
                [bounds[0][0], bounds[0][1]],
              ],
            ]
          : [],
      },
    } as Feature
  }, [bounds])

  const sourceSet = useMemo(() => {
    const hexagons = geojson2h3.featureToH3Set(boundingBox, res)
    return geojson2h3.h3SetToFeatureCollection(hexagons, (h3Index) => ({
      id: h3Index,
    }))
  }, [boundingBox, res])

  if (!bounds || !visible) {
    return null
  }

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
