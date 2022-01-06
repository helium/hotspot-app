import HotspotIcon from './hotspot.svg'
import { MakerHotspot } from '../hotspotMakerTypes'
import ANTENNAS from './antennas'

const TMGIndustriesHotspotBLE = {
  name: 'Example Hotspot',
  icon: HotspotIcon,
  onboardType: 'BLE',
  translations: {
    en: {
      diagnostic:
        '<b><white>Diagnostic support allows TMG Industries Maker to identify issues with your Hotspot in a secure way.</white></b>\n\nTMG Industries Maker will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purple><b>support@helium.com</b></purple> from the email used to purchase the Hotspot.',
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
        '<b><white>診断サポートにより、TMG IndustriesMakerは安全な方法でホットな問題を特定できます。</white></b> \n\nTMG Industries Makerは秘密鍵にアクセスできなくなり、常にホットスポットにのみアクセスでき、ネットワーク上の他のデバイスにはアクセスできなくなります。 \n\n診断サポートをオプトアウトする場合は、ホットスポットの購入に使用したメールを<purple><b>support@helium.com</b></purple>に送信してください。',
      power: [
        'アンテナを取り付け、付属の電源アダプターを差し込みます。',
        'ホットスポットが起動し、準備ができるとライトが緑色になります。'
      ],
      bluetooth:[
        'ホットスポットの黒いボタンを押します。 そのライトは青に変わるはずです。',
        '続行する前に、スマートフォンのBluetoothがオンになっていることを確認してください'
      ]
    },
    ko: {
        diagnostic: '<b><white>진단 지원을 통해 TMG Industries Maker는 핫스팟 문제를 안전한 방식으로 식별할 수 있습니다.</white></b>\n\nTMG Industries Maker는 개인 키에 액세스할 수 없으며 앞으로도 그럴 것입니다. 핫스팟에 액세스할 수 있으며 네트워크의 다른 장치에는 액세스할 수 없습니다.\n\n진단 지원을 거부하려면 <purple><b>support@helium.com</b></purple>으로 이메일을 보내주십시오. Hotspot 구매에 사용한 이메일',
        power: [
          '안테나를 연결하고 제공된 전원 어댑터를 연결하세요.',
          '핫스팟이 부팅되고 준비가 되면 표시등이 녹색으로 바뀝니다.',
        ],
        bluetooth: [
          '핫스팟의 검은색 버튼을 누르십시오. 그 빛은 파란색으로 변해야 합니다.',
          "계속하기 전에 휴대전화의 블루투스가 켜져 있는지 확인하십시오",
        ]
    },
  },
  antenna: {
    us: ANTENNAS.TMG_INDUSTRIES_US,
    default: ANTENNAS.TMG_INDUSTRIES_EU,
  },
} as MakerHotspot

export default { TMGIndustriesHotspotBLE }
