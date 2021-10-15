import OutdoorHotspotIcon from './risinghf-out.svg'
import { MakerHotspot } from '../hotspotMakerTypes'
import ANTENNAS from './antennas'

const RISINGHF_OUTDOOR = {
  name: 'RisingHF Outdoor Hotspot',
  icon: OutdoorHotspotIcon,
  onboardType: 'BLE',
  translations: {
    en: {
      diagnostic:
        '<b><white>Diagnostic support allows RisingHF Ltd to identify issues with your Hotspot in a secure way.</white></b>\n\nRisingHF will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purple><b>support@risinghf.com</b></purple> from the email used to purchase the Hotspot.',
      power: [
        'Assemble the Hotspot according to the product installation manual.',
        'Connect to DC power supply and network cable.',
      ],
      bluetooth: [
        'There is no pairing button on the RisingHF Outdoor Hotspot.',
        'Bluetooth is automatically enabled for 5 minutes after the RisingHF Outdoor Hotspot is powered on.',
      ],
    },
    ja: {
      diagnostic:
        '<b><white>診断サポートにより、RisingHF LtdはHotspotの問題を安全な方法で特定できます。</white></b>\n\nRisingHFが秘密キーにアクセスすることはありません。お使いのHotspotにのみアクセスし、ネットワーク上の他のデバイスにはアクセスしません。\n\n診断サポートをオプトアウトする場合は、Hotspotの購入時に使用したメールアドレスを使用して、<purple><b>support@risinghf.com</b></purple>までメールでご連絡ください。',
      power: [
        '製品のインストールマニュアルに従ってホットスポットを組み立てます。',
        'DC電源とネットワークケーブルを接続します。',
      ],
      bluetooth: [
        'RisingHF Outdoor Hotspotにペアリングボタンはありません。',
        'RisingHF Outdoor Hotspotの電源がオンになると、自動的にBluetoothが5分間有効になります。',
      ],
    },
    ko: {
      diagnostic:
        '<b><white>RisingHF Ltd는 진단 지원을 통해 안전한 방법으로 Hotspot에서 발생하는 문제를 식별할 수 있습니다.</white></b>\n\nRisingHF는 개인 키에 대한 액세스 권한이 없으며 네트워크 내의 다른 기기를 제외하고 Hotspot에만 액세스할 수 있습니다.\n\n진단 지원을 선택 취소하려면 Hotspot을 구매할 때 사용한 이메일을 통해 <purple><b>support@risinghf.com</b></purple>으로 이메일을 보내주시기 바랍니다.',
      power: [
        '제품 설치 매뉴얼에 따라 핫스팟을 조립하세요.',
        'DC 전원 공급 장치와 네트워크 케이블을 연결합니다.',
      ],
      bluetooth: [
        'RisingHF Outdoor Hotspot에는 페어링 버튼이 없습니다.',
        'RisingHF Outdoor Hotspot의 전원이 켜진 후 5분 동안 Bluetooth가 자동으로 활성화됩니다.',
      ],
    },
    zh: {
      diagnostic:
        '<b><white>诊断支持帮助 RisingHF Ltd 安全确认您的 Hotspot 问题。</white></b>\n\nRisingHF 绝不会访问私人密钥，且仅可访问您的 Hotspot，无法访问您网络中的任何其他设备。\n\n若选择退出诊断支持，请使用购买 Hotspot 时提供的电子邮箱发送请求至 <purple><b>support@risinghf.com</b></purple>。',
      power: [
        '根据产品安装手册组装好Hotspot。',
        '接入DC电源和网线。',
      ],
      bluetooth: [
        'RisingHF Outdoor Hotspot 上没有配对按钮。',
        'RisingHF Outdoor Hotspot 开机后，蓝牙会自动启用 5 分钟。',
      ],
    },
  },
  antenna: { default: ANTENNAS.RISINGHF_OUTDOOR },
} as MakerHotspot

export default { RISINGHF_OUTDOOR }
