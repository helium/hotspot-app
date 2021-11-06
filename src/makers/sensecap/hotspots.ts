import HotspotIcon from './sensecap-m1.svg'
import { MakerHotspot } from '../hotspotMakerTypes'
import ANTENNAS from './antennas'

const SenseCAP = {
  name: 'SenseCAP M1',
  onboardType: 'BLE',
  icon: HotspotIcon,
  translations: {
    en: {
      diagnostic:
        '<b><white>Diagnostic support allows Seeed to identify issues with your Hotspot in a secure way.</white></b>\n\nSeeed will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purple><b>support@sensecapmx.com</b></purple> from the email used to purchase the Hotspot.',
      power: [
        'Attach the antenna to the SMA antenna connector and plug the provided 5V-3A power adapter to the USB-C power connector.',
        'In 30 seconds, the blue indicator light on the back of M1 changes from off to fast flash mode, indicating that the M1 gateway is ready.',
      ],
      bluetooth: [
        'Press the button on the back of M1 for 5 seconds.',
        'The blue indicator light on the back of M1 will change to slow flash mode, indicating that M1 gateway is waiting for connection.\n\nMake sure your phone has turned on the bluetooth pairing mode and select the SenseCAP M1 from the device list.',
      ],
    },
    zh: {
      diagnostic:
        '<b><white>诊断支持帮助我们安全确认您的M1网关问题。</white></b>\n\n我们不会访问私人秘钥，且仅可访问您的M1网关，无法访问您网络中的其他设备。\n\n若您选择退出诊断支持，请邮件联系<purple><b>support@sensecapmx.com</b></purple>并提供您的相关购买记录和详细问题描述以获得技术支持。',
      power: [
        '请将天线接入M1网关背面SMA天线座子并旋紧，将5V-3A电源适配器接入USB-C电源接口并接通电源。',
        '开机约30秒后，背面的蓝色指示灯从熄灭状态变为快闪模式，表示M1网关已准备就绪。',
      ],
      bluetooth: [
        '按下M1背面的蓝牙配置按钮约5秒钟。',
        '当指示灯变为慢闪模式，即表示M1网关蓝牙等待连接中，\n\n请打开手机蓝牙功能并从列表中选择对应网关。',
      ],
    },
  },
  antenna: {
    us: ANTENNAS.SENSECAP_US,
    default: ANTENNAS.SENSECAP_EU,
  },
} as MakerHotspot

export default { SenseCAP }
