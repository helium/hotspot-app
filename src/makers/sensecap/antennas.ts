import { MakerAntenna } from '../antennaMakerTypes'

const SENSECAP_US = {
  name: 'SenseCAP M1 (US 915)',
  gain: 1.2,
} as MakerAntenna

const SENSECAP_EU = {
  name: 'SenseCAP M1 (EU 868)',
  gain: 2.3,
} as MakerAntenna

export default { SENSECAP_US, SENSECAP_EU }
