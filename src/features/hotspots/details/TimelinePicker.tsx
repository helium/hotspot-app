import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '../../../components/Box'
import Bars from '../../../assets/images/bars.svg'
import ModalPicker from '../../../components/ModalPicker'

type Props = {
  index: number
  onTimelineChanged: (value: string, index: number) => void
}

const TimelinePicker = ({ index, onTimelineChanged }: Props) => {
  const { t } = useTranslation()
  const options: Array<string> = t('hotspot_details.picker_options', {
    returnObjects: true,
  })
  const [selectedValue, setSelectedValue] = useState(options[index])
  return (
    <Box flexDirection="row" alignItems="center" marginVertical="m">
      <Bars />
      <ModalPicker
        marginHorizontal="xs"
        prefix={t('hotspot_details.picker_title')}
        data={options.map((value) => ({ label: value, value }))}
        selectedValue={selectedValue}
        onValueChanged={(_value, i) => {
          setSelectedValue(options[i])
          onTimelineChanged(options[i], i)
        }}
      />
    </Box>
  )
}

export default TimelinePicker
