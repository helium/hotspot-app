import { MakerAntenna } from './antennaMakerTypes'

const RAK_US = {
  name: 'RAK Hotspot Miner (US 915)',
  gain: 2.3,
} as MakerAntenna

const RAK_EU = {
  name: 'RAK Hotspot Miner (EU 868)',
  gain: 2.8,
} as MakerAntenna

const RAK_CUSTOM = {
  name: 'RAK Antenna',
  gain: 5.8,
} as MakerAntenna

export default { RAK_US, RAK_EU, RAK_CUSTOM }
