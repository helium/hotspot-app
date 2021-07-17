/* eslint-disable react/jsx-props-no-spreading */
import { FlatList } from 'react-native-gesture-handler'
import { BoxProps } from '@shopify/restyle'
import React, {
  memo,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useState,
} from 'react'
import { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { Colors, Spacing, Theme } from '../theme/theme'
import Box from './Box'
import HeliumSelectItem, {
  HeliumSelectItemType,
  HeliumSelectVariant,
} from './HeliumSelectItem'
import { useColors } from '../theme/themeHooks'
import { hexToRGB } from '../utils/colorUtils'

type Props = Omit<BoxProps<Theme>, 'backgroundColor'> & {
  data: Array<HeliumSelectItemType>
  selectedValue: string | number
  onValueChanged: (itemValue: string | number, itemIndex: number) => void
  variant?: HeliumSelectVariant
  showGradient?: boolean
  contentContainerStyle?: StyleProp<ViewStyle>
  scrollEnabled?: boolean
  backgroundColor?: Colors
  itemPadding?: Spacing
  inverted?: boolean
}

const HeliumSelect = ({
  data,
  selectedValue,
  onValueChanged,
  variant = 'bubble',
  showGradient = true,
  backgroundColor = 'white',
  contentContainerStyle,
  scrollEnabled = true,
  itemPadding,
  inverted,
  ...boxProps
}: Props) => {
  const colors = useColors()
  const listRef = useRef<FlatList<HeliumSelectItemType>>(null)
  const [sizes, setSizes] = useState({} as Record<string | number, number>)

  const color = useMemo(() => colors[backgroundColor], [
    backgroundColor,
    colors,
  ])

  useEffect(() => {
    if (!selectedValue) return

    const index = data.findIndex((d) => d.value === selectedValue)
    if (index === -1) return

    const offset = [...Array(index)].reduce((total, _, i) => {
      const item = data[i]
      return total + sizes[item.value] || 0
    }, 0)

    listRef.current?.scrollToOffset({
      offset,
      animated: true,
    })
  }, [data, selectedValue, sizes])

  const handleLayout = useCallback(
    (index: number) => (event: LayoutChangeEvent) => {
      const item = data[index]
      const { width } = event.nativeEvent.layout
      setSizes((s) => ({ ...s, [item.value]: width }))
    },
    [data],
  )

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
      colors: [hexToRGB(color, 1), hexToRGB(color, 0)],
    }),
    [color],
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
      colors: [hexToRGB(color, 0), hexToRGB(color, 1)],
    }),
    [color],
  )

  type ListItem = { item: HeliumSelectItemType; index: number }
  const renderItem = useCallback(
    ({ item, index }: ListItem) => {
      return (
        <HeliumSelectItem
          handleLayout={handleLayout(index)}
          key={item.value}
          variant={variant}
          item={item}
          backgroundColor={backgroundColor}
          selected={item.value === selectedValue}
          onPress={handleItemSelected(item.value, index)}
          itemPadding={itemPadding}
        />
      )
    },
    [
      backgroundColor,
      handleItemSelected,
      handleLayout,
      itemPadding,
      selectedValue,
      variant,
    ],
  )

  const keyExtractor = useCallback(
    (item: HeliumSelectItemType) => `${item.value}`,
    [],
  )

  return (
    <Box width="100%" flexDirection="row" flex={1} height={33} {...boxProps}>
      <FlatList
        inverted={inverted}
        contentContainerStyle={contentContainerStyle}
        horizontal
        showsHorizontalScrollIndicator={false}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore This warning is a bug with react-native-gesture-handle
        ref={listRef}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        decelerationRate="fast"
        data={data}
        scrollEnabled={scrollEnabled}
      />
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
