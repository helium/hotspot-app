import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '../../../components/Box'
import Bars from '../../../assets/images/bars.svg'
import ModalPicker from '../../../components/ModalPicker'

type Props = {
  index?: number
  onTimelineChanged?: (value: number) => void
}

const TimelinePicker = ({ index = 0, onTimelineChanged }: Props) => {
  const { t } = useTranslation()

  const data = useMemo(() => {
    const values = ['1', '7', '14', '30']
    const labels: string[] = t('hotspot_details.picker_options', {
      returnObjects: true,
    })

    return labels.map((label, i) => ({ label, value: values[i] }))
  }, [t])

  const [selectedOption, setSelectedOption] = useState(data[index])

  const handleValueChanged = useCallback(
    (value, i) => {
      setSelectedOption(data[i])
      onTimelineChanged?.(parseInt(data[i].value, 10))
    },
    [data, onTimelineChanged],
  )

  return (
    <Box
      flexDirection="row"
      alignItems="center"
      marginVertical="m"
      width="100%"
      paddingHorizontal="l"
    >
      <Bars />
      <ModalPicker
        minWidth={110}
        marginHorizontal="xs"
        prefix={t('hotspot_details.picker_title')}
        data={data}
        selectedValue={selectedOption.value}
        onValueChanged={handleValueChanged}
      />
    </Box>
  )
}

export default TimelinePicker
