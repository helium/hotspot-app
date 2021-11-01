import HotspotIcon from './dusun.svg'
import { MakerHotspot } from '../hotspotMakerTypes'
import ANTENNAS from './antennas'

const DusunHotspotBLE = {
  name: 'Dusun Hotspot',
  icon: HotspotIcon,
  onboardType: 'BLE',
  translations: {
    en: {
      diagnostic:
        '<b><white>Diagnostic support allows Helium Maker to identify issues with your Hotspot in a secure way.</white></b>\n\nHelium Maker will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purple><b>support@helium.com</b></purple> from the email used to purchase the Hotspot.',
      power: [
        'Attach the antenna and plug in the provided power adapter.',
        'Your Hotspot will boot up, and its light will become Blue when ready.',
      ],
      bluetooth: [
        'Press the black button on your Hotspot. Its light should turn blue.',
        "Ensure your phone's bluetooth is on before proceeding",
      ],
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
    us: ANTENNAS.DUSUN_US,
    default: ANTENNAS.DUSUN_EU,
  },
} as MakerHotspot

export default { DusunHotspotBLE }
