import React, { memo, ReactText } from 'react'
import { useTranslation } from 'react-i18next'
import { Picker } from '@react-native-picker/picker'
import { Modal } from 'react-native'
import Box from './Box'
import TouchableOpacityBox from './TouchableOpacityBox'
import Text from './Text'
import { useColors } from '../theme/themeHooks'

type Props = {
  data: Array<{ label: string; value: string }>
  selectedValue: string
  onValueChanged: (itemValue: ReactText, itemIndex: number) => void
  visible: boolean
  handleClose: () => void
}

const ModalPicker = ({
  data,
  selectedValue,
  onValueChanged,
  visible,
  handleClose,
}: Props) => {
  const { grayLight } = useColors()
  const { t } = useTranslation()
  return (
    <Modal
      visible={visible}
      onRequestClose={handleClose}
      animationType="slide"
      transparent
    >
      <Box flex={1} justifyContent="flex-end">
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          onTouchStart={handleClose}
        />
        <Box backgroundColor="grayBox">
          <TouchableOpacityBox alignSelf="flex-end">
            <Text
              color="purpleMain"
              variant="body1Medium"
              paddingVertical="ms"
              paddingHorizontal="m"
              onPress={handleClose}
            >
              {t('generic.done')}
            </Text>
          </TouchableOpacityBox>
          <Picker
            selectedValue={selectedValue}
            style={{
              width: '100%',
              backgroundColor: grayLight,
            }}
            onValueChange={(itemValue, itemIndex) =>
              onValueChanged(itemValue, itemIndex)
            }
          >
            {data.map(({ label, value }) => (
              <Picker.Item label={label} value={value} />
            ))}
          </Picker>
        </Box>
      </Box>
    </Modal>
  )
}

export default memo(ModalPicker)
