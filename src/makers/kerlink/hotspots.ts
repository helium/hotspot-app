import HotspotIcon_iFemto from './ifemto.svg'
import HotspotIcon_iFemtoEvo from './ifemto_evo.svg'
import HotspotIcon_iStation from './istation.svg'
import { MakerHotspot } from '../hotspotMakerTypes'
import ANTENNAS from './antennas'

const externalOnboard =
  'Please visit the following URL from your computer or directly on your phone by selecting the link below:'

const onboardUrl = 'https://helium-onboarding.kerlink.com/?wallet=WALLET'

const KERLINK_IFEMTO = {
  name: 'Kerlink iFemtoCell',
  onboardType: 'QR',
  icon: HotspotIcon_iFemto,
  onboardUrl,
  translations: {
    en: {
      diagnostic:
        '<b><white>Diagnostic support allows Kerlink to identify issues with your Hotspot in a secure way.</white></b>\n\nKerlink will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purple><b>support@helium.com</b></purple> from the email used to purchase the Hotspot.',
      power: [
        'Attach the antenna and plug in the provided power adapter.',
        'Your Hotspot will boot up, and its light will become Green when ready.',
      ],
      externalOnboard,
    },
  },
  antenna: {
    default: ANTENNAS.KERLINK_IFEMTO,
  },
} as MakerHotspot

const KERLINK_IFEMTO_EVO = {
  name: 'Kerlink iFemtoCell Evolution',
  onboardType: 'QR',
  onboardUrl,
  icon: HotspotIcon_iFemtoEvo,
  translations: {
    en: {
      diagnostic:
        '<b><white>Diagnostic support allows Kerlink to identify issues with your Hotspot in a secure way.</white></b>\n\nKerlink will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purple><b>support@helium.com</b></purple> from the email used to purchase the Hotspot.',
      power: [
        'Attach the antenna and plug in the provided power adapter.',
        'Your Hotspot will boot up, and its light will become Green when ready.',
      ],
      externalOnboard,
    },
  },
  antenna: {
    default: ANTENNAS.KERLINK_IFEMTO_EVO,
  },
} as MakerHotspot

const KERLINK_ISTATION = {
  name: 'Kerlink iStation',
  onboardUrl,
  onboardType: 'QR',
  icon: HotspotIcon_iStation,
  translations: {
    en: {
      diagnostic:
        '<b><white>Diagnostic support allows Kerlink to identify issues with your Hotspot in a secure way.</white></b>\n\nKerlink will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purple><b>support@helium.com</b></purple> from the email used to purchase the Hotspot.',
      power: [
        'Attach the antenna and plug in the provided power adapter.',
        'Your Hotspot will boot up, and its light will become Green when ready.',
      ],
      externalOnboard,
    },
  },
  antenna: {
    default: ANTENNAS.KERLINK_ISTATION_EU,
    us: ANTENNAS.KERLINK_ISTATION_US,
  },
} as MakerHotspot

export default { KERLINK_IFEMTO, KERLINK_IFEMTO_EVO, KERLINK_ISTATION }
