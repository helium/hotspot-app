import { MakerAntenna } from './antennaMakerTypes'
import { MakerHotspot } from './hotspotMakerTypes'

export type MakerType = {
  id: number
  supportEmail: string
  antennas: Record<string, MakerAntenna>
  hotspots: Record<string, MakerHotspot>
  makerApp?: Record<'makerAppName' | 'ios' | 'android', string>
}
