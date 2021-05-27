import React, { useCallback, useMemo } from 'react'
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { useTranslation } from 'react-i18next'
import { Hotspot } from '@helium/http'
import HexPill from '@assets/images/hexPill.svg'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import { wp } from '../../../utils/layout'
import ContentPill, { ContentPillItem } from '../../../components/ContentPill'
import { Colors } from '../../../theme/theme'

const HotspotsViewHeader = ({
  animatedPosition,
  buttonsVisible = true,
  detailHeaderHeight,
  showNoLocation,
  hexHotspots,
  ownedHotspots,
  followedHotspots,
  onHotspotSelected = () => {},
  selectedHotspotIndex = 0,
}: {
  animatedPosition: Animated.SharedValue<number>
  buttonsVisible?: boolean
  detailHeaderHeight: number
  showNoLocation: boolean
  hexHotspots: Hotspot[]
  ownedHotspots?: Hotspot[]
  followedHotspots?: Hotspot[]
  onHotspotSelected?: (index: number, hotspot: Hotspot) => void
  selectedHotspotIndex: number
}) => {
  const { t } = useTranslation()

  const style = useAnimatedStyle(
    () => ({
      position: 'absolute',
      bottom: -100,
      left: 0,
      right: 0,
      opacity: buttonsVisible || showNoLocation ? 1 : 0,
      transform: [
        {
          translateY: interpolate(
            animatedPosition.value,
            [-1, 0],
            [0, -1 * (detailHeaderHeight + (showNoLocation ? 80 : 220))],
            Extrapolate.CLAMP,
          ),
        },
      ],
    }),
    [animatedPosition, buttonsVisible, detailHeaderHeight],
  )

  const getContentColor = useCallback((isFollowed, isOwned): Colors => {
    if (isFollowed) return 'purpleBright'
    if (isOwned) return 'blueBright'
    return 'blueGrayLight'
  }, [])

  const pillData = useMemo(() => {
    if (!hexHotspots?.length) return [] as ContentPillItem[]
    return hexHotspots.map((h) => {
      const isOwned = ownedHotspots
        ? ownedHotspots.find((owned) => owned.address === h.address)
        : false
      const isFollowed = followedHotspots
        ? followedHotspots.find((followed) => followed.address === h.address)
        : false
      const color = getContentColor(isFollowed, isOwned)
      return {
        selectedBackgroundColor: color,
        selectedIconColor: 'white',
        iconColor: color,
        icon: HexPill,
        id: h.address,
      } as ContentPillItem
    })
  }, [hexHotspots, ownedHotspots, followedHotspots, getContentColor])

  const onPressContentPill = useCallback(
    (index: number) => {
      const hotspot = hexHotspots[index]
      onHotspotSelected(index, hotspot)
    },
    [hexHotspots, onHotspotSelected],
  )

  return (
    <Animated.View style={style}>
      <Box padding="xs" flexDirection="row" alignItems="center">
        {hexHotspots && hexHotspots.length ? (
          <ContentPill
            selectedIndex={selectedHotspotIndex}
            data={pillData}
            onPressItem={onPressContentPill}
            maxWidth={wp(90)}
          />
        ) : null}
        {showNoLocation && (
          <Text
            variant="medium"
            fontSize={22}
            color="white"
            maxFontSizeMultiplier={1}
            flex={1}
            textAlign="center"
          >
            {t('hotspot_details.no_location')}
          </Text>
        )}
        <Box height={44} width={44} />
      </Box>
    </Animated.View>
  )
}

export default HotspotsViewHeader
