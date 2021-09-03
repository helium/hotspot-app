import HotspotIcon from './controllinohotspot.svg'
import { MakerHotspot } from '../hotspotMakerTypes'
import ANTENNAS from './antennas'

const ControllinoHotspot = {
  name: 'Controllino Hotspot',
  icon: HotspotIcon,
  onboardType: 'BLE',
  translations: {
    en: {
      diagnostic:
        '<b><white>Diagnostic support allows Controllino to identify issues with your Hotspot in a secure way.</white></b>\n\nControllino will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purple><b>hotspotsupport@controllino.com</b></purple> from the email used to purchase the Hotspot.',
      power: [
        'Attach the antenna and plug in the power cable as described in the user manual.',
        'Your Hotspot will boot up and is  ready in around 5 minutes.',
      ],
      bluetooth: [
        'After roughly 5 minutes after plugging in the Hotspot, you should see it as Bluetooth device on your phone.',
        'If you cannot see the Hotspot after a few minutes, unplug the power cable and plug it in again.',
      ],
    },
  },
  antenna: {
    default: ANTENNAS.CONTROLLINO_EU,
  },
} as MakerHotspot

export default { ControllinoHotspot }
