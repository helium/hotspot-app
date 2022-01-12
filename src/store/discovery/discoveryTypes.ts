export type RecentDiscoveryInfo = {
  nextRenewal: string
  recentRequests: DiscoveryRequest[]
  requestsRemaining: number
  requestsPerDay: number
  requestLength: number
  serverDate?: string
  enabled: boolean
}

export type DiscoveryRequest = {
  id: number
  hotspotAddress: string
  responses: DiscoveryResponse[]
  insertedAt: string
  errorCode: number
  lat: string
  lng: string
  serverDate?: string
}

export type DiscoveryResponse = {
  channel: number
  hotspotAddress: string
  frequency: number
  name: string
  reportedAt: number
  rssi: number
  snr: number
  spreading: string
  status: string
  lat: number
  long: number
  location: string
  locationHex: string
}

export type ViewState = 'begin' | 'results'
