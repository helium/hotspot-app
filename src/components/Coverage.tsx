import MapboxGL, {
  CircleLayerStyle,
  Expression,
  FillLayerStyle,
  LineLayerStyle,
  OnPressEvent,
  SymbolLayerStyle,
} from '@react-native-mapbox-gl/maps'
import React, { memo, useCallback, useMemo } from 'react'
import { StyleProp } from 'react-native'
import { Hotspot, Witness } from '@helium/http'
import { Feature, FeatureCollection, Position } from 'geojson'
import geojson2h3 from 'geojson2h3'
import Config from 'react-native-config'
import { useSelector } from 'react-redux'
import { DiscoveryResponse } from '../store/discovery/discoveryTypes'
import { Colors } from '../theme/theme'
import { useColors } from '../theme/themeHooks'
import { boundsToFeature } from '../utils/mapUtils'
import { RootState } from '../store/rootReducer'

export type HexProperties = {
  avg_reward_scale: number
  hotspot_count: number
  id: string
}

type CoverageItem = DiscoveryResponse | Hotspot | Witness
type HexColors = {
  fill: Colors
  outline: Colors
}
type Props = {
  bounds?: Position[]
  mapZoom?: number
  witnessColors?: HexColors
  networkColors?: HexColors
  ownedColors?: HexColors
  followedColors?: HexColors
  selectedOutlineColor?: Colors
  fillOpacity?: number
  selectedHexId?: string
  outlineWidth?: number
  selectedOutlineWidth?: number
  witnesses?: CoverageItem[]
  ownedHotspots?: CoverageItem[]
  followedHotspots?: CoverageItem[]
  onHexSelected?: (id: string) => void
  showRewardScale?: boolean
  showGrid?: boolean
}

const Coverage = ({
  bounds,
  mapZoom,
  networkColors = {
    fill: 'grayHex',
    outline: 'offblack',
  },
  witnessColors = {
    fill: 'yellow',
    outline: 'yellow',
  },
  ownedColors = {
    fill: 'blueBright',
    outline: 'blueBright',
  },
  followedColors = {
    fill: 'purpleBright',
    outline: 'purpleBright',
  },
  selectedOutlineColor = 'white',
  fillOpacity = 0.5,
  onHexSelected,
  selectedHexId,
  outlineWidth = 2,
  selectedOutlineWidth = 5,
  witnesses,
  ownedHotspots,
  followedHotspots,
  showRewardScale,
  showGrid = true,
}: Props) => {
  const tileServerRes8Url = useSelector(
    (state: RootState) => state.features.tileServerRes8Url,
  )
  const tileServerPointsUrl = useSelector(
    (state: RootState) => state.features.tileServerPointsUrl,
  )
  const boundingBox = useMemo(() => {
    if (!showGrid || !mapZoom || mapZoom < 11)
      return { type: 'Feature' } as Feature
    return boundsToFeature(bounds)
  }, [bounds, mapZoom, showGrid])

  const sourceSet = useMemo(() => {
    if (!showGrid || !mapZoom || !bounds || mapZoom < 11)
      return { type: 'FeatureCollection', features: [] } as FeatureCollection
    const hexagons = geojson2h3.featureToH3Set(boundingBox, 8)
    return geojson2h3.h3SetToFeatureCollection(hexagons, (h3Index) => ({
      id: h3Index,
    }))
  }, [boundingBox, bounds, mapZoom, showGrid])

  const getLocationHexes = useCallback(
    (list: CoverageItem[] | undefined) => [
      ...new Set( // Need to filter duplicates or mapbox gets angry
        (list || [])
          .map((item) => {
            if (!item.locationHex) return
            return item.locationHex
          })
          .filter((item) => !!item) as string[],
      ),
    ],
    [],
  )

  const colors = useColors()
  const styles = useMemo(() => {
    const witnessLocations = getLocationHexes(witnesses)
    const ownedLocations = getLocationHexes(ownedHotspots)
    const followedLocations = getLocationHexes(followedHotspots).filter(
      (f) => ownedLocations.indexOf(f) < 0,
    )

    return makeStyles(
      colors.blueDarkest,
      1,
      colors[witnessColors.fill],
      colors[ownedColors.fill],
      colors[followedColors.fill],
      colors[networkColors.fill],
      colors[networkColors.outline],
      colors[selectedOutlineColor],
      fillOpacity,
      outlineWidth,
      selectedOutlineWidth,
      witnessLocations,
      ownedLocations,
      followedLocations,
      selectedHexId || '',
    )
  }, [
    colors,
    fillOpacity,
    followedColors.fill,
    followedHotspots,
    getLocationHexes,
    networkColors.fill,
    networkColors.outline,
    outlineWidth,
    ownedColors.fill,
    ownedHotspots,
    selectedHexId,
    selectedOutlineColor,
    selectedOutlineWidth,
    witnessColors.fill,
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
        url={tileServerRes8Url}
        onPress={onPress}
      >
        <MapboxGL.FillLayer
          id="hexagonFill"
          sourceID="tileServerH3"
          sourceLayerID="public.h3_res8"
          style={showRewardScale ? styles.rewardScaleFill : styles.fill}
          minZoomLevel={8}
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
        url={tileServerPointsUrl}
        onPress={onPress}
      >
        <MapboxGL.SymbolLayer
          id="hotspotCount"
          sourceID="tileServerPoints"
          sourceLayerID="public.points"
          minZoomLevel={11}
          style={styles.text}
        />
        <MapboxGL.CircleLayer
          id="hotspotPoints"
          sourceID="tileServerPoints"
          sourceLayerID="public.points"
          maxZoomLevel={8}
          style={
            showRewardScale ? styles.rewardScaleCircle : styles.defaultCircle
          }
        />
      </MapboxGL.VectorSource>
    </>
  )
}

const makeStyles = (
  gridLineColor: string,
  gridLineWidth: number,
  witnessFillColor: string,
  ownedFillColor: string,
  followedFillColor: string,
  networkFillColor: string,
  networkOutlineColor: string,
  selectedOutlineColor: string,
  fillOpacity: number,
  lineWidth: number,
  selectedLineWidth: number,
  witnessLocations: string[],
  ownedLocations: string[],
  followedLocations: string[],
  selectedHex?: string,
) => {
  // needed to prevent mapbox from crashing
  if (witnessLocations.length === 0) witnessLocations.push('witness_empty')
  if (ownedLocations.length === 0) ownedLocations.push('owned_empty')
  if (followedLocations.length === 0) followedLocations.push('followed_empty')

  const fillColor = [
    'match',
    ['get', 'id'],
    witnessLocations,
    witnessFillColor,
    ownedLocations,
    ownedFillColor,
    followedLocations,
    followedFillColor,
    networkFillColor,
  ]

  const opacity: number | Expression = [
    'match',
    ['get', 'id'],
    witnessLocations,
    0.7,
    ownedLocations,
    0.55,
    followedLocations,
    0.67,
    fillOpacity,
  ]

  const commonCircleStyle: CircleLayerStyle = {
    circleRadius: ['interpolate', ['linear'], ['zoom'], 1, 1.5, 9, 4],
    circleOpacity: ['interpolate', ['linear'], ['zoom'], 1, 0.02, 9, 0.3],
  }

  const rewardScaleColor: Expression = [
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
  ]

  const textFont = Config.MAPBOX_FONT_NAME
    ? [Config.MAPBOX_FONT_NAME]
    : undefined
  let text = {
    textColor: [
      'case',
      ['==', ['get', 'id'], selectedHex || ''],
      '#FFFFFF',
      '#000000',
    ],
    textSize: 18,
    textField: '{hotspot_count}',
    textOpacity: ['case', ['==', ['get', 'hotspot_count'], 1], 0, 1],
  } as StyleProp<SymbolLayerStyle>

  if (textFont) {
    text = Object.assign(text, { textFont })
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
    rewardScaleFill: {
      fillOpacity,
      fillColor: rewardScaleColor,
    } as StyleProp<FillLayerStyle>,
    outline: {
      lineWidth,
      lineColor: networkOutlineColor,
    } as StyleProp<LineLayerStyle>,
    outlineSelected: {
      lineWidth: selectedLineWidth,
      lineColor: selectedOutlineColor,
    } as StyleProp<LineLayerStyle>,
    text,
    defaultCircle: {
      ...commonCircleStyle,
      circleColor: '#29d391',
    } as StyleProp<CircleLayerStyle>,
    rewardScaleCircle: {
      ...commonCircleStyle,
      circleColor: rewardScaleColor,
    } as StyleProp<CircleLayerStyle>,
  }
}

export default memo(Coverage)
