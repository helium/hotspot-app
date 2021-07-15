import { SvgProps } from 'react-native-svg'
import { LangType } from '../utils/i18n/i18nTypes'
import { MakerAntenna } from './antennaMakerTypes'

export type HotspotMakerLangField =
  | 'diagnostic'
  | 'power'
  | 'bluetooth'
  | 'externalOnboard'

export type OnboardType = 'BLE' | 'QR' | 'WEB'

type LangFieldsRecord = Record<HotspotMakerLangField, string | string[]>
export type MakerHotspotTranslations = Record<LangType, LangFieldsRecord>
export type MakerHotspot = {
  translations: MakerHotspotTranslations
  icon: React.FC<SvgProps>
  name: string
  antenna?: { us?: MakerAntenna; default: MakerAntenna }
  onboardType: OnboardType
  onboardUrl?: string
}
