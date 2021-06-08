import MapboxGL, {
  Expression,
  FillLayerStyle,
  LineLayerStyle,
  OnPressEvent,
  SymbolLayerStyle,
} from '@react-native-mapbox-gl/maps'
import { h3ToParent } from 'h3-js'
import React, { memo, useCallback, useEffect, useMemo } from 'react'
import { StyleProp } from 'react-native'
import { Hotspot } from '@helium/http'
import { Position } from 'geojson'
import geojson2h3 from 'geojson2h3'
import { DiscoveryResponse } from '../store/discovery/discoveryTypes'
import { Colors } from '../theme/theme'
import { useColors } from '../theme/themeHooks'
import { boundsToFeature } from '../utils/mapUtils'

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
  bounds?: Position[]
  witnessColors?: HexColors
  networkColors?: HexColors
  selectedOutlineColor?: Colors
  fillOpacity?: number
  selectedHexId?: string
  outlineWidth?: number
  selectedOutlineWidth?: number
  witnesses?: CoverageItem[]
  onHexSelected?: (id: string) => void
}

const Coverage = ({
  bounds,
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
  selectedHexId,
  outlineWidth = 2,
  selectedOutlineWidth = 5,
  witnesses,
}: Props) => {
  useEffect(() => {}, [witnesses])

  const boundingBox = useMemo(() => {
    return boundsToFeature(bounds)
  }, [bounds])

  const sourceSet = useMemo(() => {
    const hexagons = geojson2h3.featureToH3Set(boundingBox, 8)
    return geojson2h3.h3SetToFeatureCollection(hexagons, (h3Index) => ({
      id: h3Index,
    }))
  }, [boundingBox])

  const colors = useColors()
  const styles = useMemo(() => {
    const witnessLocations = [
      ...new Set( // Need to filter duplicates or mapbox gets angry
        (witnesses || [])
          .map((w) => {
            if (!w.location) return
            return h3ToParent(w.location, 8)
          })
          .filter((w) => !!w) as string[],
      ),
    ]

    return makeStyles(
      colors.blueDarkest,
      1,
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
    selectedHexId,
    selectedOutlineColor,
    selectedOutlineWidth,
    witnessColors.fill,
    witnessColors.outline,
    witnesses,
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

  return (
    <>
      <MapboxGL.ShapeSource id="h3Grid" shape={sourceSet}>
        <MapboxGL.LineLayer
          id="h3GridLine"
          minZoomLevel={11}
          style={styles.gridLine}
        />
      </MapboxGL.ShapeSource>
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
        <MapboxGL.LineLayer
          id="hexagonLine"
          sourceID="tileServer"
          sourceLayerID="public.h3_res8"
          minZoomLevel={10}
          style={styles.outline}
        />
        <MapboxGL.LineLayer
          id="hexagonSelectedLine"
          sourceID="tileServerSelectedOutline"
          sourceLayerID="public.h3_res8"
          style={styles.outlineSelected}
          filter={selectedFilter}
          minZoomLevel={10}
        />
      </MapboxGL.VectorSource>
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
          style={styles.text}
        />
      </MapboxGL.VectorSource>
    </>
  )
}

const makeStyles = (
  gridLineColor: string,
  gridLineWidth: number,
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
    gridLine: {
      lineWidth: gridLineWidth,
      lineColor: gridLineColor,
    } as StyleProp<LineLayerStyle>,
    fill: {
      fillOpacity: opacity,
      fillColor,
    } as StyleProp<FillLayerStyle>,
    outline: {
      lineWidth,
      lineColor: networkOutlineColor,
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
