import HotspotIcon from '@assets/images/finestra.svg'
import { MakerHotspot } from '../hotspotMakerTypes'
import ANTENNAS from './antennas'

const FINESTRA_MINER = {
  name: 'Finestra Miner',
  icon: HotspotIcon,
  onboardType: 'BLE',
  translations: {
    en: {
      diagnostic:
        '<b><white>Diagnostic support allows Finestra to identify issues with your Hotspot in a secure way.</white></b>\n\nFinestra will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purple><b>support@thefinestra.com</b></purple> from the email used to purchase the Hotspot.',
      power: [
        'Attach the antenna and plug in the provided power adapter near a window.',
        'The Finestra Miner will show a blue LED light once it’s powered on.',
      ],
      bluetooth: [
        'Bluetooth is automatically enabled for 5 minutes after the Finestra Miner is powered on.\n\nHotspot can take up to 1 minute to fully boot up.',
        'You can enable Bluetooth after 5 minutes by pressing the button on the side of the Finestra Miner',
      ],
    },
  },
  antenna: {
    default: ANTENNAS.FINESTRA_US,
  },
} as MakerHotspot

export default { FINESTRA_MINER }
