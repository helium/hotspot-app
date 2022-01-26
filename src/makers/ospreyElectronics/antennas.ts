import { MakerAntenna } from '../antennaMakerTypes'

const ELECTRONICS_HOTSPOT_US = {
  name: 'Osprey Electronics Hotspot (US 915)',
  gain: 1.2,
} as MakerAntenna

const ELECTRONICS_HOTSPOT_EU = {
  name: 'Osprey Electronics Hotspot (EU 868)',
  gain: 2.3,
} as MakerAntenna

export default { ELECTRONICS_HOTSPOT_US, ELECTRONICS_HOTSPOT_EU }
