import React, {
  memo,
  ReactText,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import RNPickerSelect from 'react-native-picker-select'
import CarotDown from '@assets/images/carot-down.svg'
import { BoxProps } from '@shopify/restyle'
import { Platform } from 'react-native'
import Box from './Box'
import Text from './Text'
import { useColors, useTextVariants } from '../theme/themeHooks'
import { Theme } from '../theme/theme'

type Props = BoxProps<Theme> & {
  data: Array<{ label: string; value: string }>
  selectedValue: string
  onValueChanged: (itemValue: ReactText, itemIndex: number) => void
  prefix?: string
}

const ModalPicker = ({
  data,
  selectedValue,
  onValueChanged,
  prefix,
  ...boxProps
}: Props) => {
  const textVariants = useTextVariants()
  const { purpleMain } = useColors()
  const pickerRef = useRef<RNPickerSelect>(null)
  const [valueIndex, setValueIndex] = useState<{
    value: string
    index: number
  }>({
    value: selectedValue,
    index: data.findIndex(({ value }) => value === selectedValue),
  })

  const changeValue = useCallback(async () => {
    onValueChanged(valueIndex.value, valueIndex.index)
  }, [onValueChanged, valueIndex.index, valueIndex.value])

  const handleChange = useCallback((value, index) => {
    setValueIndex({ value, index })
  }, [])

  useEffect(() => {
    if (valueIndex.value === selectedValue) return

    changeValue()
  }, [changeValue, selectedValue, valueIndex.value])

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Box flexDirection="row" alignItems="center" {...boxProps}>
      {prefix && (
        <Text
          color="grayDark"
          variant="h4"
          paddingRight={Platform.OS === 'android' ? 'none' : 'xs'}
        >
          {prefix}
        </Text>
      )}
      <RNPickerSelect
        ref={pickerRef}
        placeholder={{}}
        touchableWrapperProps={{ activeOpacity: 0.35 }}
        Icon={CarotDown}
        style={{
          iconContainer: {
            padding: 10,
            top: Platform.OS === 'android' ? 12 : 8,
          },
          inputIOSContainer: {
            paddingRight: 24,
          },
          inputAndroidContainer: {
            paddingRight: 16,
          },
          inputIOS: {
            ...textVariants.h4,
            color: purpleMain,
            paddingVertical: 8,
          },
          inputAndroid: {
            ...textVariants.h4,
            color: purpleMain,
            paddingVertical: 8,
          },
        }}
        items={data}
        value={valueIndex.value}
        onValueChange={handleChange}
        useNativeAndroidPickerStyle={false}
        fixAndroidTouchableBug
      />
    </Box>
  )
}

export default memo(ModalPicker)
