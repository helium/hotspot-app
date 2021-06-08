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
    ja: {
      diagnostic:
        '<b><white>診断サポートにより、LongAPはHotspotの問題を安全な方法で特定できます。</white></b>\n\nLongAPが秘密キーにアクセスすることはありません。お使いのHotspotにのみアクセスし、ネットワーク上の他のデバイスにはアクセスしません。\n\n診断サポートをオプトアウトする場合は、Hotspotの購入時に使用したメールアドレスを使用して、<purple><b>support@longap.com</b></purple>までメールでご連絡ください。',
      power: [
        'アンテナを取り付け、付属の電源アダプターに差し込みます。',
        'LongAP Oneの電源を入れると、電源LEDが点灯します。',
      ],
      bluetooth: [
        'ペーパークリップを使用して、LEDの右側の小さな穴にあるボタンを短く押します。',
        '電源LEDがゆっくりと点滅します。\n\n「次へ」を押してスキャンします。',
      ],
    },
  },
  antenna: {
    default: ANTENNAS.LONG_AP_ONE_EU,
  },
} as MakerHotspot

export default { LONGAP_ONE }
