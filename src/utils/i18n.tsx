import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as RNLocalize from 'react-native-localize'
import en from '../locales/en'
import es from '../locales/es'
import fr from '../locales/fr'

const locales = RNLocalize.getLocales()

let lng = 'en'
if (Array.isArray(locales)) {
  lng = locales[0].languageTag
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    fr: { translation: fr },
  },
  lng,
})

export default i18n
