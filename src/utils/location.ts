import * as Location from 'expo-location'

export const reverseGeocode = async (latitude: number, longitude: number) =>
  Location.reverseGeocodeAsync({ latitude, longitude })

export const getCurrentPosition = async (
  accuracy: Location.LocationAccuracy = Location.LocationAccuracy.Balanced,
) => {
  const pos = await Location.getCurrentPositionAsync({ accuracy })
  return pos.coords
}
