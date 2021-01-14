import { Hotspot } from '@helium/http'
import { Feature } from 'geojson'

// eslint-disable-next-line import/prefer-default-export
export const hotspotsToFeatures = (hotspots: Hotspot[]): Feature[] =>
  hotspots.map(
    (h) =>
      ({
        type: 'Feature',
        properties: { ...h },
        geometry: { type: 'Point', coordinates: [h.lng, h.lat] },
        id: h.address,
      } as Feature),
  )
