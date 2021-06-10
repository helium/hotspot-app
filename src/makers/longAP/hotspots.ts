import HotspotIcon from '@assets/images/longap-one.svg'
import { MakerHotspot } from '../hotspotMakerTypes'
import ANTENNAS from './antennas'

const LONGAP_ONE = {
  name: 'LongAP One Hotspot',
  onboardType: 'BLE',
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
    ko: {
      diagnostic:
        '<b><white>LongAP는 진단 지원을 통해 안전한 방법으로 Hotspot에서 발생하는 문제를 식별할 수 있습니다.</white></b>\n\n LongAP는 개인 키에 대한 액세스 권한이 없으며 네트워크 내의 다른 장치를 제외하고 Hotspot에만 액세스할 수 있습니다.\n\n진단 지원 선택을 취소하려면 Hotspot을 구매할 때 사용한 이메일을 통해<purple><b> support@longap.com</b></purple>으로 이메일을 보내주시기 바랍니다.',
      power: [
        '안테나를 부착하고 제공된 전원 어댑터에 연결합니다.',
        '전원이 켜지면 LongAP One PWR LED가 켜집니다.',
      ],
      bluetooth: [
        '종이 클립을 사용하여 LED 오른쪽의 작은 구멍에 있는 버튼을 짧게 누릅니다.',
        '전원 LED가 천천히 깜박이면\n\n’다음’을 눌러 스캔합니다.',
      ],
    },
    zh: {
      diagnostic:
        '<b><white>Hotspot 诊断支持帮助 LongAP 安全确认您的 Hotspot 问题。</white></b>\n\nLongAP 绝不会访问私人密钥，且仅可访问您的 Hotspot，无法访问您网络中的任何其他设备。\n\n若选择退出诊断支持，请使用购买 Hotspot 时提供的电子邮箱发送请求至 <purple><b>support@longap.com</b></purple>。',
      power: [
        '连接天线并接通电源。',
        '开机后，LongAP One 将亮起 LED 电源指示灯。',
      ],
      bluetooth: [
        '使用回形针轻按 LED 指示灯右侧的小孔。',
        'LED 电源指示灯变成缓慢闪烁后，\n\n按“下一步”开始扫描。',
      ],
    },
  },
  antenna: {
    default: ANTENNAS.LONG_AP_ONE_EU,
  },
} as MakerHotspot

const LONGAP_PRO = {
  name: 'LongAP Pro Hotspot',
  icon: HotspotIcon,
  onboardType: 'QR',
  translations: {
    en: {
      diagnostic:
        '<b><white>Diagnostic support allows LongAP to identify issues with your Hotspot in a secure way.</white></b>\n\nLongAP will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purple><b>support@longap.com</b></purple> from the email used to purchase the Hotspot.',
      power: [
        "Attach the antenna's and plug in the provided power adapter.",
        'The LongAP Pro PWR LED will light up once it’s powered on.',
      ],
      qr: [
        'Visit dashboard.longap.com/onboard or the local management-console to generate a QR-code',
      ],
    },
  },
  antenna: {
    default: ANTENNAS.LONG_AP_ONE_EU,
  },
} as MakerHotspot

export default { LONGAP_ONE, LONGAP_PRO }
