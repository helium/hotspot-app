import HotspotIcon from './rak.svg'
import { MakerHotspot } from '../hotspotMakerTypes'
import ANTENNAS from './antennas'

const RAK_V1 = {
  name: 'RAK Hotspot',
  onboardType: 'BLE',
  translations: {
    en: {
      diagnostic:
        '<b><white>Diagnostic support allows MNTD to identify issues with your Hotspot in a secure way.</white></b>\nMNTD will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purple><b>app@send.getmntd.com</b></purple> from the email used to purchase the Hotspot.',
      power: [
        'Plug in the provided power adapter into an outlet near a window.',
        'The RAK Hotspot Miner will show a red LED light once it’s powered on.',
      ],
      bluetooth: [
        'There is no pairing button on the RAK Hotspot Miner.',
        'Bluetooth is automatically enabled for 5 minutes after the RAK Hotspot Miner is powered on.\n\nHotspot can take up to 1 minute to fully boot up.',
      ],
    },
    ja: {
      diagnostic:
        '<b><white>診断サポートにより、MNTDはHotspotの問題を安全な方法で特定できます。</white></b>\n\nMNTDが秘密キーにアクセスすることはありません。お使いのHotspotにのみアクセスし、ネットワーク上の他のデバイスにはアクセスしません。\n\n診断サポートをオプトアウトする場合は、Hotspotの購入時に使用したメールアドレスを使用して、<purple><b>app@send.getmntd.com</b></purple>までメールでご連絡ください。',
      power: [
        '付属の電源アダプターを窓の近くにあるコンセントに差し込みます。',
        'RAK Hotspot Minerの電源がオンになると、赤いLEDライトが点きます。',
      ],
      bluetooth: [
        'RAK Hotspot Minerにペアリングボタンはありません。',
        'RAK Hotspot Minerの電源がオンになると、自動的にBluetoothが5分間有効になります。\n\nHotspotが完全に起動するまでに最大で1分かかる場合があります。',
      ],
    },
    ko: {
      diagnostic:
        '<b><white>MNTD은 진단 지원을 통해 안전한 방법으로 Hotspot에서 발생하는 문제를 식별할 수 있습니다.</white></b>\n\nMNTD은 개인 키에 대한 액세스 권한이 없으며 네트워크 내의 다른 기기를 제외하고 Hotspot에만 액세스할 수 있습니다.\n\n진단 지원을 선택 취소하려면 Hotspot을 구매할 때 사용한 이메일을 통해 <purple><b>app@send.getmntd.com</b></purple>으로 이메일을 보내주시기 바랍니다.',
      power: [
        '제공된 전원 어댑터를 창가 부근의 콘센트에 연결합니다.',
        '전원이 켜지면 RAK Hotspot Miner에 빨간색 LED 표시등이 표시됩니다.',
      ],
      bluetooth: [
        'RAK Hotspot Miner에는 페어링 버튼이 없습니다.',
        'RAK Hotspot Miner의 전원이 켜진 후 5분 동안 Bluetooth가 자동으로 활성화됩니다.\n\nHotspot이 완전히 부팅되는 데 최대 1분이 소요될 수 있습니다.',
      ],
    },
    zh: {
      diagnostic:
        '<b><white>Hotspot 诊断支持帮助 MNTD 安全确认您的 Hotspot 问题。</white></b>\n\nMNTD 绝不会访问私人密钥，且仅可访问您的 Hotspot，无法访问您网络中的任何其他设备。\n\n若选择退出诊断支持，请使用购买 Hotspot 时提供的电子邮箱发送请求至 <purple><b>app@send.getmntd.com</b></purple>。',
      power: [
        '将电源适配器插入靠窗的插座。',
        '开机后，RAK Hotspot Miner 将亮起红色 LED 指示灯。',
      ],
      bluetooth: [
        'RAK Hotspot Miner 上没有配对按钮。',
        'RAK Hotspot Miner 开机后，蓝牙会自动启用 5 分钟。\n\nHotspot 最多需要 1 分钟即可完全启动。',
      ],
    },
  },
  icon: HotspotIcon,
  antenna: { us: ANTENNAS.RAK_US, default: ANTENNAS.RAK_EU },
} as MakerHotspot

// const RAK_V2 = {
//   name: 'RAK v2 Hotspot',
//   onboardType:'QR',
//   translations: {
//     en: {
//       diagnostic: 'Placeholder',
//       power: ['Placeholder', 'Placeholder'],
//       bluetooth: ['Placeholder', 'Placeholder'],
//     },
//     ko: {
//       diagnostic: 'Placeholder',
//       power: ['Placeholder', 'Placeholder'],
//       bluetooth: ['Placeholder', 'Placeholder'],
//     },
//     ja: {
//       diagnostic: 'Placeholder',
//       power: ['Placeholder', 'Placeholder'],
//       bluetooth: ['Placeholder', 'Placeholder'],
//     },
//     zh: {
//       diagnostic: 'Placeholder',
//       power: ['Placeholder', 'Placeholder'],
//       bluetooth: ['Placeholder', 'Placeholder'],
//     },
//   },
//   icon: HotspotIcon,
//   antenna: { us: ANTENNAS.RAK_US, default: ANTENNAS.RAK_EU },
// } as MakerHotspot

export default { RAK_V1 /* , RAK_V2 */ }
