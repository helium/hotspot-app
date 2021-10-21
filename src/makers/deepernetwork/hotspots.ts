import HotspotIcon from './hotspot.svg'
import { MakerHotspot } from '../hotspotMakerTypes'
import ANTENNAS from './antennas'

const DeeperNetworkHotspotBLE = {
  name: 'DeeperNetwork Hotspot',
  icon: HotspotIcon,
  onboardType: 'BLE',
  translations: {
    en: {
      diagnostic:
        '<b><white>Diagnostic support allows Deeper Network to identify issues with your Hotspot in a secure way.</white></b>\n\nDeeper Network will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purple><b>tech.support@deeper.network</b></purple> from the email used to purchase the Hotspot.',
      power: [
        'Attach the antenna and plug in the provided power adapter.',
        'Your Hotspot will boot up, and the device will light up the red power indicator.',
      ],
      bluetooth: [
        'Log in the device management background and click the Turn on Bluetooth radio button under the Helium menu.',
        "Ensure your phone's bluetooth is on before proceeding",
      ],
    },
    zh: {
      diagnostic:
        '<b><white>Hotspot 诊断支持帮助 Deeper Network 安全确认您的 Hotspot 问题。</white></b>\n\nDeeper Network 绝不会访问私人密钥，且仅可访问您的 Hotspot，无法访问您网络中的任何其他设备。\n\n若选择退出诊断支持，请使用购买 Hotspot 时提供的电子邮箱发送请求至<purple><b>tech.support@deeper.network</b></purple>。',
      power: ['连接天线并接通电源', '开机后，设备将亮起红色电源指示灯'],
      bluetooth: [
        '登录设备管理后台，点击Helium菜单下面的开启蓝牙广播按钮。',
        '点击下一步之前请确保手机的蓝牙已经开启',
      ],
    },
  },
  antenna: {
    us: ANTENNAS.DEEPER_NETWORK_US,
    default: ANTENNAS.DEEPER_NETWORK_US,
  },
} as MakerHotspot

export default { DeeperNetworkHotspotBLE }
