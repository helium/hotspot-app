import { MakerAntenna } from '../antennaMakerTypes'

const MIDAS_GATEWAY_US = {
  name: 'MIDAS_GATEWAY(US 915)',
  gain: 3,
} as MakerAntenna

const MIDAS_GATEWAY_EU = {
  name: 'MIDAS_GATEWAY (EU 868)',
  gain: 3,
} as MakerAntenna

const MIDAS_GATEWAY_CN = {
  name: 'MIDAS_GATEWAY (CN 470)',
  gain: 3,
} as MakerAntenna

export default { MIDAS_GATEWAY_US, MIDAS_GATEWAY_EU, MIDAS_GATEWAY_CN }
