import HotspotIcon from './icon.svg'
import { MakerHotspot } from '../hotspotMakerTypes'
import ANTENNAS from './antennas'

const ExampleHotspotBLE = {
  name: 'Osprey Electronics Hotspot BLE',
  icon: HotspotIcon,
  onboardType: 'BLE',
  translations: {
    en: {
      internal: [
        {
          title: '[title.1]',
          body:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          button: '[next button - 1]',
        },
        {
          title: '[title.2]',
          body:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          button: '[next button - 2]',
        },
        {
          title: '[title.3]',
          body:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          button: '[finish button]',
        },
      ],
    },
    ja: {},
    ko: {},
    zh: {},
  },
  antenna: {
    us: ANTENNAS.EXAMPLE_US,
    default: ANTENNAS.EXAMPLE_EU,
  },
} as MakerHotspot

const ExampleHotspotQR = {
  name: 'Osprey Electronics Hotspot QR',
  icon: HotspotIcon,
  onboardType: 'QR',
  translations: {
    en: {
      externalOnboard: '[Your instructions here]',
    },
    ja: {},
    ko: {},
    zh: {},
  },
  antenna: {
    us: ANTENNAS.EXAMPLE_US,
    default: ANTENNAS.EXAMPLE_EU,
  },
} as MakerHotspot

export default { ExampleHotspotBLE, ExampleHotspotQR }
