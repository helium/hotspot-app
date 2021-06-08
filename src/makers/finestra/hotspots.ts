import HotspotIcon from '@assets/images/finestra.svg'
import { MakerHotspot } from '../hotspotMakerTypes'
import ANTENNAS from './antennas'

const FINESTRA_MINER = {
  name: 'Finestra Miner',
  icon: HotspotIcon,
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
    ja: {
      diagnostic:
        '<b><white>診断サポートにより、FinestraはHotspotの問題を安全な方法で特定できます。</white></b>\n\nFinestraが秘密キーにアクセスすることはありません。お使いのHotspotにのみアクセスし、ネットワーク上の他のデバイスにはアクセスしません。\n\n診断サポートをオプトアウトする場合は、Hotspotの購入時に使用したメールアドレスを使用して、<purple><b>support@thefinestra.com</b></purple>までメールでご連絡ください。',
      power: [
        'アンテナを取り付け、窓の近くにある付属の電源アダプターに差し込みます。',
        'Finestra Minerの電源を入れると、青いLEDが点灯します。',
      ],
      bluetooth: [
        'Finestra Minerの電源がオンになると、自動的にBluetoothが5分間有効になります。\n\nHotspotが完全に起動するまでに最大で1分かかる場合があります。',
        'Finestra Minerの側面にあるボタンを押すと、5分後にBluetoothが有効になります',
      ],
    },
    ko: {
      diagnostic:
        '<b><white>Finestra는 진단 지원을 통해 안전한 방법으로 Hotspot에서 발생하는 문제를 식별할 수 있습니다.</white></b>\n\nFinestra는 개인 키에 대한 액세스 권한이 없으며 네트워크 내의 다른 장치를 제외하고 Hotspot에만 액세스할 수 있습니다.\n\n진단 지원 선택을 취소하려면 Hotspot을 구매할 때 사용한 이메일을 통해 <purple><b>support@thefinestra.com</b></purple>으로 이메일을 보내주시기 바랍니다.',
      power: [
        '안테나를 부착하고 창가 부근에 제공된 전원 어댑터를 연결합니다.',
        '전원이 켜지면 Finestra Miner에 파란색 LED 표시등이 켜집니다.',
      ],
      bluetooth: [
        'Finestra Miner의 전원이 켜진 후 5분 동안 Bluetooth가 자동으로 활성화됩니다.\n\nHotspot이 완전히 부팅되는 데 최대 1분이 소요될 수 있습니다.',
        'Finestra Miner 측면에 있는 버튼을 눌러 5분 후에 Bluetooth를 활성화할 수 있습니다.',
      ],
    },
    zh: {
      diagnostic: '',
      power: ['', ''],
      bluetooth: ['', ''],
    },
  },
  antenna: {
    default: ANTENNAS.FINESTRA_US,
  },
} as MakerHotspot

export default { FINESTRA_MINER }
