import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as RNLocalize from 'react-native-localize'
import { useCallback, useEffect, useState } from 'react'
import en from '../locales/en'
import ko from '../locales/ko'
import ja from '../locales/ja'
import zh from '../locales/zh'
import { getSecureItem, setSecureItem } from './secureAccount'

const locales = RNLocalize.getLocales()

const numberFormatSettings = RNLocalize.getNumberFormatSettings()
export const groupSeparator = numberFormatSettings.groupingSeparator
export const { decimalSeparator } = numberFormatSettings
export const [currencyType] = RNLocalize.getCurrencies() || ['USD']
export const usesMetricSystem = RNLocalize.usesMetricSystem()

let phoneLang = 'en'
if (Array.isArray(locales)) {
  phoneLang = locales[0].languageCode
}

i18n.use(initReactI18next).init({
  resources: {
    ko: { translation: ko },
    en: { translation: en },
    zh: { translation: zh },
    ja: { translation: ja },
  },
  lng: phoneLang,
  fallbackLng: ['en'],
})

export const locale = phoneLang

export const SUPPORTED_LANGUAGUES = [
  { label: 'English', value: 'en' },
  { label: '中文', value: 'zh' }, // chinese
  { label: '日本人', value: 'ja' }, // japanese
  { label: '한국어', value: 'ko' }, // korean
]

export const useLanguage = () => {
  const [language, setLanguage] = useState('en')

  useEffect(() => {
    initLanguage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const changeLanguage = useCallback((lang: string) => {
    setLanguage(lang)
    setSecureItem('language', lang)
    i18n.changeLanguage(lang)
  }, [])

  const initLanguage = useCallback(async () => {
    const lang = await getSecureItem('language')
    if (lang) {
      changeLanguage(lang)
    }
    setLanguage(lang || phoneLang)
  }, [changeLanguage])

  return { language, changeLanguage }
}

export default i18n
