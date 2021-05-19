import MapboxGL, {
  FillLayerStyle,
  LineLayerStyle,
  OnPressEvent,
} from '@react-native-mapbox-gl/maps'
import React, { memo, useCallback, useMemo } from 'react'
import { StyleProp } from 'react-native'
import { h3ToParent } from 'h3-js'
import geojson2h3 from 'geojson2h3'
import { Hotspot } from '@helium/http'

type Props = {
  id: string
  hotspots: Hotspot[]
  fillColor?: string
  outlineColor?: string
  opacity?: number
  onHotspotSelected?: (hotspot: Hotspot) => void
  visible?: boolean
  outlineWidth?: number
  fill?: boolean
  outline?: boolean
}

const HotspotsCoverage = ({
  id,
  hotspots,
  fillColor = '#1D91F8',
  outlineColor = '#1C1E3B',
  outlineWidth = 1,
  opacity = 0.6,
  onHotspotSelected = () => {},
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
      const { properties } = event.features[0]
      if (properties) {
        onHotspotSelected(properties as Hotspot)
      }
    },
    [onHotspotSelected],
  )

  const features = useMemo(() => {
    const ownedHexes = hotspots?.map((h) => h3ToParent(h.location || '', 8))
    return geojson2h3.h3SetToFeatureCollection(ownedHexes)
  }, [hotspots])

  if (!visible) {
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
