import HotspotIcon from './pisces.svg'
import { MakerHotspot } from '../hotspotMakerTypes'
import ANTENNAS from './antennas'

const pisces = {
  name: 'Pisces Outdoor P100',
  icon: HotspotIcon,
  onboardType: 'BLE',
  translations: {
    en: {
      diagnostic:
        '<b><white>Diagnostic support allows pisces to identify issues with your Hotspot in a secure way.</white></b>\n\npisces will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purple><b>admin@piscesminer.com</b></purple> from the email used to purchase the Hotspot.',
      power: [
        'Turn on the power properly, insert the antenna into the back of the Hotspot and screw it tightly.',
        'When the indicator light turns from white to green, it means that Hotspot is ready.',
      ],
      bluetooth: [
        'Use the provided pin to press the BT Button on the back of the Hotspot and hold for 5 seconds.',
        'When the indicator light turns from white to green, it means that Hotspot is ready to pair.\n\nMake sure your phone’s Bluetooth is turned on!',
      ],
    },
    ja: {
      diagnostic:
        '<b><white>診断サポートにより、piscesはHotspotの問題を安全な方法で特定できます。</white></b>\n\npiscesが秘密キーにアクセスすることはありません。お使いのHotspotにのみアクセスし、ネットワーク上の他のデバイスにはアクセスしません。\n\n診断サポートをオプトアウトする場合は、Hotspotの購入時に使用したメールアドレスを使用して、<purple><b>admin@piscesminer.com</b></purple>までメールでご連絡ください。',
      power: [
        '電源を適切にオンにし、アンテナをホットスポットの背面に挿入してしっかりとねじ込みます。',
        'インジケータライトが白から緑に変わるときは、ホットスポットの準備ができていることを意味します。',
      ],
      bluetooth: [
        '付属のピンを使用して、Hotspotの背面にあるBTボタンを押し、そのまま5秒間押し続けます。',
        'インジケータライトが白から緑に変わるときは、ホットスポットをペアリングする準備ができていることを意味します。\n\n携帯電話のBluetoothがオンになっていることを確認してください。',
      ],
    },
    ko: {
      diagnostic:
        '<b><white>pisces은 진단 지원을 통해 안전한 방법으로 Hotspot에서 발생하는 문제를 식별할 수 있습니다.</white></b>\n\npisces은 개인 키에 대한 액세스 권한이 없으며 네트워크 내의 다른 기기를 제외하고 Hotspot에만 액세스할 수 있습니다.\n\n진단 지원을 선택 취소하려면 Hotspot을 구매할 때 사용한 이메일을 통해 <purple><b>admin@piscesminer.com</b></purple>으로 이메일을 보내주시기 바랍니다.',
      power: [
        '전원을 제대로 켜고 안테나를 핫스팟 뒷면에 삽입하고 단단히 조입니다.',
        '표시등이 흰색에서 녹색으로 바뀌면 핫스팟이 준비되었음을 의미합니다.',
      ],
      bluetooth: [
        '제공된 핀을 사용하여 Hotspot 뒷면의 BT 버튼을 5초 동안 누르세요.',
        '표시등이 흰색에서 녹색으로 바뀌면 핫스팟이 페어링할 준비가 되었음을 의미합니다.\n\n휴대전화의 Bluetooth가 켜져 있는지 확인하세요!',
      ],
    },
    zh: {
      diagnostic:
        '<b><white>诊断支持帮助 pisces 安全确认您的 Hotspot 问题。</white></b>\n\npisces 绝不会访问私人密钥，且仅可访问您的 Hotspot，无法访问您网络中的任何其他设备。\n\n若选择退出诊断支持，请使用购买 Hotspot 时提供的电子邮箱发送请求至 <purple><b>admin@piscesminer.com</b></purple>。',
      power: [
        '将电源适开启，并将天线插入 Hotspot 背面并旋紧。',
        '当指示灯由白变为绿色，即表示 Hotspot 准备就绪。',
      ],
      bluetooth: [
        '使用随附的大头针按下 Hotspot 背面的 BT 按钮，长按 5 秒钟。',
        '当指示灯由白变为绿色，即表示 Hotspot 准备进行配对。\n\n请务必打开您手机的蓝牙功能！',
      ],
    },
  },
  icon: HotspotIcon,
  antenna: { default: ANTENNAS.pisces },
} as MakerHotspot

export default { pisces }
