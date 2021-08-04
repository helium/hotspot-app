import HotspotIcon from './clodpi-pro.svg'
import { MakerHotspot } from '../hotspotMakerTypes'
import ANTENNAS from './antennas'

const ClodPi = {
  name: 'ClodPi Pro Hotspot',
  icon: HotspotIcon,
  onboardType: 'QR',
  onboardUrl: 'https://hotspot.clodpi.io/dashboard',
  translations: {
    en: {
      diagnostic:
                '<b><white>Diagnostic support allows ClodPi to identify issues with your Hotspot in a secure way.</white></b>\nClodPi will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purple><b>support@clodpi.io</b></purple> from the email used to purchase the Hotspot.',

      power: [
        'Attach the antenna and plug in the provided power adapter.',
        'The ClodPi Pro PWR LED will light up once it’s powered on.',
      ],
      externalOnboard:
        'Visit the local management-console for QR-code',
    },
  },
  antenna: { default: ANTENNAS.CLODPI },
} as MakerHotspot

export default { ClodPi }
