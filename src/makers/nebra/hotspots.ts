import IndoorHotspotIcon from './nebra-in.svg'
import OutdoorHotspotIcon from './nebra-out.svg'
import { MakerHotspot } from '../hotspotMakerTypes'
import ANTENNAS from './antennas'

const NEBRA_INDOOR = {
  name: 'Nebra Indoor Hotspot',
  onboardType: 'BLE',
  translations: {
    en: {
      diagnostic:
        '<b><white>Diagnostic support allows Nebra LTD to identify issues with your Hotspot in a secure way.</white></b>\n\nNebra will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purple><b>support@nebra.com</b></purple> from the email used to purchase the Hotspot.',
      power: [
        'Attach the antenna and plug in the provided power adapter near a window.',
        'The Nebra Indoor Hotspot will have a green LED light up once it’s powered on.',
      ],
      bluetooth: [
        'Hold down the button on the back of the Nebra Indoor Hotspot until it starts flashing.',
        'Once the LED is slowly blinking and is ready to pair.\n\nPress Next to scan.',
      ],
    },
    ja: {
      diagnostic:
        '<b><white>診断サポートにより、Nebra LTDはHotspotの問題を安全な方法で特定できます。</white></b>\n\nNebraが秘密キーにアクセスすることはありません。お使いのHotspotにのみアクセスし、ネットワーク上の他のデバイスにはアクセスしません。\n\n診断サポートをオプトアウトする場合は、Hotspotの購入時に使用したメールアドレスを使用して、<purple><b>support@nebra.com</b></purple>までメールでご連絡ください。',
      power: [
        'アンテナを取り付け、窓の近くにある付属の電源アダプターに差し込みます。',
        'Nebra Indoor Hotspotの電源を入れると、緑色のLEDが点灯します。',
      ],
      bluetooth: [
        'Nebra Indoor Hotspotの背面にあるボタンを、点滅し始めるまで押し続けます。',
        'ペアリングの準備が整うと、LEDがゆっくりと点滅します。\n\n「次へ」を押してスキャンします。',
      ],
    },
    ko: {
      diagnostic:
        '<b><white>Nebra LTD는 진단 지원을 통해 안전한 방법으로 Hotspot에서 발생하는 문제를 식별할 수 있습니다.</white></b>\n\nNebra는 개인 키에 대한 액세스 권한이 없으며 네트워크 내의 다른 기기를 제외하고 Hotspot에만 액세스할 수 있습니다.\n\n진단 지원을 선택 취소하려면 Hotspot을 구매할 때 사용한 이메일을 통해 <purple><b>support@nebra.com</b></purple>으로 이메일을 보내주시기 바랍니다.',
      power: [
        '안테나를 부착하고 창가 부근의 제공된 어댑터에 연결합니다.',
        '전원이 켜지면 Nebra Indoor Hotspot에 초록색 LED 표시등이 표시됩니다.',
      ],
      bluetooth: [
        '표시등이 깜빡거릴 때까지 Nebra Indoor Hotspot의 뒷면에 있는 버튼을 누르세요.',
        'LED가 천천히 깜박이면서 페어링할 준비가 된 것입니다.\n\n다음을 눌러 스캔합니다.',
      ],
    },
    zh: {
      diagnostic:
        '<b><white>诊断支持帮助 Nebra LTD 安全确认您的 Hotspot 问题。</white></b>\n\nNebra 绝不会访问私人密钥，且仅可访问您的 Hotspot，无法访问您网络中的任何其他设备。\n\n若选择退出诊断支持，请使用购买 Hotspot 时提供的电子邮箱发送请求至 <purple><b>support@nebra.com</b></purple>。',
      power: [
        '连接天线，将随附的电源适配器插入靠窗的插座。',
        '开机后，Nebra Indoor Hotspot 将亮起绿色 LED 指示灯。',
      ],
      bluetooth: [
        '长按 Nebra Indoor Hotspot 背面的按钮，直到它的指示灯开始闪烁。',
        'LED 指示灯变成缓慢闪烁后，即表示准备进行配对。\n\n按“下一步”开始扫描。',
      ],
    },
  },
  icon: IndoorHotspotIcon,
  antenna: { default: ANTENNAS.NEBRA_INDOOR },
} as MakerHotspot

const NEBRA_OUTDOOR = {
  name: 'Nebra Outdoor Hotspot',
  onboardType: 'BLE',
  translations: {
    en: {
      diagnostic:
        '<b><white>Diagnostic support allows Nebra LTD to identify issues with your Hotspot in a secure way.</white></b>\n\nNebra will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purple><b>support@nebra.com</b></purple> from the email used to purchase the Hotspot.',
      power: [
        'Attach the antenna and connect to an appropriate power source.',
        'The Nebra Outdoor Hotspot will have multiple lights come on once it’s powered on.',
      ],
      bluetooth: [
        'There is no pairing button on the Nebra Outdoor Hotspot.',
        'Bluetooth is automatically enabled for 10 minutes after the Nebra Outdoor Hotspot is powered on.\n\nHotspot can take up to 1 minute to fully boot up.',
      ],
    },
    ja: {
      diagnostic:
        '<b><white>診断サポートにより、Nebra LTDはHotspotの問題を安全な方法で特定できます。</white></b>\n\nNebraが秘密キーにアクセスすることはありません。お使いのHotspotにのみアクセスし、ネットワーク上の他のデバイスにはアクセスしません。\n\n診断サポートをオプトアウトする場合は、Hotspotの購入時に使用したメールアドレスを使用して、<purple><b>support@nebra.com</b></purple>までメールでご連絡ください。',
      power: [
        'アンテナを取り付け、適切な電源に接続します。',
        'Nebra Outdoor Hotspotの電源を入れると、複数のLEDが点灯します。',
      ],
      bluetooth: [
        'Nebra Outdoor Hotspotにペアリングボタンはありません。',
        'Nebra Outdoor Hotspotの電源がオンになると、自動的にBluetoothが10分間有効になります。\n\nHotspotが完全に起動するまでに最大で1分かかる場合があります。',
      ],
    },
    ko: {
      diagnostic:
        '<b><white>Nebra LTD는 진단 지원을 통해 안전한 방법으로 Hotspot에서 발생하는 문제를 식별할 수 있습니다.</white></b>\n\nNebra는 개인 키에 대한 액세스 권한이 없으며 네트워크 내의 다른 기기를 제외하고 Hotspot에만 액세스할 수 있습니다.\n\n진단 지원을 선택 취소하려면 Hotspot을 구매할 때 사용한 이메일을 통해 <purple><b>support@nebra.com</b></purple>으로 이메일을 보내주시기 바랍니다.',
      power: [
        '안테나를 부착하고 적합한 전원에 연결합니다.',
        '전원이 켜지면 Nebra Outdoor Hotspot에 여러 개의 표시등이 표시됩니다.',
      ],
      bluetooth: [
        'Nebra Outdoor Hotspot에는 페어링 버튼이 없습니다.',
        'Nebra Outdoor Hotspot의 전원이 켜진 후 10분 동안 Bluetooth가 자동으로 활성화됩니다.\n\nHotspot이 완전히 부팅되는 데 최대 1분이 소요될 수 있습니다.',
      ],
    },
    zh: {
      diagnostic:
        '<b><white>诊断支持帮助 Nebra LTD 安全确认您的 Hotspot 问题。</white></b>\n\nNebra 绝不会访问私人密钥，且仅可访问您的 Hotspot，无法访问您网络中的任何其他设备。\n\n若选择退出诊断支持，请使用购买 Hotspot 时提供的电子邮箱发送请求至 <purple><b>support@nebra.com</b></purple>。',
      power: [
        '连接天线并正确连接电源。',
        '开机后，Nebra Outdoor Hotspot 将陆续亮起多个指示灯。',
      ],
      bluetooth: [
        'Nebra Outdoor Hotspot 上没有配对按钮。',
        'Nebra Outdoor Hotspot 开机后，蓝牙会自动启用 10 分钟。\n\nHotspot 最多需要 1 分钟即可完全启动。',
      ],
    },
  },
  icon: OutdoorHotspotIcon,
  antenna: { default: ANTENNAS.NEBRA_INDOOR },
} as MakerHotspot

export default { NEBRA_INDOOR, NEBRA_OUTDOOR }
