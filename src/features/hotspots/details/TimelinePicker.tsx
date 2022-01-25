/* eslint-disable react/jsx-props-no-spreading */
import { BoxProps } from '@shopify/restyle'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import HeliumSelect from '../../../components/HeliumSelect'
import { HeliumSelectItemType } from '../../../components/HeliumSelectItem'
import { ChartTimelineValue } from '../../../store/rewards/rewardsSlice'
import { RootState } from '../../../store/rootReducer'
import { Theme } from '../../../theme/theme'
import { useSpacing } from '../../../theme/themeHooks'

type Props = Omit<BoxProps<Theme>, 'backgroundColor'> & {
  index?: number
  onTimelineChanged?: (value: ChartTimelineValue, index: number) => void
}

const TimelinePicker = ({
  index = 0,
  onTimelineChanged,
  ...boxProps
}: Props) => {
  const { t } = useTranslation()
  const spacing = useSpacing()
  const ytdEnabled = useSelector(
    (state: RootState) => state.features.ytdEarningsEnabled,
  )

  const data = useMemo(() => {
    const values: ChartTimelineValue[] = [7, 14, 30]
    if (ytdEnabled) {
      values.push('YTD')
    }

    return values
      .map(
        (value) =>
          ({
            label: t(`hotspot_details.picker_options.${value}`),
            value,
            color: 'purpleMain',
          } as HeliumSelectItemType),
      )
      .reverse()
  }, [t, ytdEnabled])

  const [selectedOption, setSelectedOption] = useState(data[index])

  const handleValueChanged = useCallback(
    (_value, i) => {
      setSelectedOption(data[i])
      onTimelineChanged?.(data[i].value as number, i)
    },
    [data, onTimelineChanged],
  )

  const contentContainerStyle = useMemo(() => ({ paddingLeft: spacing.s }), [
    spacing.s,
  ])

  return (
    <HeliumSelect
      inverted
      scrollEnabled={false}
      data={data}
      variant="flat"
      showGradient={false}
      contentContainerStyle={contentContainerStyle}
      selectedValue={selectedOption.value}
      onValueChanged={handleValueChanged}
      itemPadding="xs"
      justifyContent="flex-end"
      marginRight="n_ms"
      {...boxProps}
    />
  )
}

export default TimelinePicker
