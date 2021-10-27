import { MakerAntenna } from '../antennaMakerTypes'

const MILESIGHT_UG65 = {
  name: 'Milesight_2dBi',
  gain: 2,
} as MakerAntenna

const MILESIGHT_UG67 = {
  name: 'Milesight_5dBi',
  gain: 5,
} as MakerAntenna

const Custom7dBi = {
  name: 'Milesight_7dBi',
  gain: 7,
} as MakerAntenna

const Custom8dBi = {
  name: 'Milesight_8dBi',
  gain: 8,
} as MakerAntenna

export default {
  MILESIGHT_UG65,
  MILESIGHT_UG67,
  Custom7dBi,
  Custom8dBi,
}