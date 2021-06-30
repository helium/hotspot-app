import React, {
  memo,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  useState,
} from 'react'
import Mask from '@assets/images/shortcutMask.svg'
import { FlatList } from 'react-native-gesture-handler'
import { Hotspot, Witness } from '@helium/http'
import { uniqBy, upperFirst } from 'lodash'
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
} from 'react-native'
import Globe from '@assets/images/globeShortcut.svg'
import Search from '@assets/images/searchShortcut.svg'
import Home from '@assets/images/homeShortcut.svg'
import Follow from '@assets/images/follow.svg'
import sleep from '../../../utils/sleep'
import { wp } from '../../../utils/layout'
import Text from '../../../components/Text'
import { useColors, useSpacing } from '../../../theme/themeHooks'
import Box from '../../../components/Box'
import usePrevious from '../../../utils/usePrevious'
import animateTransition from '../../../utils/animateTransition'
import TouchableOpacityBox from '../../../components/BSTouchableOpacityBox'

export const SHORTCUT_NAV_HEIGHT = 54
const ITEM_SIZE = 35
const ITEM_MARGIN = 's'

type Props = {
  ownedHotspots: Hotspot[]
  followedHotspots: Hotspot[]
  selectedItem: GlobalOpt | Hotspot | Witness
  onItemSelected: (item: GlobalOpt | Hotspot) => void
}
const GLOBAL_OPTS = ['explore', 'search', 'home'] as const
export type GlobalOpt = typeof GLOBAL_OPTS[number]

export const IS_GLOBAL_OPT = (
  item: GlobalOpt | Hotspot | Witness,
): item is GlobalOpt => typeof item === 'string'

type FollowedHotspot = Hotspot & { followed?: boolean }

const ShortcutNav = ({
  ownedHotspots,
  followedHotspots,
  selectedItem,
  onItemSelected,
}: Props) => {
  const colors = useColors()
  const spacing = useSpacing()
  const listRef = useRef<FlatList<Hotspot | Witness | GlobalOpt>>(null)
  const snapPos = useRef<number>(0)
  const scrollOffset = useRef(0)
  const followChanged = useRef(false)
  const optSize = ITEM_SIZE + spacing[ITEM_MARGIN]
  const prevFollowed = usePrevious(followedHotspots)
  const [sizes, setSizes] = useState(
    GLOBAL_OPTS.reduce(
      (obj, item) => ({ ...obj, [item]: optSize }),
      {} as Record<string, number>,
    ),
  )

  const ownerAddress = useMemo(
    () => (ownedHotspots.length ? ownedHotspots[0].owner : ''),
    [ownedHotspots],
  )

  const hotspots = useMemo(() => {
    // sort order
    // 1. Owned and Followed
    // 2. Followed
    // 3. Owned

    const sortedFollowed = followedHotspots.sort((h) =>
      h.owner === ownerAddress ? -1 : 1,
    )
    const unique = uniqBy(
      [
        ...sortedFollowed.map((h) => ({ ...h, followed: true })),
        ...ownedHotspots,
      ],
      (h) => h.address,
    )
    return unique as FollowedHotspot[]
  }, [followedHotspots, ownedHotspots, ownerAddress])

  const isSelected = useCallback(
    (
      item: GlobalOpt | Witness | Hotspot,
      selected: GlobalOpt | Witness | Hotspot,
    ) => {
      if (IS_GLOBAL_OPT(selected) && IS_GLOBAL_OPT(item)) {
        return selected === item
      }
      if (!IS_GLOBAL_OPT(selected) && !IS_GLOBAL_OPT(item)) {
        return selected.address === item.address
      }

      return false
    },
    [],
  )

  useEffect(() => {
    if (prevFollowed && followedHotspots.length !== prevFollowed.length) {
      followChanged.current = true
      animateTransition('ShortcutNav.FollowChanged', {
        enabledOnAndroid: false,
      })
    }
  }, [followedHotspots, prevFollowed])

  const data = useMemo(() => {
    return [...GLOBAL_OPTS, ...hotspots]
  }, [hotspots])

  const handleLayout = useCallback(
    (index: number) => (event: LayoutChangeEvent) => {
      const item = data[index]
      if (IS_GLOBAL_OPT(item)) return

      const { width } = event.nativeEvent.layout
      setSizes((s) => ({ ...s, [item.address]: width }))
    },
    [data],
  )

  const scrollOffsets = useMemo(
    () =>
      data.reduce((total, item, index) => {
        let offset = 0
        if (index === 0) return [offset]

        if (index < GLOBAL_OPTS.length) {
          offset = index * (ITEM_SIZE + spacing[ITEM_MARGIN])
        } else if (!IS_GLOBAL_OPT(item)) {
          if (index === GLOBAL_OPTS.length) {
            offset =
              2.5 * ITEM_SIZE +
              3 * spacing[ITEM_MARGIN] +
              sizes[item.address] / 2
          } else {
            let sizeKey = ''
            const prevItem = data[index - 1]
            if (IS_GLOBAL_OPT(prevItem)) {
              sizeKey = prevItem
            } else {
              sizeKey = prevItem.address
            }
            offset =
              total[index - 1] +
              sizes[item.address] / 2 +
              sizes[sizeKey] / 2 +
              spacing[ITEM_MARGIN]
          }
        }

        return [...total, offset || 0]
      }, [] as number[]),
    [data, sizes, spacing],
  )

  const scroll = useCallback(
    (index: number, animated = true) => {
      let offset = 0
      if (index >= 0) {
        offset = scrollOffsets[index]
      }

      if (scrollOffset.current === offset) {
        // Don't scroll, if you're already there
        return
      }
      listRef.current?.scrollToOffset({ offset, animated })
    },
    [scrollOffsets],
  )

  const handlePress = useCallback(
    (item: GlobalOpt | Hotspot) => async () => {
      if (Platform.OS === 'android') {
        onItemSelected(item)
        await sleep(100) // let the ui update, then scroll over
      }

      scroll(data.findIndex((d) => isSelected(d, item)))

      if (
        // they're viewing a hotspot they don't own or follow
        // need to select it on ios because the scroll won't trigger selection
        Platform.OS === 'ios' &&
        item === 'explore' &&
        scrollOffset.current === 0
      ) {
        onItemSelected(item)
      }
    },
    [data, isSelected, onItemSelected, scroll],
  )

  const backgroundColor = useCallback(
    (item: FollowedHotspot, selected: boolean) => {
      if (item.owner === ownerAddress) {
        return selected ? 'blueBright' : 'blueBright60'
      }
      return selected ? 'purpleBright' : 'purpleBright60'
    },
    [ownerAddress],
  )

  const renderHotspot = useCallback(
    (item: FollowedHotspot, index: number) => {
      if (!item.name) return null

      const selected = isSelected(item, selectedItem)
      const [, , animal] = item.name.split('-')

      return (
        <TouchableOpacityBox
          hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          backgroundColor={backgroundColor(item, selected)}
          onLayout={handleLayout(index)}
          onPress={handlePress(item)}
          borderRadius="round"
          marginRight={ITEM_MARGIN}
          height={ITEM_SIZE}
          flexDirection="row"
          paddingHorizontal="m"
          alignItems="center"
        >
          <Box paddingRight="xs">
            {item.followed && (
              <Follow height={12} width={12} color={colors.primaryBackground} />
            )}
          </Box>
          <Text
            variant="medium"
            fontSize={16}
            color="purpleDark"
            maxFontSizeMultiplier={1}
          >
            {upperFirst(animal)}
          </Text>
        </TouchableOpacityBox>
      )
    },
    [
      backgroundColor,
      colors.primaryBackground,
      handleLayout,
      handlePress,
      isSelected,
      selectedItem,
    ],
  )

  const renderGlobalOpt = useCallback(
    (item: GlobalOpt) => {
      const selected = isSelected(item, selectedItem)

      const getIcon = () => {
        const color = () => {
          if (selected) {
            return colors.purpleDark
          }
          return colors.purpleBrightMuted
        }
        switch (item) {
          case 'home':
            return <Home color={color()} />
          case 'explore':
            return <Globe color={color()} />
          case 'search':
            return <Search color={color()} />
        }
      }
      return (
        <TouchableOpacityBox
          alignItems="center"
          hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          onPress={handlePress(item)}
          justifyContent="center"
          borderRadius="round"
          width={ITEM_SIZE}
          height={ITEM_SIZE}
          marginRight={ITEM_MARGIN}
          backgroundColor={selected ? 'white' : 'purpleMuted'}
        >
          {getIcon()}
        </TouchableOpacityBox>
      )
    },
    [colors, handlePress, isSelected, selectedItem],
  )

  type ListItem = { item: Hotspot | GlobalOpt; index: number }
  const renderItem = useCallback(
    ({ item, index }: ListItem) => {
      if (IS_GLOBAL_OPT(item)) {
        return renderGlobalOpt(item as GlobalOpt)
      }
      return renderHotspot(item, index)
    },
    [renderGlobalOpt, renderHotspot],
  )

  const keyExtractor = useCallback((item: GlobalOpt | Hotspot) => {
    if (IS_GLOBAL_OPT(item)) {
      return item
    }
    return item.address
  }, [])

  useEffect(() => {
    const index = data.findIndex((d) => isSelected(d, selectedItem))
    scroll(index, Platform.OS === 'android')
  }, [selectedItem, data, scroll, isSelected, scrollOffsets])

  const contentContainerStyle = useMemo(
    () => ({ paddingHorizontal: wp(50) - ITEM_SIZE / 2 }),
    [],
  )

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollOffset.current = event.nativeEvent.contentOffset.x
    },
    [],
  )

  const handleScrollMomentum = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      let snapIndex = 0
      const scrolledOffset = event.nativeEvent.contentOffset.x

      let highIndex = scrollOffsets.findIndex(
        (offset) => offset > scrolledOffset,
      )
      if (highIndex === -1) {
        // couldn't find an offset larger than scrolled position
        // snap to last position
        highIndex = scrollOffsets.length - 1
      }

      if (highIndex > 0) {
        const lowIndex = highIndex - 1
        const lowDiff = scrolledOffset - scrollOffsets[lowIndex]
        const highDiff = scrollOffsets[highIndex] - scrolledOffset
        snapIndex = lowDiff < highDiff ? lowIndex : highIndex
      }
      const nextItem = data[snapIndex]
      const nextPos = scrollOffsets[snapIndex]

      if (nextItem === selectedItem) return

      snapPos.current = nextPos
      onItemSelected(nextItem)
    },
    [data, onItemSelected, scrollOffsets, selectedItem],
  )
  return (
    <Box height={SHORTCUT_NAV_HEIGHT} backgroundColor="primaryBackground">
      <Box top={-43} left={0} right={0} height={43} position="absolute">
        <Mask width="100%" color={colors.primaryBackground} />
      </Box>
      <FlatList
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore This warning is a bug with react-native-gesture-handle
        ref={listRef}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={data}
        contentContainerStyle={contentContainerStyle}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScrollMomentum}
        snapToOffsets={scrollOffsets}
        decelerationRate="fast"
      />
    </Box>
  )
}

export default memo(ShortcutNav)
