/* eslint-disable react/jsx-props-no-spreading */
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { BoxProps } from '@shopify/restyle'
import React, { memo, useCallback } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { Theme } from '../theme/theme'
import Box from './Box'
import BubbleSelectItem, { BubbleSelectItemType } from './BubbleSelectItem'

type Props = BoxProps<Theme> & {
  data: Array<BubbleSelectItemType>
  selectedValue: string | number
  onValueChanged: (itemValue: string | number, itemIndex: number) => void
}

const BubbleSelect = ({
  data,
  selectedValue,
  onValueChanged,
  ...boxProps
}: Props) => {
  const handleItemSelected = useCallback(
    (value: string | number, index: number) => async () => {
      onValueChanged(value, index)
    },
    [onValueChanged],
  )

  return (
    <Box>
      <BottomSheetScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Box {...boxProps} flexDirection="row" flex={1} height={33}>
          {data.map((item, index) => (
            <BubbleSelectItem
              key={item.value}
              item={item}
              selected={item.value === selectedValue}
              onPress={handleItemSelected(item.value, index)}
            />
          ))}
        </Box>
      </BottomSheetScrollView>
      <LinearGradient {...leftGradientProps} />
      <LinearGradient {...rightGradientProps} />
    </Box>
  )
}

export default memo(BubbleSelect)

const leftGradientProps = {
  style: {
    width: 24,
    height: '100%',
    position: 'absolute',
    left: 0,
  } as StyleProp<ViewStyle>,
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
  colors: ['rgba(255,255,255,1)', 'rgba(255,255,255,0)'],
}

const rightGradientProps = {
  style: {
    width: 24,
    height: '100%',
    position: 'absolute',
    right: 0,
  } as StyleProp<ViewStyle>,
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
  colors: ['rgba(255,255,255,0)', 'rgba(255,255,255,1)'],
}
