import MapboxGL, {
  FillLayerStyle,
  OnPressEvent,
} from '@react-native-mapbox-gl/maps'
import React, { memo, useCallback, useMemo } from 'react'
import { StyleProp } from 'react-native'

export type HexProperties = {
  avg_reward_scale: number
  hotspot_count: number
  id: string
}

type Props = {
  fillColor?: string
  outlineColor?: string
  opacity?: number
  onHexSelected: (hexProperties: HexProperties) => void
  visible: boolean
}

const NetworkCoverage = ({
  fillColor = '#4F5293',
  outlineColor = '#4F5293',
  opacity = 0.6,
  onHexSelected,
  visible,
}: Props) => {
  const styles = useMemo(() => makeStyles(fillColor, outlineColor, opacity), [
    fillColor,
    opacity,
    outlineColor,
  ])

  const onPress = useCallback(
    (event: OnPressEvent) => {
      const { properties } = event.features[0]
      if (properties) {
        // const res8H3 = properties.id
        // onFeatureSelected(properties)
        // TODO: Load hotspots in hex
        onHexSelected(properties as HexProperties)
      }
    },
    [onHexSelected],
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
    </MapboxGL.VectorSource>
  )
}

const makeStyles = (
  fillColor: string,
  outlineColor: string,
  opacity: number,
) => ({
  hexagonFill: {
    fillOpacity: opacity,
    fillColor,
    fillOutlineColor: outlineColor,
  } as StyleProp<FillLayerStyle>,
})

export default memo(NetworkCoverage)
