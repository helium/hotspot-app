import HotspotIcon from './icon.svg'
import { MakerHotspot } from '../hotspotMakerTypes'
import ANTENNAS from './antennas'

const Aitek = {
  name: 'Aitek Miner',
  onboardType: 'BLE',
  translations: {
    en: {
      diagnostic:
        'Diagnostic support allows Aitek to identify issues with your Hotspot in a secure way.\n\nAitek will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nPlease check the troubleshooting guide at https://www.aiteks.com/faq or use the local diagnoser to see Hotspot real-time operational data.',
      power: [
        'Plug in the provided power adapter into an outlet near a window and screw in the provided antenna on the back of the Hotspot.',
        'The Hotspot is ready when the light goes from red to green.',
      ],
      bluetooth: [
        'Use the pin to press the BT Button on the back of the Hotspot and hold for 5 seconds.',
        'The hotspot is ready to pair when the light goes from green to blue.\n\nMake sure your phone’s Bluetooth is turned on!',
      ],
    },
    ja: {
      diagnostic:
        '診断サポートにより、AitekはHotspotの問題を安全な方法で特定できます。\n\nAitekが秘密キーにアクセスすることはありません。お使いのHotspotにのみアクセスし、ネットワーク上の他のデバイスにはアクセスしません。\n\nhttps://www.aiteks.com/faq のトラブルシューティングガイドを確認するか、ローカルの診断ツールを使用して、ホットスポットのリアルタイムの運用データを確認してください。',
      power: [
        '付属の電源アダプターを窓の近くにあるコンセントに差し込み、Hotspotの背面に付属のアンテナを回して取り付けます。',
        'Hotspotの準備が整うと、LEDの色が赤から绿色に変わります。',
      ],
      bluetooth: [
        'ピンを使用して、Hotspotの背面にあるBTボタンを押し、そのまま5秒間押し続けます。',
        'Hotspotのペアリングの準備が整うと、LEDの色が绿色から青色に変わります。\n\n携帯電話のBluetoothがオンになっていることを確認してください。',
      ],
    },
    ko: {
      diagnostic:
        'Aitek은 진단 지원을 통해 안전한 방법으로 Hotspot에서 발생하는 문제를 식별할 수 있습니다.\n\nAitek은 개인 키에 대한 액세스 권한이 없으며 네트워크 내의 다른 기기를 제외하고 Hotspot에만 액세스할 수 있습니다.\n\nhttps://www.aiteks.com/faq 에서 문제 해결 가이드를 확인하거나 로컬 진단기를 사용하여 핫스팟 실시간 작동 데이터를 확인하십시오.',
      power: [
        '제공된 전원 어댑터를 창가 부근의 콘센트에 연결하고 제공된 안테나를 Hotspot 뒷면에 나사로 고정합니다.',
        '표시등이 빨간색에서 초록색으로 바뀌면 Hotspot이 준비된 것입니다.',
      ],
      bluetooth: [
        '핀을 사용하여 Hotspot 뒷면의 BT 버튼을 5초 동안 누르세요.',
        '표시등이 초록색에서 파란색으로 바뀌면 Hotspot이 페어링할 준비가 된 것입니다.\n\n휴대전화의 Bluetooth가 켜져 있는지 확인하세요!',
      ],
    },
    zh: {
      diagnostic:
        '诊断支持帮助 Aitek 安全确认您的 Hotspot 问题。\n\nAitek 绝不会访问私人密钥，且仅可访问您的 Hotspot，无法访问您网络中的任何其他设备。\n\n请在https://www.aiteks.com/faq查看我们的故障排除指南或使用本地诊断工具查看热点实时运行数据。',
      power: [
        '将电源适配器插入靠窗的插座，并将天线插入 Hotspot 背面并旋紧。',
        '当指示灯由红色变为绿色，即表示 Hotspot 准备就绪。',
      ],
      bluetooth: [
        '使用大头针按下 Hotspot 背面的 BT 按钮，长按 5 秒钟。',
        '当指示灯由绿色变为蓝色，即表示 Hotspot 准备进行配对。\n\n请务必打开您手机的蓝牙功能！',
      ],
    },
  },
  icon: HotspotIcon,
  antenna: {
    us: ANTENNAS.AITEK_US,
    default: ANTENNAS.AITEK_EU,
  },
} as MakerHotspot
export default { Aitek }
