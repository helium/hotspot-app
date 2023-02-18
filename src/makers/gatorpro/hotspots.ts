import HotspotIcon from './Gatorpro-X1.svg'
import { MakerHotspot } from '../hotspotMakerTypes'
import ANTENNAS from './antennas'

const Gatorpro = {
  name: 'Gatorpro X1',
  icon: HotspotIcon,
  onboardType: 'BLE',
  translations: {
    en: {
      diagnostic:
        '<b><white>Diagnostic support allows Gator to identify issues with your Hotspot in a secure way.</white></b>\n\nGator will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purple><b>support@gatorproiot.com</b></purple> from the email used to purchase the Hotspot.',
      power: [
        'Attach the antenna and plug in the provided power adapter near a window.',
        'The Gatorpro Hotspot will have a solid yellow LED light up on the back of the Hotspot once powered on.',
      ],
      bluetooth: [
        'Bluetooth is automatically enabled for 10 minutes after the Gatorpro Hotspot is powered on.',
        'Alternatively, you can hold down the button on the back of the Gatorpro Hotspot for 10 seconds or until the green LED starts flashing.\n\nHotspot can take up to 1 minute to fully boot up.\n\nOnce the green LED is slowly blinking the Hotspot is ready to pair.\n\nPress Next to scan.',
      ],
    },
    ja: {
      diagnostic:
        '<b><white>診断サポートにより、Gator Hotspotの問題を安全な方法で特定できます。</white></b>\n\nGatorが秘密キーにアクセスすることはありません。お使いのHotspotにのみアクセスし、ネットワーク上の他のデバイスにはアクセスしません。\n\n診断サポートをオプトアウトする場合は、Hotspotの購入時に使用したメールアドレスを使用して、<purple><b>support@gatorproiot.com</b></purple>までメールでご連絡ください。',
      power: [
        'アンテナを取り付け、窓の近くにある付属の電源アダプターに差し込みます。',
        'Gatorpro Hotspotの電源を入れると、緑色のLEDが点灯します。',
      ],
      bluetooth: [
        'Gatorpro Hotspotの背面にあるボタンを、点滅し始めるまで押し続けます。',
        'ペアリングの準備が整うと、LEDがゆっくりと点滅します。\n\n「次へ」を押してスキャンします。',
      ],
    },
    ko: {
      diagnostic:
        '<b><white>Gator는 진단 지원을 통해 안전한 방법으로 Hotspot에서 발생하는 문제를 식별할 수 있습니다.</white></b>\n\nGator는 개인 키에 대한 액세스 권한이 없으며 네트워크 내의 다른 기기를 제외하고 Hotspot에만 액세스할 수 있습니다.\n\n진단 지원을 선택 취소하려면 Hotspot을 구매할 때 사용한 이메일을 통해 <purple><b>support@gatorproiot.com</b></purple>으로 이메일을 보내주시기 바랍니다.',
      power: [
        '안테나를 부착하고 창가 부근의 제공된 어댑터에 연결합니다.',
        '전원이 켜지면 Gatorpro Hotspot에 초록색 LED 표시등이 표시됩니다.',
      ],
      bluetooth: [
        '표시등이 깜빡거릴 때까지 Gatorpro Hotspot의 뒷면에 있는 버튼을 누르세요.',
        'LED가 천천히 깜박이면서 페어링할 준비가 된 것입니다.\n\n다음을 눌러 스캔합니다.',
      ],
    },
    zh: {
      diagnostic:
        '<b><white>诊断支持帮助 Gator 安全确认您的 Hotspot 问题。</white></b>\n\nGator 绝不会访问私人密钥，且仅可访问您的 Hotspot，无法访问您网络中的任何其他设备。\n\n若选择退出诊断支持，请使用购买 Hotspot 时提供的电子邮箱发送请求至 <purple><b>support@gatorproiot.com</b></purple>。',
      power: [
        '连接天线，将随附的电源适配器插入靠窗的插座。',
        '开机后，Gatorpro Hotspot 将亮起绿色 LED 指示灯。',
      ],
      bluetooth: [
        '长按 Gatorpro Hotspot 背面的按钮，直到它的指示灯开始闪烁。',
        'LED 指示灯变成缓慢闪烁后，即表示准备进行配对。\n\n按“下一步”开始扫描。',
      ],
    },
  },
  antenna: {
    us: ANTENNAS.Gatorpro_US,
    default: ANTENNAS.Gatorpro_EU,
  },
} as MakerHotspot

const GatorproX1QR = {
  name: 'Gatorpro X1 QR',
  icon: HotspotIcon,
  onboardType: 'QR',
  translations: {
    en: {
      diagnostic:
      '<b><white>Diagnostic support allows Gator to identify issues with your Hotspot in a secure way.</white></b>\n\nGator will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purple><b>support@gatorproiot.com</b></purple> from the email used to purchase the Hotspot.',
      power: [
        'Attach the antenna and plug in the provided power adapter near a window.',
        'The Gatorpro Hotspot will have a solid yellow LED light up on the back of the Hotspot once powered on.',
      ],
      externalOnboard: 'Your onboarding QR Code is included in the package',
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
    us: ANTENNAS.Gatorpro_US,
    default: ANTENNAS.Gatorpro_EU,
  },
} as MakerHotspot
export default {GatorproX1, GatorproX1QR}
