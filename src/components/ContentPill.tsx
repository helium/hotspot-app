/* eslint-disable react/jsx-props-no-spreading */
import { BoxProps } from '@shopify/restyle'
import React, {
  memo,
  FC,
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
} from 'react'
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  ViewStyle,
} from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { SvgProps } from 'react-native-svg'
import LinearGradient from 'react-native-linear-gradient'
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
  contentContainerStyle?: ViewStyle
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
  const [showLeftGradiant, setShowLeftGradiant] = useState(false)
  const [showRightGradiant, setShowRightGradiant] = useState(false)
  const flatListRef = useRef<FlatList<ContentPillItem>>(null)

  const colors = useColors()
  const spacing = useSpacing()
  const radii = useBorderRadii()

  const handleItemPress = useCallback(
    (index: number) => () => onPressItem(index),
    [onPressItem],
  )

  useMemo(() => {
    setShowRightGradiant(data.length >= 6)
  }, [data.length])

  useEffect(() => {
    flatListRef?.current?.scrollToIndex({
      animated: true,
      index: selectedIndex,
    })
  }, [selectedIndex])

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
    } as ViewStyle

    if (contentContainerStyle) {
      return { ...defaultStyle, ...contentContainerStyle } as ViewStyle
    }

    return defaultStyle
  }, [contentContainerStyle, radii.round, spacing.xs])

  useEffect(() => {
    let padding: string | number = 0
    if (
      listContentStyle?.padding &&
      typeof listContentStyle.padding === 'number'
    ) {
      padding = listContentStyle.padding
    }
    const nextWidth = data.length * ITEM_SIZE + padding * 2
    if (nextWidth === viewWidth) return

    animateTransition('ContentPill.AnimateWidth')
    setViewWidth(nextWidth)
  }, [data.length, listContentStyle, viewWidth])

  const getItemLayout = (
    flatListData: Array<ContentPillItem> | null | undefined,
    index: number,
  ) => {
    const length = flatListData?.length || 0
    return {
      length,
      offset: (index - 1) * ITEM_SIZE,
      index,
    }
  }

  const closeToEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    return (
      event.nativeEvent.layoutMeasurement.width +
        event.nativeEvent.contentOffset.x >=
      event.nativeEvent.contentSize.width
    )
  }

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setShowLeftGradiant(event.nativeEvent.contentOffset.x > 0)
    setShowRightGradiant(!closeToEnd(event))
  }

  return (
    <Box
      borderRadius="round"
      margin="ms"
      backgroundColor="white"
      overflow="hidden"
      flexDirection="row"
      width={viewWidth}
      maxWidth={wp(30)}
      marginStart={data.length > 1 ? undefined : 'n_xxl'}
      {...boxProps}
    >
      <FlatList
        // This warning is a bug with react-native-gesture-handler
        ref={flatListRef}
        getItemLayout={getItemLayout}
        contentContainerStyle={listContentStyle}
        horizontal
        onScroll={onScroll}
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
      {showLeftGradiant && (
        <LinearGradient {...leftGradientProps} pointerEvents="none" />
      )}
      {showRightGradiant && (
        <LinearGradient {...rightGradientProps} pointerEvents="none" />
      )}
    </Box>
  )
}

const leftGradientProps = {
  style: {
    width: 75,
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
    width: 75,
    height: '100%',
    position: 'absolute',
    right: 0,
  } as StyleProp<ViewStyle>,
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
  colors: ['rgba(255,255,255,0)', 'rgba(255,255,255,1)'],
}

export default memo(ContentPill)
