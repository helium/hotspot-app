import { MakerAntenna } from '../antennaMakerTypes'

const COTX_US = {
  name: 'COTX Gateway Miner (US 915)',
  gain: 3.6,
} as MakerAntenna

const COTX_EU = {
  name: 'COTX Gateway Miner (EU 868)',
  gain: 2.9,
} as MakerAntenna

const COTX_CN = {
  name: 'COTX Gateway Miner (CN 470)',
  gain: 2.8,
} as MakerAntenna

export default { COTX_US, COTX_EU, COTX_CN }
