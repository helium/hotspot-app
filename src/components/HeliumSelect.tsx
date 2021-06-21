/* eslint-disable react/jsx-props-no-spreading */
import { ScrollView } from 'react-native-gesture-handler'
import { BoxProps } from '@shopify/restyle'
import React, { memo, useCallback, useMemo } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { Colors, Theme } from '../theme/theme'
import Box from './Box'
import HeliumSelectItem, {
  HeliumSelectItemType,
  HeliumSelectVariant,
} from './HeliumSelectItem'
import { useColors } from '../theme/themeHooks'
import { hexToRGB } from '../utils/colorUtils'

type Props = BoxProps<Theme> & {
  data: Array<HeliumSelectItemType>
  selectedValue: string | number
  onValueChanged: (itemValue: string | number, itemIndex: number) => void
  variant?: HeliumSelectVariant
  showGradient?: boolean
  backgroundColor?: Colors
}

const HeliumSelect = ({
  data,
  selectedValue,
  onValueChanged,
  variant = 'bubble',
  showGradient = true,
  backgroundColor,
  ...boxProps
}: Props) => {
  const colors = useColors()
  const handleItemSelected = useCallback(
    (value: string | number, index: number) => async () => {
      onValueChanged(value, index)
    },
    [onValueChanged],
  )

  const leftGradientProps = useMemo(
    () => ({
      style: {
        width: 24,
        height: '100%',
        position: 'absolute',
        left: 0,
      } as StyleProp<ViewStyle>,
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
      colors: [
        hexToRGB(colors[backgroundColor || 'white'], 1),
        hexToRGB(colors[backgroundColor || 'white'], 0),
      ],
    }),
    [backgroundColor, colors],
  )

  const rightGradientProps = useMemo(
    () => ({
      style: {
        width: 24,
        height: '100%',
        position: 'absolute',
        right: 0,
      } as StyleProp<ViewStyle>,
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
      colors: [
        hexToRGB(colors[backgroundColor || 'white'], 0),
        hexToRGB(colors[backgroundColor || 'white'], 1),
      ],
    }),
    [backgroundColor, colors],
  )

  return (
    <Box width="100%">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Box
          {...boxProps}
          flexDirection="row"
          flex={1}
          height={33}
          backgroundColor={backgroundColor}
        >
          {data.map((item, index) => (
            <HeliumSelectItem
              key={item.value}
              variant={variant}
              item={item}
              backgroundColor={backgroundColor}
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
