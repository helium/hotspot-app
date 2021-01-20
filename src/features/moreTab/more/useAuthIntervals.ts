import { useTranslation } from 'react-i18next'
import { Item } from 'react-native-picker-select'

const MILLIS_IN_SECOND = 1000
const SECONDS_IN_MINUTE = 60
const MINS_IN_HOUR = 60
const ONE_MINUTE = SECONDS_IN_MINUTE * MILLIS_IN_SECOND
const ONE_HOUR = MINS_IN_HOUR * ONE_MINUTE

export default () => {
  const { t } = useTranslation()
  return [
    {
      label: t('more.sections.security.authIntervals.immediately'),
      value: 0,
    },
    {
      label: t('more.sections.security.authIntervals.after_1_min'),
      value: ONE_MINUTE,
    },
    {
      label: t('more.sections.security.authIntervals.after_5_min'),
      value: 5 * ONE_MINUTE,
    },
    {
      label: t('more.sections.security.authIntervals.after_15_min'),
      value: 15 * ONE_MINUTE,
    },
    {
      label: t('more.sections.security.authIntervals.after_1_hr'),
      value: ONE_HOUR,
    },
    {
      label: t('more.sections.security.authIntervals.after_4_hr'),
      value: 4 * ONE_HOUR,
    },
  ] as Item[]
}
