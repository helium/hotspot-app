import { MakerAntenna } from '../antennaMakerTypes'

const MIDAS_GATEWAY_US = {
  name: 'MIDAS_GATEWAY(US 915)',
  gain: 1.2,
} as MakerAntenna

const MIDAS_GATEWAY_EU = {
  name: 'MIDAS_GATEWAY (EU 868)',
  gain: 2.3,
} as MakerAntenna

export default { MIDAS_GATEWAY_US, MIDAS_GATEWAY_EU }
