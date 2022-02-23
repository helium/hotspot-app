import { MakerAntenna } from '../antennaMakerTypes'

const PYCOM_US = {
  name: 'Pycom Helium Hotspot (US 915)',
  gain: 1.2,
} as MakerAntenna

const PYCOM_EU = {
  name: 'Pycom Helium Hotspot (EU 868)',
  gain: 2.3,
} as MakerAntenna

export default { PYCOM_US, PYCOM_EU }
