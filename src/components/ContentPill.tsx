/* eslint-disable react/jsx-props-no-spreading */
import { BoxProps } from '@shopify/restyle'
import React, {
  memo,
  FC,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react'
import { StyleProp, ViewProps, ViewStyle } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { SvgProps } from 'react-native-svg'
import { Colors, Theme } from '../theme/theme'
import { useBorderRadii, useColors, useSpacing } from '../theme/themeHooks'
import animateTransition from '../utils/animateTransition'
import { wp } from '../utils/layout'
import Box from './Box'
import TouchableOpacityBox from './TouchableOpacityBox'

export type ContentPillItem = {
  selectedBackgroundColor: Colors
  iconColor: Colors
  selectedIconColor: Colors
  icon: FC<SvgProps>
  id: string
}

type Props = BoxProps<Theme> & {
  data: ContentPillItem[]
  selectedIndex: number
  onPressItem: (index: number) => void
  contentContainerStyle?: StyleProp<ViewProps>
  style?: ViewStyle
}

const ITEM_SIZE = 40
const ContentPill = ({
  data,
  selectedIndex,
  onPressItem,
  contentContainerStyle,
  ...boxProps
}: Props) => {
  const [viewWidth, setViewWidth] = useState(0)

  const colors = useColors()
  const spacing = useSpacing()
  const radii = useBorderRadii()

  const handleItemPress = useCallback(
    (index: number) => () => onPressItem(index),
    [onPressItem],
  )

  const renderItem = useCallback(
    ({ index, item }: { index: number; item: ContentPillItem }) => {
      const isSelected = index === selectedIndex
      return (
        <TouchableOpacityBox
          height={ITEM_SIZE}
          width={ITEM_SIZE}
          borderRadius="round"
          overflow="hidden"
          backgroundColor={
            isSelected ? item.selectedBackgroundColor : undefined
          }
          alignItems="center"
          justifyContent="center"
          onPress={handleItemPress(index)}
        >
          <item.icon
            color={colors[isSelected ? item.selectedIconColor : item.iconColor]}
            height={16}
          />
        </TouchableOpacityBox>
      )
    },
    [colors, handleItemPress, selectedIndex],
  )

  const keyExtractor = useCallback((item) => item.id, [])

  const listContentStyle = useMemo(() => {
    const defaultStyle = {
      borderRadius: radii.round,
      overflow: 'hidden',
      padding: spacing.xs,
    } as StyleProp<ViewProps>

    if (contentContainerStyle) return [defaultStyle, contentContainerStyle]

    return defaultStyle
  }, [contentContainerStyle, radii.round, spacing.xs])

  useEffect(() => {
    let padding = 0
    if (listContentStyle && 'padding' in listContentStyle) {
      padding = listContentStyle.padding
    }
    const nextWidth = data.length * 40 + padding * 2
    if (nextWidth === viewWidth) return

    animateTransition('ContentPill.AnimateWidth')
    setViewWidth(nextWidth)
  }, [data.length, listContentStyle, viewWidth])

  return (
    <Box
      borderRadius="round"
      margin="ms"
      backgroundColor="white"
      overflow="hidden"
      flexDirection="row"
      width={viewWidth}
      maxWidth={wp(30)}
      {...boxProps}
    >
      <FlatList
        contentContainerStyle={listContentStyle}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </Box>
  )
}

export default memo(ContentPill)