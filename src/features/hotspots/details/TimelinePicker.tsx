import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '../../../components/Box'
import HeliumSelect from '../../../components/HeliumSelect'
import { HeliumSelectItemType } from '../../../components/HeliumSelectItem'
import { useSpacing } from '../../../theme/themeHooks'

type Props = {
  index?: number
  onTimelineChanged?: (value: number, index: number) => void
}

const TimelinePicker = ({ index = 0, onTimelineChanged }: Props) => {
  const { t } = useTranslation()
  const spacing = useSpacing()

  const data = useMemo(() => {
    const values = [1, 14, 30]
    const labels: string[] = t('hotspot_details.picker_options', {
      returnObjects: true,
    })

    return labels
      .map(
        (label, i) =>
          ({
            label,
            value: values[i],
            color: 'purpleMain',
          } as HeliumSelectItemType),
      )
      .reverse()
  }, [t])

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
    <Box zIndex={1000} marginRight="m">
      <HeliumSelect
        inverted
        scrollEnabled={false}
        data={data}
        variant="flat"
        showGradient={false}
        contentContainerStyle={contentContainerStyle}
        backgroundColor="grayBoxLight"
        selectedValue={selectedOption.value}
        onValueChanged={handleValueChanged}
        itemPadding="xs"
        justifyContent="flex-end"
      />
    </Box>
  )
}

export default TimelinePicker
