import { Hotspot, Witness } from '@helium/http'
import * as Location from 'expo-location'
import { isFinite } from 'lodash'

export type LocationCoords = { latitude: number; longitude: number }

export const reverseGeocode = async (latitude: number, longitude: number) =>
  Location.reverseGeocodeAsync({ latitude, longitude })

export const getCurrentPosition = async (
  accuracy: Location.LocationAccuracy = Location.LocationAccuracy.Balanced,
) => {
  const pos = await Location.getCurrentPositionAsync({ accuracy })
  return pos.coords
}

function toRad(x: number): number {
  return (x * Math.PI) / 180
}

export const distance = (coords1: LocationCoords, coords2: LocationCoords) => {
  const { latitude: lat1, longitude: lon1 } = coords1
  const { latitude: lat2, longitude: lon2 } = coords2

  const R = 6371 // km

  const x1 = lat2 - lat1
  const dLat = toRad(x1)
  const x2 = lon2 - lon1
  const dLon = toRad(x2)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export const hotspotHasValidLocation = (hotspot?: Hotspot | Witness) =>
  !!hotspot &&
  hotspot.lat !== 0 &&
  hotspot.lng !== 0 &&
  isFinite(hotspot.lat) &&
  isFinite(hotspot.lng)

export const locationIsValid = (location?: number[]) =>
  !!location &&
  location.length === 2 &&
  location[0] !== 0 &&
  location[1] !== 0 &&
  isFinite(location[0]) &&
  isFinite(location[1])
