import HotspotIcon from './dusun.svg'
import { MakerHotspot } from '../hotspotMakerTypes'
import ANTENNAS from './antennas'

const DusunHotspotBLE = {
  name: 'Dusun Hotspot 210B',
  icon: HotspotIcon,
  onboardType: 'BLE',
  translations: {
    en: {
      diagnostic:
        '<b><white>Diagnostic support allows Helium to identify issues with your Hotspot in a secure way.</white></b>\n\nHelium will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purple><b>support@hzdusun.com</b></purple> from the email used to purchase the Hotspot.',
      power: [
        'Attach the antenna and plug in the provided USB power adapter.',
        'Your Hotspot will boot up, and its light will become Blue when ready.',
      ],
      bluetooth: [
        'Press the black button on your Hotspot. Its light should turn purple-blink.',
        "Ensure your phone's bluetooth is on before proceeding",
      ],
    },
    ja: {
      // TODO: Translate strings for diagnostic, power, and bluetooth
    },
    ko: {
      // TODO: Translate strings for diagnostic, power, and bluetooth
    },
    zh: {
      diagnostic:
        '<b><white>诊断支持帮助 Dusun 安全确认您的 Hotspot 问题。</white></b>\n\nDusun 绝不会访问私人密钥，且仅可访问您的 Hotspot，不会访问您网络中的任何其他设备。\n\n若选择退出诊断支持，请使用购买 Hotspot 时提供的电子邮箱发送请求至 <purple><b>support@hzdusun.com</b></purple>。',
      power: [
        '连接天线，将随附的USB电源适配器插入靠窗的插座。',
        '开机后，Hotspot 将亮红色 LED 指示灯，启动好并连上网络后将变蓝色。',
      ],
      bluetooth: [
        '按一下 Hotspot 侧面的凸出按钮。',
        'LED 指示灯将变成紫色闪烁，即表示 Hotspot 已准备进行配对。\n\n按“下一步”开始扫描。',
      ],
    },
  },
  antenna: {
    us: ANTENNAS.DUSUN_US,
    default: ANTENNAS.DUSUN_EU,
  },
} as MakerHotspot

export default { DusunHotspotBLE }
