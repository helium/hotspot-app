import HotspotIcon from '@assets/images/longap-one.svg'
import { MakerHotspot } from '../hotspotMakerTypes'
import ANTENNAS from './antennas'

const LONGAP_ONE = {
  name: 'LongAP One Hotspot',
  icon: HotspotIcon,
  translations: {
    en: {
      diagnostic:
        '<b><white>Diagnostic support allows LongAP to identify issues with your Hotspot in a secure way.</white></b>\n\nLongAP will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purple><b>support@longap.com</b></purple> from the email used to purchase the Hotspot.',
      power: [
        "Attach the antenna's and plug in the provided power adapter.",
        'The LongAP One PWR LED will light up once it’s powered on.',
      ],
      bluetooth: [
        'Use a paperclip to shortly press the button in the little hole right of the LEDs.',
        'Once the PWR LED is slowly blinking\n\nPress Next to scan.',
      ],
    },
  },
  antenna: {
    default: ANTENNAS.LONG_AP_ONE_EU,
  },
} as MakerHotspot

export default { LONGAP_ONE }
