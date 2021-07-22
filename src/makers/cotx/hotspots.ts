import HotspotIcon from './cotx.svg'
import { MakerHotspot } from '../hotspotMakerTypes'
import ANTENNAS from './antennas'

const COTX_V1 = {
  name: 'COTX Gateways',
  onboardType: 'BLE',
  translations: {
    en: {
      diagnostic:
        '<b><white>Diagnostic support allows COTX Gateway to identify issues with your Hotspot in a secure way.</white></b>\n\nCOTX Gateway will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purple><b>support@cotxnetworks.com</b></purple> from the email used to purchase the Hotspot.',
      power: [
        'Plug in the provided power adapter into an outlet near a window and screw in the provided antenna on the back of the Hotspot.',
        'After power on the COTX Gateway Miner, information will be shown on the display screen.',
      ],
      bluetooth: [
        'Press and hold the BT button for 5 seconds to turn on Bluetooth.',
        'The hotspot is ready to pair when the screen display Bluetooth icon turn on.\n\nMake sure your phone’s Bluetooth is turned on!',
      ],
    },
    ja: {
      diagnostic:
        '<b><white>診断サポートにより、COTX GatewayはHotspotの問題を安全な方法で特定できます。</white></b>\n\nCOTX Gatewayが秘密キーにアクセスすることはありません。お使いのHotspotにのみアクセスし、ネットワーク上の他のデバイスにはアクセスしません。\n\n診断サポートをオプトアウトする場合は、Hotspotの購入時に使用したメールアドレスを使用して、<purple><b>support@cotxnetworks.com</b></purple>までメールでご連絡ください。',
      power: [
        '付属の電源アダプターを窓の近くにあるコンセントに差し込み、Hotspotの背面に付属のアンテナを回して取り付けます。',
        'COTX Gateway Minerの電源を入れると、表示画面に情報が表示されます。',
      ],
      bluetooth: [
        'BTボタンを5秒間押し続けて、Bluetoothをオンにします。',
        '画面表示のBluetoothアイコンがオンになると、ホットスポットをペアリングする準備が整います。\ n \ nスマートフォンのBluetoothがオンになっていることを確認してください。',
      ],
    },
    ko: {
      diagnostic:
        '<b><white>COTX Gateway은 진단 지원을 통해 안전한 방법으로 Hotspot에서 발생하는 문제를 식별할 수 있습니다.</white></b>\n\nCOTX Gateway은 개인 키에 대한 액세스 권한이 없으며 네트워크 내의 다른 기기를 제외하고 Hotspot에만 액세스할 수 있습니다.\n\n진단 지원을 선택 취소하려면 Hotspot을 구매할 때 사용한 이메일을 통해 <purple><b>support@cotxnetworks.com</b></purple>으로 이메일을 보내주시기 바랍니다.',
      power: [
        '제공된 전원 어댑터를 창가 부근의 콘센트에 연결하고 제공된 안테나를 Hotspot 뒷면에 나사로 고정합니다.',
        'COTX Gateway Miner의 전원을 켜면 디스플레이 화면에 정보가 표시됩니다.',
      ],
      bluetooth: [
        '블루투스 버튼을 5초간 길게 누르면 블루투스가 켜집니다.',
        '화면 표시 블루투스 아이콘이 켜지면 핫스팟을 페어링할 준비가 된 것입니다.\n\n휴대전화의 블루투스가 켜져 있는지 확인하세요!',
      ],
    },
    zh: {
      diagnostic:
        '<b><white>Hotspot 诊断支持帮助 COTX Gateway 安全确认您的 Hotspot 问题。</white></b>\n\nCOTX Gateway 绝不会访问私人密钥，且仅可访问您的 Hotspot，无法访问您网络中的任何其他设备。\n\n若选择退出诊断支持，请使用购买 Hotspot 时提供的电子邮箱发送请求至 <purple><b>support@cotxnetworks.com</b></purple>。',
      power: [
        '将电源适配器插入靠窗的插座，并将天线插入 Hotspot 背面并旋紧。',
        '开机后，COTX Gateway Miner 将点亮LED屏幕显示信息',
      ],
      bluetooth: [
        '长按 BT Button 5秒开启蓝牙。',
        '当屏幕蓝牙图标显示开启，即表示 Hotspot 准备进行配对。\n\n请务必打开您手机的蓝牙功能！',
      ],
    },
  },
  icon: HotspotIcon,
  antenna: { us: ANTENNAS.COTX_US, default: ANTENNAS.COTX_EU, cn: ANTENNAS.COTX_CN },
} as MakerHotspot

export default { COTX_V1 }
