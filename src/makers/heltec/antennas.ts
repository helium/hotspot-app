import { MakerAntenna } from '../antennaMakerTypes'

const HELTEC_HOTSPOT = {
  name: 'Heltec Hostpot (all)',
  gain: 3.5,
} as MakerAntenna

const HELTEC_CUSTOM_6 = {
  name: 'Heltec Custom (6dB)',
  gain: 6,
} as MakerAntenna

const HELTEC_CUSTOM_8 = {
  name: 'Heltec Custom (8.5dB)',
  gain: 8.5,
} as MakerAntenna

const HELTEC_CUSTOM_10 = {
  name: 'Heltec Custom (10.5dB)',
  gain: 10.5,
} as MakerAntenna

export default {
  HELTEC_HOTSPOT,
  HELTEC_CUSTOM_6,
  HELTEC_CUSTOM_8,
  HELTEC_CUSTOM_10,
}
