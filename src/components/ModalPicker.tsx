import React, { memo, ReactText, useRef, useMemo } from 'react'
import RNPickerSelect from 'react-native-picker-select'
import CarotDown from '@assets/images/carot-down-picker.svg'
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
  minWidth?: number
}

const ModalPicker = ({
  data,
  selectedValue,
  onValueChanged,
  prefix,
  minWidth,
  ...boxProps
}: Props) => {
  const textVariants = useTextVariants()
  const { purpleMain } = useColors()
  const pickerRef = useRef<RNPickerSelect>(null)

  const touchableProps = useMemo(() => ({ activeOpacity: 0.35, minWidth }), [
    minWidth,
  ])
  const pickerStyle = useMemo(
    () => ({
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
      viewContainer: { minWidth },
    }),
    [purpleMain, textVariants.h4, minWidth],
  )
  const placeholder = {}
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
        placeholder={placeholder}
        touchableWrapperProps={touchableProps}
        Icon={CarotDown}
        style={pickerStyle}
        items={data}
        value={selectedValue}
        onValueChange={onValueChanged}
        useNativeAndroidPickerStyle={false}
        fixAndroidTouchableBug
      />
    </Box>
  )
}

export default memo(ModalPicker)
