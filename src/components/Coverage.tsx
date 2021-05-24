import MapboxGL, {
  Expression,
  FillLayerStyle,
  LineLayerStyle,
  OnPressEvent,
  SymbolLayerStyle,
} from '@react-native-mapbox-gl/maps'
import { h3ToParent } from 'h3-js'
import React, { memo, useCallback, useMemo } from 'react'
import { StyleProp } from 'react-native'
import { Hotspot } from '@helium/http'
import { DiscoveryResponse } from '../store/discovery/discoveryTypes'
import { Colors } from '../theme/theme'
import { useColors } from '../theme/themeHooks'

export type HexProperties = {
  avg_reward_scale: number
  hotspot_count: number
  id: string
}

type CoverageItem = DiscoveryResponse | Hotspot
type HexColors = {
  fill: Colors
  outline: Colors
}
type Props = {
  witnessColors?: HexColors
  networkColors?: HexColors
  selectedOutlineColor?: Colors
  fillOpacity?: number
  visible?: boolean
  selectedHexId?: string
  outlineWidth?: number
  selectedOutlineWidth?: number
  outline?: boolean
  showCount?: boolean
  witnesses?: CoverageItem[]
  onHexSelected?: (id: string) => void
}

const Coverage = ({
  networkColors = {
    fill: 'grayText',
    outline: 'offblack',
  },
  witnessColors = {
    fill: 'yellow',
    outline: 'yellow',
  },
  selectedOutlineColor = 'white',
  fillOpacity = 0.5,
  onHexSelected,
  visible = true,
  selectedHexId,
  outlineWidth = 2,
  selectedOutlineWidth = 5,
  outline = true,
  showCount = false,
  witnesses,
}: Props) => {
  const colors = useColors()
  const styles = useMemo(() => {
    const witnessLocations = (witnesses || [])
      .map((w) => {
        if (!w.location) return
        return h3ToParent(w.location, 8)
      })
      .filter((w) => !!w) as string[]

    return makeStyles(
      colors[witnessColors.fill],
      colors[witnessColors.outline],
      colors[networkColors.fill],
      colors[networkColors.outline],
      colors[selectedOutlineColor],
      fillOpacity,
      outlineWidth,
      selectedOutlineWidth,
      witnessLocations,
      selectedHexId || '',
    )
  }, [
    colors,
    fillOpacity,
    networkColors.fill,
    networkColors.outline,
    outlineWidth,
    selectedOutlineWidth,
    selectedOutlineColor,
    witnessColors.fill,
    witnessColors.outline,
    witnesses,
    selectedHexId,
  ])

  const onPress = useCallback(
    (event: OnPressEvent) => {
      if (!onHexSelected) return

      const { properties } = event.features[0]
      if (properties) {
        onHexSelected((properties as HexProperties).id)
      }
    },
    [onHexSelected],
  )

  const selectedFilter = useMemo(
    () => ['==', 'id', selectedHexId] as Expression,
    [selectedHexId],
  )

  if (!visible) {
    return null
  }

  return (
    <>
      <MapboxGL.VectorSource
        id="network"
        url="https://helium-hotspots.s3-us-west-2.amazonaws.com/public.h3_res8.json"
        onPress={onPress}
      >
        <MapboxGL.FillLayer
          id="hexagonFill"
          sourceID="tileServerH3"
          sourceLayerID="public.h3_res8"
          style={styles.fill}
        />
        {outline && (
          <MapboxGL.LineLayer
            id="hexagonLine"
            sourceID="tileServer"
            sourceLayerID="public.h3_res8"
            style={styles.outline}
          />
        )}
        {showCount && (
          <MapboxGL.SymbolLayer
            id="hotspotCount"
            sourceID="network"
            sourceLayerID="public.h3_res8"
            style={styles.text}
          />
        )}
        {outline && (
          <MapboxGL.LineLayer
            id="hexagonSelectedLine"
            sourceID="tileServerSelectedOutline"
            sourceLayerID="public.h3_res8"
            style={styles.outlineSelected}
            filter={selectedFilter}
          />
        )}
      </MapboxGL.VectorSource>
    </>
  )
}

const makeStyles = (
  witnessFillColor: string,
  witnessOutlineColor: string,
  networkFillColor: string,
  networkOutlineColor: string,
  selectedOutlineColor: string,
  fillOpacity: number,
  lineWidth: number,
  selectedLineWidth: number,
  witnessLocations: string[],
  selectedHex?: string,
) => {
  let lineColor = ['match', ['get', 'id']]
  if (selectedHex) {
    lineColor = [...lineColor, selectedHex, selectedOutlineColor]
  }
  lineColor = [
    ...lineColor,
    witnessLocations.filter((l) => l !== selectedHex),
    witnessOutlineColor,
    networkOutlineColor,
  ]

  const fillColor = [
    'match',
    ['get', 'id'],
    witnessLocations,
    witnessFillColor,
    networkFillColor,
  ]

  let opacity: number | Expression
  if (selectedHex) {
    opacity = ['match', ['get', 'id'], selectedHex, 0.8, fillOpacity]
  } else {
    opacity = fillOpacity
  }

  return {
    fill: {
      fillOpacity: opacity,
      fillColor,
    } as StyleProp<FillLayerStyle>,
    outline: {
      lineWidth,
      lineColor,
    } as StyleProp<LineLayerStyle>,
    outlineSelected: {
      lineWidth: selectedLineWidth,
      lineColor: selectedOutlineColor,
    } as StyleProp<LineLayerStyle>,
    text: {
      textFont: ['Inter Semi Bold'],
      textColor: 'white',
      textSize: 18,
      textField: '{hotspot_count}',
      textOpacity: ['match', ['get', 'id'], selectedHex, 1, fillOpacity],
    } as StyleProp<SymbolLayerStyle>,
  }
}

export default memo(Coverage)
