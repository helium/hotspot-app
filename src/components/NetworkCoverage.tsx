import MapboxGL, {
  FillLayerStyle,
  LineLayerStyle,
  OnPressEvent,
} from '@react-native-mapbox-gl/maps'
import React, { memo, useCallback, useMemo } from 'react'
import { StyleProp } from 'react-native'
import NetworkPointCoverage from './NetworkPointCoverage'

export type HexProperties = {
  avg_reward_scale: number
  hotspot_count: number
  id: string
}

type Props = {
  fillColor?: string
  outlineColor?: string
  opacity?: number
  onHexSelected?: (is: string) => void
  visible?: boolean
  selectedHexId?: string
  outlineWidth?: number
  showCount?: boolean
  showRewardScale?: boolean
}

const NetworkCoverage = ({
  fillColor = '#4F5293',
  outlineColor = '#4F5293',
  opacity = 0.6,
  onHexSelected,
  visible = true,
  selectedHexId,
  outlineWidth = 1,
  showCount = false,
  showRewardScale = false,
}: Props) => {
  const styles = useMemo(
    () => makeStyles(fillColor, outlineColor, opacity, outlineWidth),
    [fillColor, opacity, outlineColor, outlineWidth],
  )

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

  if (!visible) {
    return null
  }

  return (
    <>
      <MapboxGL.VectorSource
        id="tileServerH3"
        url="https://helium-hotspots.s3-us-west-2.amazonaws.com/public.h3_res8.json"
        onPress={onPress}
      >
        <MapboxGL.FillLayer
          id="hexagonFill"
          sourceID="tileServerH3"
          sourceLayerID="public.h3_res8"
          minZoomLevel={9}
          style={showRewardScale ? styles.rewardFill : styles.hexagonFill}
        />
      </MapboxGL.VectorSource>
      {showCount && (
        <NetworkPointCoverage
          onHexSelected={onHexSelected}
          selectedHexId={selectedHexId}
          showRewardScale={showRewardScale}
        />
      )}
    </>
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
  rewardFill: {
    fillOpacity: opacity,
    fillColor: [
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
    fillOutlineColor: '#1C1E3B',
  } as StyleProp<FillLayerStyle>,
  line: {
    lineWidth,
    lineColor: outlineColor,
  } as StyleProp<LineLayerStyle>,
})

export default memo(NetworkCoverage)
