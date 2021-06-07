import bobcat from './bobcat'
import finestra from './finestra'
import helium from './helium'
import longAP from './longAP'
import nebra from './nebra'
import rak from './rak'
import syncrobit from './syncrobit'
import { LangType, supportedLangs } from '../../utils/i18n/i18nTypes'
import { HotspotMakerLangField } from './hotspotMakerTypes'

export const HotspotMakerModels = {
  ...bobcat,
  ...finestra,
  ...helium,
  ...longAP,
  ...nebra,
  ...rak,
  ...syncrobit,
}

export type HotspotType = keyof typeof HotspotMakerModels
export const HotspotModelKeys = Object.keys(
  HotspotMakerModels,
).sort() as HotspotType[]
export const HotspotTypeCount = HotspotModelKeys.length

type MakerLangType = Record<
  HotspotType,
  Record<HotspotMakerLangField, string | string[]>
>
export const getTranslations = () => {
  const trans: Record<LangType, MakerLangType> = {
    en: {} as MakerLangType,
    ko: {} as MakerLangType,
    zh: {} as MakerLangType,
    ja: {} as MakerLangType,
  }

  supportedLangs.forEach((l) => {
    HotspotModelKeys.forEach((ht) => {
      trans[l][ht] = HotspotMakerModels[ht].translations[l]
    })
  })
  return trans
}
