import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as RNLocalize from 'react-native-localize'
import { useCallback, useEffect, useState } from 'react'
import en from '../locales/en'
import ko from '../locales/ko'
import ja from '../locales/ja'
import zh from '../locales/zh'
import { getSecureItem, setSecureItem } from './secureAccount'

export const SUPPORTED_LANGUAGUES = [
  { label: 'English', value: 'en' },
  { label: '中文', value: 'zh' }, // chinese
  { label: '日本人', value: 'ja' }, // japanese
  { label: '한국어', value: 'ko' }, // korean
]

export const useLanguage = () => {
  const [language, setLanguage] = useState('en')

  const initLanguage = useCallback(async () => {
    const locales = RNLocalize.getLocales()

    let phonelang = 'en'
    if (Array.isArray(locales)) {
      phonelang = locales[0].languageTag
    }
    let lang = await getSecureItem('language')
    if (!lang) {
      lang = phonelang
      setSecureItem('language', lang)
    }

    i18n.use(initReactI18next).init({
      resources: {
        ko: { translation: ko },
        en: { translation: en },
        zh: { translation: zh },
        ja: { translation: ja },
      },
      lng: lang,
    })

    setLanguage(lang)
  }, [])

  useEffect(() => {
    const setlang = async () => {
      const lang = await getSecureItem('language')
      setLanguage(lang || '')
    }
    setlang()
  }, [])

  const changeLanguage = (lang: string) => {
    setLanguage(lang)
    setSecureItem('language', lang)
    i18n.changeLanguage(lang)
  }

  return { language, changeLanguage, initLanguage }
}

export default i18n
