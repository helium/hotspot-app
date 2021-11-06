import Hotspot65Icon from './hotspot_65.svg'
import Hotspot67Icon from './hotspot_67.svg'
import { MakerHotspot } from '../hotspotMakerTypes'
import ANTENNAS from './antennas'

const MilesightHotspotUG65 = {
  name: 'Milesight Hotspot UG65',
  icon: Hotspot65Icon,
  onboardType: 'QR',
  translations: {
    en: {
      diagnostic:
        '<b><white>Diagnostic support allows Milesight to identify issues with your Hotspot in a secure way.</white></b>\n\nMilesight will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purple><b>iot.support@milesight.com</b></purple> from the email used to purchase the Hotspot.',
      power: [
        'Attach the antenna and plug in the provided power adapter.',
        'Your Hotspot will boot up, and its Status LED will become Blue when ready.',
      ],
      externalOnboard:
        'You can find the QR code either directly on your product or on the box you received, and you can also visit the local management-console to get the QR code.',
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
    default: ANTENNAS.MILESIGHT_UG65,
  },
} as MakerHotspot

const MilesightHotspotUG67 = {
  name: 'Milesight Hotspot UG67',
  icon: Hotspot67Icon,
  onboardType: 'QR',
  translations: {
    en: {
      diagnostic:
        '<b><white>Diagnostic support allows Milesight to identify issues with your Hotspot in a secure way.</white></b>\n\nMilesight will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purple><b>iot.support@milesight.com</b></purple> from the email used to purchase the Hotspot.',
      power: [
        'Attach the antenna and plug in the provided power adapter.',
        'Your Hotspot will boot up, and its System LED will become Green when ready.',
      ],
      externalOnboard:
        'You can find the QR code either directly on your product or on the box you received, and you can also visit the local management-console to get the QR code.',
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
    default: ANTENNAS.MILESIGHT_UG67,
  },
} as MakerHotspot

export default { MilesightHotspotUG65, MilesightHotspotUG67 }
