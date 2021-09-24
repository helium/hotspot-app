import HotspotIcon from './hummingbird.svg'
import { MakerHotspot } from '../hotspotMakerTypes'
import ANTENNAS from './antennas'

const HUMMINGBIRD_H500 = {
  name: 'Hummingbird H500',
  icon: HotspotIcon,
  onboardType: 'BLE',
  translations: {
    en: {
      diagnostic:
        '<b><white>Diagnostic support allows Hummingbird Maker to identify issues with your Hotspot in a secure way.</white></b>\n\nHummingbird will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please refer to <purple><b>https://www.xdt.com/#faq</b></purple> for troubleshooting guide or use local diagnostic tools to view real-time operating data of hotspots',
      power: [
        'Attach the antenna and plug in the provided power adapter.',
        'Your Hotspot will boot up, and its light will become Green when ready.',
      ],
      bluetooth: [
        'Press the black button on your Hotspot. Its light should turn blue.',
        "Ensure your phone's bluetooth is on before proceeding",
      ],
    },
    zh: {
      diagnostic:
        '<b><white>诊断支持帮助 Hummingbird 安全确认您的 Hotspot 问题。</white></b>\n\nHummingbird 绝不会访问私人密钥，且仅可访问您的 Hotspot，无法访问您网络中的任何其他设备。\n\n请在<purple><b>https://www.xdt.com/faq</b></purple>查看我们的故障排除指南或使用本地诊断工具查看热点实时运行数据。',
      power: [
        '将电源适配器插入靠窗的插座，并将天线插入 Hotspot 背面并旋紧。',
        '当指示灯变为绿色，即表示 Hotspot 准备就绪。',
      ],
      bluetooth: [
        '使用随附的大头针按下 Hotspot 背面的 BT 按钮，长按 5 秒钟。',
        '当指示灯由黄色变为蓝色，即表示 Hotspot 准备进行配对。\n\n请务必打开您手机的蓝牙功能！',
      ],
      // TODO: Translate strings for diagnostic, power, and bluetooth
    },
  },
  antenna: {
    default: ANTENNAS.HUMMINGBIRD_H500,
  },
} as MakerHotspot

export default { HUMMINGBIRD_H500 }
