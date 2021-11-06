import { geoToH3, h3ToGeo } from 'h3-js'

const DEFAULT_H3_RES = 12

/**
 * Returns the h3 string from a lat and lng at res 12 by default
 * @param lat
 * @param lng
 * @param res
 */
export const getH3Location = (
  lat: number,
  lng: number,
  res = DEFAULT_H3_RES,
): string => {
  return geoToH3(lat, lng, res)
}

/**
 * Returns an array of [lat, lng] from h3 location string.
 * @param location
 */
export const getGeoFromH3 = (location: string): number[] => {
  return h3ToGeo(location)
}
