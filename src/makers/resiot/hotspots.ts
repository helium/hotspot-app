import HotspotIcon from './hotspot.svg'
import { MakerHotspot } from '../hotspotMakerTypes'
import ANTENNAS from './antennas'

const translationsObject = {
  en: {
    diagnostic:
      '<b><white>Diagnostic support allows ResIOT to identify issues with your Hotspot in a secure way.</white></b>\n\nResIOT will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.',
    power: [
      'If your hotspot is turned on, turn it off by removing the power supply and wait 10 seconds. Attach the antenna and plug in the provided power adapter.',
      'Now turn on your hotspot and wait until the 3 top LEDs blink together, it takes about 60 seconds since the hotspot is turned on.',
    ],
    bluetooth: [
      'Now the Hotspot can be scanned, tap the button below to start the hotspot search.',
      "Ensure your phone's bluetooth is on before proceeding",
    ],
  },
  ja: {
    diagnostic:
      '<b><white>診断サポートにより、ResIOT はホットスポットの問題を安全な方法で特定できます.</white></b>\n\nResIOT は秘密鍵にアクセスできず、ホットスポットにのみアクセスでき、ネットワーク上の他のデバイスにはアクセスできません。',
    power: [
      'ホットスポットがオンになっている場合は、電源を取り外してオフにし、10 秒待ちます。 アンテナを取り付け、付属の電源アダプターを差し込みます。',
      'ホットスポットをオンにして、上部の 3 つの LED が同時に点滅するまで待ちます。ホットスポットがオンになってから約 60 秒かかります。',
    ],
    bluetooth: [
      'ホットスポットをスキャンできるようになりました。下のボタンをタップして、ホットスポットの検索を開始します。',
      "続行する前に、携帯電話の Bluetooth がオンになっていることを確認してください",
    ],
  },
  ko: {
    diagnostic:
      '<b><white>진단 지원을 통해 ResIOT는 핫스팟의 문제를 안전한 방식으로 식별할 수 있습니다.</white></b>\n\nResIOT은 개인 키에 액세스할 수 없으며 네트워크의 다른 장치가 아닌 핫스팟에만 액세스할 수 있습니다.',
    power: [
      '핫스팟이 켜져 있으면 전원 공급 장치를 제거하여 핫스팟을 끄고 10초 동안 기다리십시오. 안테나를 부착하고 제공된 전원 어댑터를 연결하십시오.',
      '이제 핫스팟을 켜고 3개의 상단 LED가 함께 깜박일 때까지 기다리십시오. 핫스팟이 켜진 후 약 60초가 걸립니다.',
    ],
    bluetooth: [
      '이제 핫스팟을 검색할 수 있습니다. 아래 버튼을 눌러 핫스팟 검색을 시작하십시오.',
      "계속하기 전에 휴대전화의 블루투스가 켜져 있는지 확인하세요.",
    ],
  },
  zh: {
    diagnostic:
      '<b><white>诊断支持允许 ResIOT 以安全的方式识别热点问题。</white></b>\n\nResIOT 将永远无法访问私钥，并且只能访问您的热点，而不能访问您网络上的任何其他设备。',
    power: [
      '如果您的热点已打开，请通过移除电源将其关闭并等待 10 秒钟。 连接天线并插入提供的电源适配器。',
      '现在打开你的热点，等到顶部的 3 个 LED 一起闪烁，热点打开后大约需要 60 秒。',
    ],
    bluetooth: [
      '现在可以扫描热点，点击下面的按钮开始热点搜索。',
      "在继续之前确保您手机的蓝牙已开启",
    ],
  },
}

const ResIOTX1BLE = {
  name: 'ResIOT X1 Indoor Hotspot',
  icon: HotspotIcon,
  onboardType: 'BLE',
  translations: translationsObject,
  antenna: {
    default: ANTENNAS.STANDARD_EU,
  },
} as MakerHotspot

const ResIOTX1Out68BLE = {
  name: 'ResIOT X1 Outdoor 6.8dBi Hotspot',
  icon: HotspotIcon,
  onboardType: 'BLE',
  translations: translationsObject,
  antenna: {
    default: ANTENNAS.OUTDOOR68_EU,
  },
} as MakerHotspot

const ResIOTX1Out80BLE = {
  name: 'ResIOT X1 Outdoor 8dBi Hotspot',
  icon: HotspotIcon,
  onboardType: 'BLE',
  translations: translationsObject,
  antenna: {
    default: ANTENNAS.OUTDOOR80_EU,
  },
} as MakerHotspot

const ResIOTX1Out100BLE = {
  name: 'ResIOT X1 Outdoor 10dBi Hotspot',
  icon: HotspotIcon,
  onboardType: 'BLE',
  translations: translationsObject,
  antenna: {
    default: ANTENNAS.OUTDOOR100_EU,
  },
} as MakerHotspot

const ResIOTX1Out120BLE = {
  name: 'ResIOT X1 Outdoor 12dBi Hotspot',
  icon: HotspotIcon,
  onboardType: 'BLE',
  translations: translationsObject,
  antenna: {
    default: ANTENNAS.OUTDOOR120_EU,
  },
} as MakerHotspot

const ResIOTX1Out150BLE = {
  name: 'ResIOT X1 Outdoor 15dBi Hotspot',
  icon: HotspotIcon,
  onboardType: 'BLE',
  translations: translationsObject,
  antenna: {
    default: ANTENNAS.OUTDOOR150_EU,
  },
} as MakerHotspot

export default { ResIOTX1BLE, ResIOTX1Out68BLE, ResIOTX1Out80BLE, ResIOTX1Out100BLE, ResIOTX1Out120BLE, ResIOTX1Out150BLE }
