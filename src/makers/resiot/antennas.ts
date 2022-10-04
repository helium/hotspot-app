import { MakerAntenna } from '../antennaMakerTypes'

const STANDARD_EU = {
  name: 'Indoor/Outdoor 3dBi (EU 868)',
  gain: 3,
} as MakerAntenna

const OUTDOOR68_EU = {
  name: 'Outdoor 6.8dBi (EU 868)',
  gain: 6.8,
} as MakerAntenna

const OUTDOOR80_EU = {
  name: 'Outdoor 8dBi (EU 868)',
  gain: 8,
} as MakerAntenna

const OUTDOOR100_EU = {
  name: 'Outdoor 10dBi (EU 868)',
  gain: 10,
} as MakerAntenna

const OUTDOOR120_EU = {
  name: 'Outdoor 12dBi (EU 868)',
  gain: 12,
} as MakerAntenna

const OUTDOOR150_EU = {
  name: 'Outdoor 15dBi (EU 868)',
  gain: 15,
} as MakerAntenna

export default { STANDARD_EU, OUTDOOR68_EU, OUTDOOR80_EU, OUTDOOR100_EU, OUTDOOR120_EU, OUTDOOR150_EU }