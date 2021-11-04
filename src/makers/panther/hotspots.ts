import HotspotIcon from './panther.svg'
import { MakerHotspot } from '../hotspotMakerTypes'
import ANTENNAS from './antennas'

const PANTHER_X1 = {
  name: 'Panther X1',
  onboardType: 'BLE',
  translations: {
    en: {
      diagnostic:
        '<b><white>Diagnostic support allows Panther X to identify issues with your Hotspot in a secure way.</white></b>\n\nPanther X will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purple><b>service@panther.global</b></purple> from the email used to purchase the Hotspot.',
      power: [
        'Plug in the provided power adapter into an outlet near a window and screw in the provided antenna on the back of the Hotspot.',
        'The Panther X Hotspot will show a yellow LED light once it’s powered on. Hotspot can take up to 30 seconds to fully boot up.',
      ],
      bluetooth: [
        'Press and hold the SET button for 5 seconds to turn on Bluetooth.',
        'The hotspot is ready to pair when the light goes from yellow to blue.\n\nMake sure your phone’s Bluetooth is turned on!',
      ],
    },
    ja: {
      diagnostic:
        '<b><white>診断サポートにより、Panther XはHotspotの問題を安全な方法で特定できます。</white></b>\n\nPanther Xが秘密キーにアクセスすることはありません。お使いのHotspotにのみアクセスし、ネットワーク上の他のデバイスにはアクセスしません。\n\n診断サポートをオプトアウトする場合は、Hotspotの購入時に使用したメールアドレスを使用して、<purple><b>service@panther.global</b></purple>までメールでご連絡ください。',
      power: [
        '付属の電源アダプターを窓の近くにあるコンセントに差し込み、Hotspotの背面に付属のアンテナを回して取り付けます。',
        'Panther X Hotspotの電源を入れると、黄色のLEDライトが表示されます。ホットスポットが完全に起動するまでに最大30秒かかる場合があります。',
      ],
      bluetooth: [
        'SETボタンを5秒間押し続けると、Bluetoothがオンになります。',
        'ライトが黄色から青色に変わると、ホットスポットをペアリングする準備が整います。\n\nスマートフォンのBluetoothがオンになっていることを確認してください!',
      ],
    },
    ko: {
      diagnostic:
        '<b><white>Panther X 진단 지원을 통해 안전한 방법으로 Hotspot에서 발생하는 문제를 식별할 수 있습니다.</white></b>\n\nPanther X 은 개인 키에 대한 액세스 권한이 없으며 네트워크 내의 다른 기기를 제외하고 Hotspot에만 액세스할 수 있습니다.\n\n진단 지원을 선택 취소하려면 Hotspot을 구매할 때 사용한 이메일을 통해 <purple><b>service@panther.global</b></purple>으로 이메일을 보내주시기 바랍니다.',
      power: [
        '제공된 전원 어댑터를 창가 부근의 콘센트에 연결하고 제공된 안테나를 Hotspot 뒷면에 나사로 고정합니다.',
        'Panther X Hotspot은 전원이 켜지면 노란색 LED 표시등을 표시합니다. 핫스팟이 완전히 부팅되는 데 최대 30초가 걸릴 수 있습니다.',
      ],
      bluetooth: [
        'SET 버튼을 5초 동안 길게 누르면 블루투스가 켜집니다.',
        '표시등이 노란색에서 파란색으로 바뀌면 Hotspot이 페어링할 준비가 된 것입니다.\n\n휴대전화의 Bluetooth가 켜져 있는지 확인하세요!',
      ],
    },
    zh: {
      diagnostic:
        '<b><white>诊断支持允许Panther X以安全的方式识别您的热点遇到的问题。</white></b>\n\n Panther X绝不会访问私钥，且只会访问您的热点，而不会访问您网络中的任何其他设备。\n\n若您想关闭诊断支持，请使用购买热点时提供的电子邮箱发送请求至  <purple><b>service@panther.global</b></purple>。',
      power: [
        '将原装电源适配器插入插座，并将天线安装至热点背面并旋紧。',
        '开机后，热点将亮起黄色LED指示灯，设备完全启动需要等待约30秒钟。',
      ],
      bluetooth: [
        '长按热点背面的 SET 按钮5 秒钟。',
        '当指示灯由黄色变为蓝色，表示热点可以开始蓝牙配对。\n\n请保持手机蓝牙处于开启状态！',
      ],
    },
  },
  icon: HotspotIcon,
  antenna: { default: ANTENNAS.PANTHER },
} as MakerHotspot

const PANTHER_X2 = {
  name: 'Panther X2',
  onboardType: 'BLE',
  translations: {
    en: {
      diagnostic:
        '<b><white>Diagnostic support allows Panther X to identify issues with your Hotspot in a secure way.</white></b>\n\nPanther X will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purple><b>service@panther.global</b></purple> from the email used to purchase the Hotspot.',
      power: [
        'Plug in the provided power adapter into an outlet near a window and screw in the provided antenna on the back of the Hotspot.',
        'The Power LED indicator will light up, and the Status LED indicator will blink once Hotspot is powered on. Hotspot can take up to 30 seconds to fully boot up.',
      ],
      bluetooth: [
        'Press and hold the Bluetooth Connect button for 5 seconds to turn on Bluetooth.',
        'The hotspot is ready to pair when the  Bluetooth LED indicator light up.\n\nMake sure your phone’s Bluetooth is turned on!',
      ],
    },
    ja: {
      diagnostic:
        '<b><white>診断サポートにより、Panther XはHotspotの問題を安全な方法で特定できます。</white></b>\n\nPanther Xが秘密キーにアクセスすることはありません。お使いのHotspotにのみアクセスし、ネットワーク上の他のデバイスにはアクセスしません。\n\n診断サポートをオプトアウトする場合は、Hotspotの購入時に使用したメールアドレスを使用して、<purple><b>service@panther.global</b></purple>までメールでご連絡ください。',
      power: [
        '付属の電源アダプターを窓の近くにあるコンセントに差し込み、Hotspotの背面に付属のアンテナを回して取り付けます。',
        'ホットスポットの電源がオンになると、電源LEDインジケータが点灯し、ステータスLEDインジケータが点滅します。ホットスポットが完全に起動するまでに最大30秒かかる場合があります。',
      ],
      bluetooth: [
        'Bluetooth接続ボタンを5秒間押し続けて、Bluetoothをオンにします。',
        'Bluetooth LEDインジケータが点灯すると、ホットスポットをペアリングする準備ができています。\n\nスマートフォンのBluetoothがオンになっていることを確認してください!',
      ],
    },
    ko: {
      diagnostic:
        '<b><white>Panther X 진단 지원을 통해 안전한 방법으로 Hotspot에서 발생하는 문제를 식별할 수 있습니다.</white></b>\n\nPanther X 은 개인 키에 대한 액세스 권한이 없으며 네트워크 내의 다른 기기를 제외하고 Hotspot에만 액세스할 수 있습니다.\n\n진단 지원을 선택 취소하려면 Hotspot을 구매할 때 사용한 이메일을 통해 <purple><b>service@panther.global</b></purple>으로 이메일을 보내주시기 바랍니다.',
      power: [
        '제공된 전원 어댑터를 창가 부근의 콘센트에 연결하고 제공된 안테나를 Hotspot 뒷면에 나사로 고정합니다.',
        '핫스팟의 전원이 켜지면 전원 LED 표시등이 켜지고 상태 LED 표시등이 깜박입니다. 핫스팟이 완전히 부팅되는 데 최대 30초가 소요될 수 있습니다.',
      ],
      bluetooth: [
        'Bluetooth 연결 버튼을 5초 동안 길게 눌러 Bluetooth를 켭니다.',
        'Bluetooth LED 표시등이 켜지면 핫스팟을 페어링할 준비가 된 것입니다..\n\n휴대전화의 Bluetooth가 켜져 있는지 확인하세요!',
      ],
    },
    zh: {
      diagnostic:
        '<b><white>诊断支持允许Panther X以安全的方式识别您的热点遇到的问题。</white></b>\n\n Panther X绝不会访问私钥，且只会访问您的热点，而不会访问您网络中的任何其他设备。\n\n若您想关闭诊断支持，请使用购买热点时提供的电子邮箱发送请求至  <purple><b>service@panther.global</b></purple>。',
      power: [
        '将原装电源适配器插入插座，并将天线安装至热点背面并旋紧。',
        '开机后，电源指示灯将亮起，且状态指示灯将闪烁，设备完全启动需要等待约30秒钟。',
      ],
      bluetooth: [
        '长按热点背面的蓝牙按钮5秒钟。',
        '当蓝牙指示灯亮起，表示热点可以开始蓝牙配对。\n\n请保持手机蓝牙处于开启状态！',
      ],
    },
  },
  icon: HotspotIcon,
  antenna: { default: ANTENNAS.PANTHER },
} as MakerHotspot

export default { PANTHER_X1, PANTHER_X2 }
