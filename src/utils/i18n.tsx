import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as RNLocalize from 'react-native-localize'
import { useCallback, useEffect, useState } from 'react'
import en from '../locales/en'
import ko from '../locales/ko'
import ja from '../locales/ja'
import zh from '../locales/zh'
import { getSecureItem, setSecureItem } from './secureAccount'

export const useLanguage = () => {
  const [language, setLanguage] = useState('en')

  const initLanguage = useCallback(async () => {
    const locales = RNLocalize.getLocales()

    let phoneLng = 'en'
    if (Array.isArray(locales)) {
      phoneLng = locales[0].languageTag
    }
    let lng = await getSecureItem('language')
    if (!lng) {
      lng = phoneLng
      setSecureItem('language', lng)
    }

    i18n.use(initReactI18next).init({
      resources: {
        ko: { translation: ko },
        en: { translation: en },
        zh: { translation: zh },
        ja: { translation: ja },
      },
      lng,
    })

    setLanguage(lng)
  }, [])

  useEffect(() => {
    const setLng = async () => {
      const lng = await getSecureItem('language')
      setLanguage(lng || '')
    }
    setLng()
  }, [])

  const changeLanguage = (lng: string) => {
    setLanguage(lng)
    setSecureItem('language', lng)
    i18n.changeLanguage(lng)
  }

  return { language, changeLanguage, initLanguage }
}

export default i18n
