import HotspotIcon_HP0D from './hp0d.svg'
import { MakerHotspot } from '../hotspotMakerTypes'
import ANTENNAS from './antennas'

const DRAGINO_HP0D = {
  name: 'DRAGINO Miner HP0D',
  icon: HotspotIcon_HP0D,
  onboardType: 'QR',
  translations: {
    en: {
      diagnostic:
        '<b><white>Diagnostic support allows Dragino to identify issues with your Hotspot in a secure way.</white></b>\n\nDragino will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purple><b>support@dragino.com</b></purple> from the email used to purchase the Hotspot.',
      power: [
        'Attach the antenna and plug in the provided power adapter.',
        'Your Hotspot will boot up, and its light will become Green when ready.',
      ],
      externalOnboard: 'Visit Dragino dashboard to generate a QR-code',
    },
    ja: {
      diagnostic:
        '<b><white>診断サポートにより、DraginoはHotspotの問題を安全な方法で特定できます。</white></b>\n\nDraginoが秘密キーにアクセスすることはありません。お使いのHotspotにのみアクセスし、ネットワーク上の他のデバイスにはアクセスしません。\n\n診断サポートをオプトアウトする場合は、Hotspotの購入時に使用したメールアドレスを使用して、<purple><b>support@dragino.com</b></purple>までメールでご連絡ください。',
      power: [
        'アンテナを取り付け、付属の電源アダプターに差し込みます。',
        'Hotspotが起動し、準備が完了するとライトが緑色になります。',
      ],
    },
    ko: {
      diagnostic:
        '<b><white>Dragino은 진단 지원을 통해 안전한 방법으로 Hotspot에서 발생하는 문제를 식별할 수 있습니다.</white></b>\n\nDragino은 개인 키에 대한 액세스 권한이 없으며 네트워크 내의 다른 기기를 제외하고 Hotspot에만 액세스할 수 있습니다.\n\n진단 지원을 선택 취소하려면 Hotspot을 구매할 때 사용한 이메일을 통해 <purple><b>support@dragino.com</b></purple>으로 이메일을 보내주시기 바랍니다.',
      power: [
        '안테나를 부착하고 제공된 전원 어댑터에 연결합니다.',
        'Hotspot이 부팅되고 준비되면 표시등이 녹색으로 바뀝니다.',
      ],
    },
    zh: {
      diagnostic:
        '<b><white>Hotspot 诊断支持帮助 Dragino 安全确认您的 Hotspot 问题。</white></b>\n\nHelium 绝不会访问私人密钥，且仅可访问您的 Hotspot，无法访问您网络中的任何其他设备。\n\n若选择退出诊断支持，请使用购买 Hotspot 时提供的电子邮箱发送请求至 <purple><b>support@dragino.com</b></purple>。',
      power: [
        '连接天线，插接随附的电源适配器。',
        '您的 Hotspot 将随即启动，就绪后会亮起绿色指示灯。',
      ],
      externalOnboard: 'Visit Dragino dashboard to generate a QR-code',
    },
  },
  antenna: {
    default: ANTENNAS.DRAGINO_HP0D_ANT,
  },
} as MakerHotspot

export default { DRAGINO_HP0D }
