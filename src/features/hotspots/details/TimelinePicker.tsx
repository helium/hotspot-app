import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '../../../components/Box'
import HeliumSelect from '../../../components/HeliumSelect'
import { HeliumSelectItemType } from '../../../components/HeliumSelectItem'

type Props = {
  index?: number
  onTimelineChanged?: (value: number) => void
}

const TimelinePicker = ({ index = 0, onTimelineChanged }: Props) => {
  const { t } = useTranslation()

  const data = useMemo(() => {
    const values = [1, 7, 14, 30]
    const labels: string[] = t('hotspot_details.picker_options', {
      returnObjects: true,
    })

    return labels.map(
      (label, i) =>
        ({
          label,
          value: values[i],
          color: 'purpleMain',
        } as HeliumSelectItemType),
    )
  }, [t])

  const [selectedOption, setSelectedOption] = useState(data[index])

  const handleValueChanged = useCallback(
    (_value, i) => {
      setSelectedOption(data[i])
      onTimelineChanged?.(data[i].value as number)
    },
    [data, onTimelineChanged],
  )

  return (
    <Box
      flexDirection="row"
      alignItems="center"
      marginVertical="m"
      width="100%"
    >
      <HeliumSelect
        data={data}
        variant="flat"
        marginHorizontal="s"
        backgroundColor="grayBox"
        selectedValue={selectedOption.value}
        onValueChanged={handleValueChanged}
      />
    </Box>
  )
}

export default TimelinePicker
