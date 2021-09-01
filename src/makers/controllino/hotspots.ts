import HotspotIcon from './controllinohotspot.svg'
import { MakerHotspot } from '../hotspotMakerTypes'
import ANTENNAS from './antennas'

const ControllinoHotspot = {
  name: 'Controllino Hotspot',
  icon: HotspotIcon,
  onboardType: 'BLE',
  translations: {
    en: {
      diagnostic:
        '<b><white>Diagnostic support allows Controllino to identify issues with your Hotspot in a secure way.</white></b>\n\nControllino will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purple><b>hotspotsupport@controllino.com</b></purple> from the email used to purchase the Hotspot.',
      power: [
        'Attach the antenna and plug in the power cable as described in the user manual.',
        'Your Hotspot will boot up and is  ready in around 5 minutes.',
      ],
      bluetooth: [
        'After roughly 5 minutes after plugging in the Hotspot, you should see it as Bluetooth device on your phone.',
        'If you cannot see the Hotspot after a few minutes, unplug the power cable and plug it in again.',
      ],
    },
    zh: {
		diagnostic:
			'<b><white>诊断支持允许 Controllino 以安全的方式识别热点问题</white></b>\n\nControllino 永远无法访问私钥，并且只能访问您的热点，而不能访问您网络上的任何其他设备。\n\n如果您想选择退出诊断支持，请通过用于购买 Hotspot 的电子邮件发送电子邮件至 <purple><b>hotspotsupport@controllino.com</b></purple>',
		power: [
		'按照用户手册中的说明连接天线并插入电源线',
		'您的热点将在大约 5 分钟内启动并准备就绪',
		],
		bluetooth: [
		'插入热点 5 分钟后，您应该会在手机上看到一个蓝牙设备',
		'如果几分钟后看不到热点，请拔下电源线并重新插入',
		],
    },
  },
  antenna: {
    default: ANTENNAS.CONTROLLINO_EU,
  },
} as MakerHotspot

export default { ControllinoHotspot }
