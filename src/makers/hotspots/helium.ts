import HotspotIcon from '@assets/images/hotspot.svg'
import { MakerHotspot } from './hotspotMakerTypes'
import ANTENNAS from '../antennas/helium'

const Helium = {
  name: 'Helium Hotspot',
  icon: HotspotIcon,
  translations: {
    en: {
      diagnostic:
        '<b><white>Diagnostic support allows Helium to identify issues with your Hotspot in a secure way.</white></b>\n\nHelium will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purple><b>support@helium.com</b></purple> from the email used to purchase the Hotspot.',
      power: [
        'Attach the antenna and plug in the provided power adapter.',
        'Your Hotspot will boot up, and its light will become Green when ready.',
      ],
      bluetooth: [
        'Press the black button on your Hotspot. Its light should turn blue.',
        "Ensure your phone's bluetooth is on before proceeding",
      ],
    },
    ja: {
      diagnostic:
        '<b><white>診断サポートにより、HeliumはHotspotの問題を安全な方法で特定できます。</white></b>\n\nHeliumが秘密キーにアクセスすることはありません。お使いのHotspotにのみアクセスし、ネットワーク上の他のデバイスにはアクセスしません。\n\n診断サポートをオプトアウトする場合は、Hotspotの購入時に使用したメールアドレスを使用して、<purple><b>support@helium.com</b></purple>までメールでご連絡ください。',
      power: [
        'アンテナを取り付け、付属の電源アダプターに差し込みます。',
        'Hotspotが起動し、準備が完了するとライトが緑色になります。',
      ],
      bluetooth: [
        'Hotspotの黒いボタンを押します。ライトが青に変わります。',
        '続行する前に携帯電話のBluetoothがオンになっていることを確認します',
      ],
    },
    ko: {
      diagnostic:
        '<b><white>Helium은 진단 지원을 통해 안전한 방법으로 Hotspot에서 발생하는 문제를 식별할 수 있습니다.</white></b>\n\nHelium은 개인 키에 대한 액세스 권한이 없으며 네트워크 내의 다른 기기를 제외하고 Hotspot에만 액세스할 수 있습니다.\n\n진단 지원을 선택 취소하려면 Hotspot을 구매할 때 사용한 이메일을 통해 <purple><b>support@helium.com</b></purple>으로 이메일을 보내주시기 바랍니다.',
      power: [
        '안테나를 부착하고 제공된 전원 어댑터에 연결합니다.',
        'Hotspot이 부팅되고 준비되면 표시등이 녹색으로 바뀝니다.',
      ],
      bluetooth: [
        'Hotspot에서 검은색 버튼을 누르세요. 표시등이 파란색으로 바뀝니다.',
        '계속하기 전에 휴대전화의 Bluetooth가 켜져 있는지 확인하세요',
      ],
    },
    zh: {
      diagnostic:
        '<b><white>Hotspot 诊断支持帮助 Helium 安全确认您的 Hotspot 问题。</white></b>\n\nHelium 绝不会访问私人密钥，且仅可访问您的 Hotspot，无法访问您网络中的任何其他设备。\n\n若选择退出诊断支持，请使用购买 Hotspot 时提供的电子邮箱发送请求至 <purple><b>support@helium.com</b></purple>。',
      power: [
        '连接天线，插接随附的电源适配器。',
        '您的 Hotspot 将随即启动，就绪后会亮起绿色指示灯。',
      ],
      bluetooth: [
        '按下 Hotspot 上的黑色按钮。指示灯应变成蓝色。',
        '继续操作之前，请确保您手机上的蓝牙已开启',
      ],
    },
  },
  antenna: {
    us: ANTENNAS.HELIUM_US,
    default: ANTENNAS.HELIUM_EU,
  },
} as MakerHotspot

export default { Helium }
