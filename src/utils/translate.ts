import i18n from 'i18n-js'
import * as RNLocalize from 'react-native-localize'

import en from '../locales/en'
import es from '../locales/es'
import fr from '../locales/fr'

const locales = RNLocalize.getLocales()

if (Array.isArray(locales)) {
  i18n.locale = locales[0].languageTag
}

i18n.fallbacks = true
i18n.translations = {
  en,
  es,
  fr,
}

export const { t } = i18n

export default i18n
