import HeltecIndoorIcon from './Heltec_Indoor.svg'
import { MakerHotspot } from '../hotspotMakerTypes'
import ANTENNAS from './antennas'

const HELTEC_INDOOR = {
  name: 'Heltec Indoor Hotspot',
  icon: HeltecIndoorIcon,
  onboardType: 'BLE',
  translations: {
    en: {
      diagnostic:
        '<b><white>Diagnostic support allows Heltec Automation to identify issues with your Hotspot in a secure way.</white></b>\n\nHeltec will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purple><b>support@heltec.cn</b></purple> from the email used to purchase the Hotspot.',
      power: [
        'Attach the antenna and plug in the provided power adapter',
        'Once powered on, the Heltec Indoor Hotspot will light up several indicators one after another. \n\nStartup takes about 30 seconds, and when the yellow indicator is on or blinking, the system is completely ready to work.',
      ],
      bluetooth: [
        'There is no Bluetooth pairing button on the Heltec Indoor Hotspot.',
        'Bluetooth is automatically enabled for 5 minutes when the Heltec Indoor Hotspot is ready.\n\nWhen the blue indicator on the power button blinks, bluetooth is ready to pair.',
      ],
    },
    ja: {
      diagnostic:
        '<b><white>診断サポートにより、HeltecはHotspotの問題を安全な方法で特定できます。</white></b>\n\nHeltecが秘密キーにアクセスすることはありません。お使いのHotspotにのみアクセスし、ネットワーク上の他のデバイスにはアクセスしません。\n\n診断サポートをオプトアウトする場合は、Hotspotの購入時に使用したメールアドレスを使用して、<purple><b>support@heltec.cn</b></purple>までメールでご連絡ください。',
      power: [
        'アンテナを取り付け、適切な電源に接続します。',
        'Heltec Indoor Hotspotの電源を入れると、複数のLEDが点灯します。\n\n起動はやく30秒必要で、黄色パイロットランプ信号が出てあるいは閃いて、システム起動完成。',
      ],
      bluetooth: [
        'Heltec Indoor Hotspotにペアリングボタンはありません。',
        'Heltec Indoor Hotspotの電源がオンになると、自動的にBluetoothが5分間有効になります。\n\n電源ボダンにある青いランプが点滅になるとブルートォースが起動し、接続ができる。',
      ],
    },
    ko: {
      diagnostic:
        '<b><white>Heltec은 진단 지원을 통해 안전한 방법으로 Hotspot에서 발생하는 문제를 식별할 수 있습니다.</white></b>\n\nHeltec은 개인 키에 대한 액세스 권한이 없으며 네트워크 내의 다른 기기를 제외하고 Hotspot에만 액세스할 수 있습니다.\n\n진단 지원을 선택 취소하려면 Hotspot을 구매할 때 사용한 이메일을 통해 <purple><b>support@heltec.cn</b></purple>으로 이메일을 보내주시기 바랍니다.',
      power: [
        '안테나를 부착하고 적합한 전원에 연결합니다.',
        '전원이 켜지면 Heltec Indoor Hotspot에 여러 개의 표시등이 표시됩니다.\n\n시작하는 데 약 30초가 소요됩니다. 노란색 표시등이 켜지거나 깜박이면 시스템이 시작됩니다.',
      ],
      bluetooth: [
        'Heltec Indoor Hotspot에는 페어링 버튼이 없습니다.',
        'Heltec Indoor Hotspot의 전원이 켜진 후 5분 동안 Bluetooth가 자동으로 활성화됩니다.\n\n전원 버튼의 파란색 표시등이 깜박이면 블루투스가 활성화되어 페어링을 시작할 수 있음을 의미합니다.',
      ],
    },
    zh: {
      diagnostic:
        '<b><white>Hotspot 诊断支持允许 Heltec Automation 安全确认您的 Hotspot 问题。</white></b>\n\nHeltec 绝不会访问私人密钥，且仅可访问您的 Hotspot，无法访问您网络中的任何其他设备。\n\n若选择退出诊断支持，请使用购买 Hotspot 时提供的电子邮箱发送请求至 <purple><b>support@heltec.cn</b></purple>。',
      power: [
        '连接天线并正确连接电源。',
        '开机后, Heltec Indoor Hotspot 将陆续亮起多个指示灯。\n\n启动需要大约30秒，当黄灯亮起或者闪烁时，系统启动完成。',
      ],
      bluetooth: [
        'Heltec Indoor Hotspot 上没有配对蓝牙按钮。',
        'Heltec Indoor Hotspot 开机后，蓝牙会自动启用 5 分钟。\n\n当电源按钮上的蓝灯闪烁时表示蓝牙已启动，可以开始配对。',
      ],
    },
  },
  antenna: {
    default: ANTENNAS.HELTEC_HOTSPOT,
  },
} as MakerHotspot

export default { HELTEC_INDOOR }
