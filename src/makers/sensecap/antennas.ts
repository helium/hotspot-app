import { MakerAntenna } from '../antennaMakerTypes'

const SENSECAP_US = {
  name: 'SenseCAP M1 (US 915)',
  gain: 2.6,
} as MakerAntenna

const SENSECAP_EU = {
  name: 'SenseCAP M1 (EU 868)',
  gain: 2.8,
} as MakerAntenna

const SENSECAP_AU = {
  name: 'SenseCAP M1 (AU 915)',
  gain: 2.6,
} as MakerAntenna

export default { SENSECAP_US, SENSECAP_EU, SENSECAP_AU }
