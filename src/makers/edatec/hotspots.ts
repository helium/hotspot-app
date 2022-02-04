import HotspotIcon from './hotspot.svg'
import { MakerHotspot } from '../hotspotMakerTypes'
import ANTENNAS from './antennas'

const EDAIoTHotspotBLE = {
  name: 'EDA-IoT Indoor Hotspot',
  icon: HotspotIcon,
  onboardType: 'BLE',
  translations: {
    en: {
      diagnostic:
        '<b><white>Diagnostic support allows EDATEC to identify issues with your EDA-IoT Hotspot in a secure way.</white></b>\n\nEDATEC will never have access to private keys and will only ever be able to access your EDA-IoT Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purple><b>support@edatec.cn</b></purple> from the email used to purchase the Hotspot.',
      power: [
        'Attach the antenna and plug in the provided power adapter.',
        'Your EDA-IoT Hotspot will boot up, and its light will become Green when ready.',
      ],
      bluetooth: [
        'Press the black button on your EDA-IoT Hotspot. Its light should turn blue.',
        "Ensure your phone's bluetooth is on before proceeding",
      ],
    },
  },
  antenna: {
    default: ANTENNAS.EDAIOT_2P5,
  },
} as MakerHotspot

export default { EDAIoTHotspotBLE }
