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
        'Your Hotspot will boot up. Wait for 5 minutes until the blue LED lights up.',
      ],
      bluetooth: [
        'After the Blue LED blinks 3 TIMES, press the button below to start pairing.',
        'If you cannot see it in the app, try scanning again. If it fails multiple times, turn your bluetooth off and on and retry. If it fails, plug the hotspot out of power and power it again.',
      ],
    },
  },
  antenna: {
    default: ANTENNAS.CONTROLLINO_EU,
  },
} as MakerHotspot

const ControllinoHotspotQR = {
  name: 'Controllino Hotspot QR',
  icon: HotspotIcon,
  onboardType: 'QR',
  translations: {
    en: {
      diagnostic:
        '<b><white>Diagnostic support allows Controllino to identify issues with your Hotspot in a secure way.</white></b>\n\nControllino will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purple><b>helium@controllino.com</b></purple> from the email used to purchase the Hotspot.',
      power: [
        'Attach the antenna and plug in the power cable as described in the user manual.',
        'Your Hotspot will boot up. Wait for 5 minutes until the blue LED lights up.',
      ],
      externalOnboard: 'Your onboarding QR Code is included in the package',
    },
    ja: {
      // TODO: Translate strings for diagnostic, power, and bluetooth
    },
    ko: {
      // TODO: Translate strings for diagnostic, power, and bluetooth
    },
    zh: {
      // TODO: Translate strings for diagnostic, power, and bluetooth
    },
  },
  antenna: {
    default: ANTENNAS.CONTROLLINO_EU,
  },
} as MakerHotspot

export default { ControllinoHotspot, ControllinoHotspotQR }
