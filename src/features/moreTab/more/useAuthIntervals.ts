import { useTranslation } from 'react-i18next'
import { HeliumActionSheetItemType } from '../../../components/HeliumActionSheetItem'

const MILLIS_IN_SECOND = 1000
const SECONDS_IN_MINUTE = 60
const ONE_MINUTE = SECONDS_IN_MINUTE * MILLIS_IN_SECOND
const MINUTES_IN_HOUR = 60

export enum Intervals {
  IMMEDIATELY = 5 * MILLIS_IN_SECOND,
  ONE_MIN = ONE_MINUTE,
  FIVE_MIN = 5 * ONE_MINUTE,
  FIFTEEN_MIN = 15 * ONE_MINUTE,
  ONE_HOUR = MINUTES_IN_HOUR * ONE_MINUTE,
  FOUR_HOURS = 4 * MINUTES_IN_HOUR * ONE_MINUTE,
}

export default () => {
  const { t } = useTranslation()
  return [
    {
      label: t('more.sections.security.authIntervals.immediately'),
      value: Intervals.IMMEDIATELY,
    },
    {
      label: t('more.sections.security.authIntervals.after_1_min'),
      value: Intervals.ONE_MIN,
    },
    {
      label: t('more.sections.security.authIntervals.after_5_min'),
      value: Intervals.FIVE_MIN,
    },
    {
      label: t('more.sections.security.authIntervals.after_15_min'),
      value: Intervals.FIFTEEN_MIN,
    },
    {
      label: t('more.sections.security.authIntervals.after_1_hr'),
      value: Intervals.ONE_HOUR,
    },
    {
      label: t('more.sections.security.authIntervals.after_4_hr'),
      value: Intervals.FOUR_HOURS,
    },
  ] as HeliumActionSheetItemType[]
}
