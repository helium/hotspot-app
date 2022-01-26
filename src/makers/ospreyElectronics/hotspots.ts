import HotspotIcon from './icon.svg'
import { MakerHotspot } from '../hotspotMakerTypes'
import ANTENNAS from './antennas'

const OspreyHotspotBLE = {
  name: 'Osprey Electronics Hotspot',
  icon: HotspotIcon,
  onboardType: 'BLE',
  translations: {
    en: {
      diagnostic: 
        '<b><white>Diagnostic support allows Osprey Electronic to identify issues with your Hotspot in a secure way.</white></b>\n\n Osprey Electronic will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purple><b>support@ingenioussafety.com</b></purple> from the email used to purchase the Hotspot.',
      power: [
        'Plug in the power cable as described in the user manual.',
        '',
      ],
      bluetooth: [
        'There is no pairing button on the Osprey Electronic Hotspot Miner.',
        'Bluetooth is automatically enabled for 5 minutes after the Osprey Electronic Hotspot Miner is powered on.\n\nHotspot can take up to 1 minute to fully boot up.',
      ],
    },
    ja: {},
    ko: {},
    zh: {},
  },
  antenna: {
    us: ANTENNAS.ELECTRONICS_HOTSPOT_US,
    default: ANTENNAS.ELECTRONICS_HOTSPOT_EU,
  },
} as MakerHotspot

export default { OspreyHotspotBLE }
