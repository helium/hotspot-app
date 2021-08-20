import { Hotspot } from '@helium/http'
import { Feature, Position } from 'geojson'
import { isFinite } from 'lodash'

export const hotspotsToFeatures = (hotspots: Hotspot[]): Feature[] =>
  hotspots
    .filter((h) => h.lat && h.lng)
    .map(
      (h) =>
        ({
          type: 'Feature',
          properties: { ...h },
          geometry: { type: 'Point', coordinates: [h.lng, h.lat] },
          id: h.address,
        } as Feature),
    )

export type MapBounds = {
  ne: number[]
  sw: number[]
  paddingLeft?: number
  paddingRight?: number
  paddingTop?: number
  paddingBottom?: number
}

export const findBounds = (
  coords: number[][],
  paddingBottom = 250,
): MapBounds | undefined => {
  if (coords.length === 0) {
    return
  }

  let minLng = coords[0][0]
  let maxLng = coords[0][0]
  let minLat = coords[0][1]
  let maxLat = coords[0][1]

  coords.forEach((m) => {
    const [lng, lat] = m
    if (lng < minLng) minLng = lng
    if (lng > maxLng) maxLng = lng
    if (lat < minLat) minLat = lat
    if (lat > maxLat) maxLat = lat
  })

  if (
    !isFinite(minLng) ||
    !isFinite(maxLng) ||
    !isFinite(minLat) ||
    !isFinite(maxLat)
  ) {
    return
  }

  return {
    ne: [maxLng, maxLat],
    sw: [minLng, minLat],
    paddingBottom,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 30,
  }
}

export const boundsToFeature = (bounds: Position[] | undefined): Feature => {
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
}
