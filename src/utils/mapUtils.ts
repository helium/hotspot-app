import { Hotspot } from '@helium/http'
import { Feature } from 'geojson'
import { NetworkHotspot } from '../store/networkHotspots/networkHotspotsSlice'

// eslint-disable-next-line import/prefer-default-export
export const hotspotsToFeatures = (
  hotspots: Hotspot[] | NetworkHotspot[],
): Feature[] =>
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
