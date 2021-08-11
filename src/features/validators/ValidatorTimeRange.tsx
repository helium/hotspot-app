import React, { memo, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import HeliumSelect from '../../components/HeliumSelect'
import { HeliumSelectItemType } from '../../components/HeliumSelectItem'

type Props = {
  timeRange: number
  setTimeRange: (value: number) => void
}
const ValidatorTimeRange = ({ timeRange, setTimeRange }: Props) => {
  const { t } = useTranslation()
  const data = useMemo(() => {
    const values = [
      { label: t('validator_details.time_range_30_days'), value: 30 },
      { label: t('validator_details.time_range_14_days'), value: 14 },
      { label: t('validator_details.time_range_24_hours'), value: 1 },
    ]

    return values.map(
      (value) =>
        ({
          ...value,
          color: 'purpleMain',
        } as HeliumSelectItemType),
    )
  }, [t])

  const handleTimeRangeChanged = useCallback(
    (value, _index) => setTimeRange(value),
    [setTimeRange],
  )

  return (
    <HeliumSelect
      inverted
      scrollEnabled={false}
      data={data}
      variant="flat"
      showGradient={false}
      // contentContainerStyle={contentContainerStyle}
      selectedValue={timeRange}
      onValueChanged={handleTimeRangeChanged}
      itemPadding="xs"
    />
  )
}

export default memo(ValidatorTimeRange)
