import HotspotIcon from './cloudgate.svg'
import { MakerHotspot } from '../hotspotMakerTypes'
import ANTENNAS from './antennas'

const CloudGate = {
  name: 'CloudGate Hotspot',
  icon: HotspotIcon,
  onboardType: 'QR',
  onboardUrl: 'https://cloudgateuniverse.com/',
  translations: {
    en: {
      diagnostic:
        '<b><white>Diagnostic support allows CloudGate to identify issues with your Hotspot in a secure way.</white></b>\nCloudGate will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purple><b>support@option.com</b></purple> from the email used to purchase the Hotspot.',
      power: [
        'Attach the antenna and plug in the provided power adapter.',
        'The CloudGate LEDs will light up once it’s powered on.',
      ],
      externalOnboard: 'Visit the local management-console for QR-code',
    },
  },
  antenna: { default: ANTENNAS.CLOUDGATE },
} as MakerHotspot

export default { CloudGate }
