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
        'Your Hotspot will boot up. The blue LED will blink once for 1 second when done.',
      ],
      bluetooth: [
        'After you see the blue LED light up 3 TIMES, press the button below to start pairing.',
        'If you cannot see it in the app, try scanning again. If it fails multiple times, unplug the power cable and plug it in to start the process again.',
      ],
    },
  },
  antenna: {
    default: ANTENNAS.CONTROLLINO_EU,
  },
} as MakerHotspot

export default { ControllinoHotspot }
