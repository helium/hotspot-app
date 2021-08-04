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
import { Hotspot, Validator, Witness } from '@helium/http'
import { uniqBy, upperFirst } from 'lodash'
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native'
import Globe from '@assets/images/globeShortcut.svg'
import Search from '@assets/images/searchShortcut.svg'
import Home from '@assets/images/homeShortcut.svg'
import HotspotIcon from '@assets/images/hotspotPillIcon.svg'
import ValidatorIcon from '@assets/images/validatorPillIcon.svg'
import Follow from '@assets/images/follow.svg'
import animalName from 'angry-purple-tiger'
import { wp } from '../../../utils/layout'
import Text from '../../../components/Text'
import { useColors, useSpacing } from '../../../theme/themeHooks'
import Box from '../../../components/Box'
import usePrevious from '../../../utils/usePrevious'
import TouchableOpacityBox from '../../../components/BSTouchableOpacityBox'
import { GlobalOpt, GLOBAL_OPTS } from './hotspotTypes'
import { isGlobalOption } from '../../../utils/hotspotUtils'
import { isValidator } from '../../../utils/validatorUtils'
import animateTransition from '../../../utils/animateTransition'
import sleep from '../../../utils/sleep'
import { Colors } from '../../../theme/theme'

const validatorColors = {
  text: 'purpleDark' as Colors,
  background: 'purpleBright' as Colors,
  icon: 'purpleDark' as Colors,
}
const hotspotColors = {
  text: 'purpleDark' as Colors,
  background: 'blueBright' as Colors,
  icon: 'purpleDark' as Colors,
}

const itemColors = {
  validator: {
    owned: {
      ...validatorColors,
    },
    followedAndOwned: {
      ...validatorColors,
      text: 'purpleDark' as Colors,
      icon: 'purpleBright' as Colors,
    },
    followedAndUnowned: {
      ...validatorColors,
      background: 'purpleBright30' as Colors,
      text: 'purpleBright' as Colors,
    },
  },
  hotspot: {
    owned: {
      ...hotspotColors,
    },
    followedAndOwned: {
      ...hotspotColors,
      text: 'purpleDark' as Colors,
      icon: 'blueBright' as Colors,
    },
    followedAndUnowned: {
      ...hotspotColors,
      background: 'blueBright30' as Colors,
      text: 'blueBright' as Colors,
    },
  },
}

export const SHORTCUT_NAV_HEIGHT = 44
const ITEM_SIZE = 35
const ITEM_MARGIN = 's'
const hitSlop = { top: 8, bottom: 8, left: 4, right: 4 }
type Followed = { followed?: boolean }
type FollowedHotspot = Hotspot & Followed
type FollowedValidator = Hotspot & Followed
type Item = { address: string; owner?: string; name?: string }

const getItemId = (item: GlobalOpt | Item) =>
  isGlobalOption(item) ? item : item.address

const getAnimalName = <T extends Item>(item: T) => {
  const pieces = (item.name || animalName(item.address)).split('-')
  return pieces[pieces.length - 1]
}

const sortByName = <T extends Item>(items: T[]) =>
  items.sort((l, r) => (getAnimalName(l) > getAnimalName(r) ? 1 : -1))

const sortItems = <T extends Item>({
  followed,
  owned,
  ownerAddress,
}: {
  followed: T[]
  owned: T[]
  ownerAddress?: string
}) => {
  // sort order
  // 1. Owned and Followed
  // 2. Followed
  // 3. Owned

  type FollowedItem = T & Followed
  const uniqueItems = uniqBy(
    [...followed.map((h) => ({ ...h, followed: true })), ...owned],
    (h) => h.address,
  ) as FollowedItem[]

  const groupedItems = uniqueItems.reduce(
    (val, item) => {
      if (!item.followed) {
        return { ...val, owned: [...val.owned, item] }
      }
      if (item.owner === ownerAddress) {
        return {
          ...val,
          ownedAndFollowed: [...val.ownedAndFollowed, item],
        }
      }
      return { ...val, followed: [...val.followed, item] }
    },
    {
      ownedAndFollowed: [] as FollowedItem[],
      followed: [] as FollowedItem[],
      owned: [] as FollowedItem[],
    } as Record<'ownedAndFollowed' | 'followed' | 'owned', FollowedItem[]>,
  )

  return [
    ...sortByName(groupedItems.ownedAndFollowed),
    ...sortByName(groupedItems.followed),
    ...sortByName(groupedItems.owned),
  ]
}

type Props = {
  ownedHotspots: Hotspot[]
  followedHotspots: Hotspot[]
  ownedValidators: Validator[]
  followedValidators: Validator[]
  initialDataLoaded: boolean
  selectedItem: GlobalOpt | Hotspot | Witness
  onItemSelected: (item: GlobalOpt | Hotspot | Validator) => void
}

const ShortcutNav = ({
  ownedHotspots,
  followedHotspots,
  ownedValidators,
  followedValidators,
  initialDataLoaded,
  selectedItem: propsItem,
  onItemSelected,
}: Props) => {
  const colors = useColors()
  const spacing = useSpacing()
  const listRef = useRef<FlatList<Hotspot | Witness | GlobalOpt>>(null)
  const snapPos = useRef<number>(0)
  const hasFollowHotspotChange = useRef(false)
  const disableMomentumSnap = useRef(false)
  const scrollOffset = useRef(0)
  const [internalItem, setInternalItem] = useState({ index: 2, id: 'home' })
  const hasScrolledToHome = useRef(false)
  const prevFollowed = usePrevious(followedHotspots)
  const [sizes, setSizes] = useState({} as Record<string, number | null>)
  const [data, setData] = useState<(GlobalOpt | Validator | Hotspot)[]>([])

  const ownerAddress = useMemo(
    () => (ownedHotspots.length ? ownedHotspots[0].owner : ''),
    [ownedHotspots],
  )

  const hotspots = useMemo(() => {
    return sortItems({
      owned: ownedHotspots,
      followed: followedHotspots,
      ownerAddress,
    })
  }, [followedHotspots, ownedHotspots, ownerAddress])

  const validators = useMemo(() => {
    return sortItems({
      owned: ownedValidators,
      followed: followedValidators,
      ownerAddress,
    })
  }, [followedValidators, ownedValidators, ownerAddress])

  const isSelected = useCallback(
    (
      item: GlobalOpt | Witness | Hotspot,
      selected: GlobalOpt | Witness | Hotspot,
    ) => {
      if (isGlobalOption(selected) && isGlobalOption(item)) {
        return selected === item
      }
      if (!isGlobalOption(selected) && !isGlobalOption(item)) {
        return selected.address === item.address
      }

      return false
    },
    [],
  )

  useEffect(() => {
    if (!initialDataLoaded) return
    const nextData = [...validators, ...GLOBAL_OPTS, ...hotspots]
    animateTransition('ShortcutNav.dataLoaded', { enabledOnAndroid: false })
    setData(nextData)
  }, [data.length, hotspots, initialDataLoaded, validators])

  const handleLayout = useCallback(
    (index: number) => (event: LayoutChangeEvent) => {
      const item = data[index]
      const { width } = event.nativeEvent.layout
      setSizes((s) => ({ ...s, [getItemId(item)]: width }))
    },
    [data],
  )

  const scrollOffsets = useMemo(
    () =>
      data.reduce((total, item, index) => {
        let offset = 0
        if (index === 0) {
          return [offset]
        }

        const prevItem = data[index - 1]
        const prevSize = sizes[getItemId(prevItem)] || 0
        const currentSize = sizes[getItemId(item)] || 0

        offset =
          total[index - 1] +
          currentSize / 2 +
          prevSize / 2 +
          spacing[ITEM_MARGIN]

        return [...total, offset]
      }, [] as number[]),
    [data, sizes, spacing],
  )

  const scroll = useCallback(
    (index: number, animated = true) => {
      disableMomentumSnap.current = true
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

  useEffect(() => {
    // Scroll to home when component first mounts
    if (
      hasScrolledToHome.current ||
      Object.keys(sizes).length < data.length ||
      !initialDataLoaded ||
      data.length === 0
    )
      return

    hasScrolledToHome.current = true

    const scrollWithDelay = async () => {
      await sleep(300)
      const scrollIndex = validators.length + 2
      scroll(scrollIndex, true)
    }
    scrollWithDelay()
  }, [data.length, initialDataLoaded, scroll, sizes, validators.length])

  useEffect(() => {
    if (getItemId(propsItem) === internalItem.id) {
      return
    }

    const index = data.findIndex(
      (item) => getItemId(item) === getItemId(propsItem),
    )

    if (index === -1) return

    // The selected item was changed from the outside world
    // Track it and scroll to it
    setInternalItem({
      index,
      id: getItemId(propsItem),
    })

    scroll(index)
  }, [data, scroll, propsItem, internalItem.id])

  const handleItemSelected = useCallback(
    (item: GlobalOpt | Hotspot | Validator) => {
      if (getItemId(item) === getItemId(propsItem)) {
        return
      }
      setInternalItem({
        index: data.indexOf(item),
        id: getItemId(item),
      })
      onItemSelected(item)
    },
    [data, onItemSelected, propsItem],
  )

  useEffect(() => {
    // if there's a newly followed hotspot, wait for sizes to update then scroll to it
    if (!hasFollowHotspotChange.current) return

    const allSizesFound = data.every((d) => !!sizes[getItemId(d)])
    if (!allSizesFound) return

    const nextIndex = data.findIndex((d) => isSelected(d, propsItem))
    if (nextIndex === -1) return

    hasFollowHotspotChange.current = false
    scroll(nextIndex)
  }, [data, isSelected, scroll, propsItem, sizes])

  useEffect(() => {
    if (prevFollowed && followedHotspots.length !== prevFollowed.length) {
      // remove this item from the size list
      if (internalItem.index >= GLOBAL_OPTS.length && propsItem) {
        sizes[getItemId(propsItem)] = null
      }

      if (followedHotspots.length < prevFollowed.length) {
        // a hotspot has been unfollowed, snap to nearest pill
        const maxIndex = data.length - 1
        const nextIndex = Math.min(maxIndex, internalItem.index)
        handleItemSelected(data[nextIndex])
      }

      hasFollowHotspotChange.current = true
    }
  }, [
    data,
    followedHotspots.length,
    handleItemSelected,
    isSelected,
    prevFollowed,
    propsItem,
    internalItem,
    sizes,
  ])

  const handlePress = useCallback(
    (item: GlobalOpt | Hotspot) => async () => {
      handleItemSelected(item)
      scroll(data.findIndex((d) => isSelected(d, item)))
    },
    [data, handleItemSelected, isSelected, scroll],
  )

  const renderGateway = useCallback(
    (item: FollowedHotspot | FollowedValidator, index: number) => {
      if (!item.name) return null
      const isOwner = item.owner === ownerAddress
      const followedAndUnowned = item.followed && !isOwner
      const followedAndOwned = item.followed && isOwner
      const [, , animal] = item.name.split('-')
      const itemIsValidator = isValidator(item)
      const colorObj = itemColors[itemIsValidator ? 'validator' : 'hotspot']
      let colorScheme = colorObj.owned
      if (followedAndOwned) {
        colorScheme = colorObj.followedAndOwned
      } else if (followedAndUnowned) {
        colorScheme = colorObj.followedAndUnowned
      }
      return (
        <TouchableOpacityBox
          hitSlop={hitSlop}
          onLayout={handleLayout(index)}
          onPress={handlePress(item)}
          borderRadius="round"
          backgroundColor={colorScheme.background}
          marginRight={ITEM_MARGIN}
          height={ITEM_SIZE}
          flexDirection="row"
          paddingRight="m"
          paddingLeft={item.followed ? 'xs' : 'm'}
          alignItems="center"
        >
          <Box
            marginRight="s"
            borderRadius="round"
            height={27}
            width={27}
            alignItems="center"
            justifyContent="center"
            backgroundColor={colorScheme.text}
          >
            {item.followed && (
              <Follow height={12} width={12} color={colors[colorScheme.icon]} />
            )}
          </Box>
          {itemIsValidator ? (
            <ValidatorIcon color={colors[colorScheme.text]} />
          ) : (
            <HotspotIcon color={colors[colorScheme.text]} />
          )}
          <Text
            variant="medium"
            fontSize={16}
            color={colorScheme.text}
            maxFontSizeMultiplier={1}
            marginLeft="s"
          >
            {upperFirst(animal)}
          </Text>
        </TouchableOpacityBox>
      )
    },
    [ownerAddress, handleLayout, handlePress, colors],
  )

  const renderGlobalOpt = useCallback(
    (item: GlobalOpt, index: number) => {
      const selected = isSelected(item, propsItem)

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
          hitSlop={hitSlop}
          onPress={handlePress(item)}
          justifyContent="center"
          borderRadius="round"
          width={ITEM_SIZE}
          height={ITEM_SIZE}
          marginRight={ITEM_MARGIN}
          backgroundColor={selected ? 'white' : 'purpleDarkMuted'}
          onLayout={handleLayout(index)}
        >
          {getIcon()}
        </TouchableOpacityBox>
      )
    },
    [colors, handleLayout, handlePress, isSelected, propsItem],
  )

  type ListItem = { item: Hotspot | GlobalOpt; index: number }
  const renderItem = useCallback(
    ({ item, index }: ListItem) => {
      if (isGlobalOption(item)) {
        return renderGlobalOpt(item as GlobalOpt, index)
      }
      return renderGateway(item, index)
    },
    [renderGlobalOpt, renderGateway],
  )

  const keyExtractor = useCallback((item: GlobalOpt | Hotspot) => {
    if (isGlobalOption(item)) {
      return item
    }
    return item.address
  }, [])

  const contentContainerStyle = useMemo(() => {
    const halfWidth = wp(50)
    let firstItemWidth = ITEM_SIZE
    if (data.length && isValidator(data[0])) {
      firstItemWidth = sizes[data[0].address] || 0
    }
    const paddingStart = halfWidth - firstItemWidth / 2

    const lastItem = data[data.length - 1]
    let lastItemWidth = ITEM_SIZE
    if (lastItem && !isGlobalOption(lastItem) && sizes[lastItem.address]) {
      lastItemWidth = sizes[lastItem.address] || 0
    }
    const paddingEnd = halfWidth - lastItemWidth / 2 - spacing.s
    return { paddingStart, paddingEnd }
  }, [data, sizes, spacing.s])

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollOffset.current = event.nativeEvent.contentOffset.x
    },
    [],
  )

  const handleScrollMomentum = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (disableMomentumSnap.current) return

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

      if (nextItem === propsItem) return

      snapPos.current = nextPos
      handleItemSelected(nextItem)
    },
    [data, handleItemSelected, scrollOffsets, propsItem],
  )

  const handleBeginDrag = useCallback(() => {
    disableMomentumSnap.current = false
  }, [])

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
        initialNumToRender={10000} // Need all pills to render in order to avoid snap jank
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onScroll={handleScroll}
        onScrollBeginDrag={handleBeginDrag}
        onMomentumScrollEnd={handleScrollMomentum}
        snapToOffsets={scrollOffsets}
        decelerationRate="fast"
      />
    </Box>
  )
}

export default memo(ShortcutNav)
