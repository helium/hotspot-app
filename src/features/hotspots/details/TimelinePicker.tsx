import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '../../../components/Box'
import Bars from '../../../assets/images/bars.svg'
import Text from '../../../components/Text'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import CarotDown from '../../../assets/images/carot-down.svg'
import ModalPicker from '../../../components/ModalPicker'

type Props = {
  onTimelineChanged: (value: string, index: number) => void
}

const TimelinePicker = ({ onTimelineChanged }: Props) => {
  const { t } = useTranslation()
  const options = [
    t('hotspot_details.picker_option_0'),
    t('hotspot_details.picker_option_1'),
    t('hotspot_details.picker_option_2'),
    t('hotspot_details.picker_option_3'),
  ]
  const [showPicker, setShowPicker] = useState(false)
  const [selectedValue, setSelectedValue] = useState(options[0])
  return (
    <Box flexDirection="row" alignItems="center" marginVertical="m">
      <Bars />
      <Text color="grayDark" fontSize={20} variant="bold" paddingStart="s">
        {t('hotspot_details.picker_title')}
      </Text>
      <TouchableOpacityBox
        flexDirection="row"
        marginHorizontal="xs"
        onPress={() => {
          setShowPicker(true)
        }}
      >
        <Text color="purpleMain" fontSize={20} variant="bold">
          {selectedValue}
        </Text>
        <Box padding="xs" paddingTop="ms">
          <CarotDown />
        </Box>
      </TouchableOpacityBox>
      <ModalPicker
        data={options.map((value) => ({ label: value, value }))}
        selectedValue={selectedValue}
        onValueChanged={(_value, index) => {
          setSelectedValue(options[index])
          onTimelineChanged(options[index], index)
        }}
        handleClose={() => setShowPicker(false)}
        visible={showPicker}
      />
    </Box>
  )
}

export default TimelinePicker
