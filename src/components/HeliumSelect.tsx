/* eslint-disable react/jsx-props-no-spreading */
import { ScrollView } from 'react-native-gesture-handler'
import { BoxProps } from '@shopify/restyle'
import React, { memo, useCallback } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { Theme } from '../theme/theme'
import Box from './Box'
import HeliumSelectItem, {
  HeliumSelectItemType,
  HeliumSelectVariant,
} from './HeliumSelectItem'

type Props = BoxProps<Theme> & {
  data: Array<HeliumSelectItemType>
  selectedValue: string | number
  onValueChanged: (itemValue: string | number, itemIndex: number) => void
  variant?: HeliumSelectVariant
  showGradient?: boolean
}

const HeliumSelect = ({
  data,
  selectedValue,
  onValueChanged,
  variant = 'bubble',
  showGradient = true,
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Box {...boxProps} flexDirection="row" flex={1} height={33}>
          {data.map((item, index) => (
            <HeliumSelectItem
              key={item.value}
              variant={variant}
              item={item}
              selected={item.value === selectedValue}
              onPress={handleItemSelected(item.value, index)}
            />
          ))}
        </Box>
      </ScrollView>
      {showGradient && (
        <>
          <LinearGradient {...leftGradientProps} />
          <LinearGradient {...rightGradientProps} />
        </>
      )}
    </Box>
  )
}

export default memo(HeliumSelect)

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
