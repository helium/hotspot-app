import { MakerAntenna } from '../antennaMakerTypes'

const MIDAS_GATEWAY_US = {
  name: 'Midas-926 Gateway (US 915)',
  gain: 3,
} as MakerAntenna

const MIDAS_GATEWAY_EU = {
  name: 'Midas-926 Gateway (EU 868)',
  gain: 3,
} as MakerAntenna

const MIDAS_GATEWAY_CN = {
  name: 'Midas-926 Gateway (CN 470)',
  gain: 3,
} as MakerAntenna

export default { MIDAS_GATEWAY_US, MIDAS_GATEWAY_EU, MIDAS_GATEWAY_CN }
