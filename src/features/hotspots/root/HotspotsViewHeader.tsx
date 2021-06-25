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
import MapFiltersButton, { MapFilters } from '../../map/MapFiltersButton'

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
  onPressMapFilter = () => {},
  mapFilter,
  showDetails,
}: {
  animatedPosition: Animated.SharedValue<number>
  buttonsVisible?: boolean
  detailHeaderHeight: number
  showNoLocation: boolean
  showDetails: boolean
  hexHotspots: Hotspot[]
  ownedHotspots?: Hotspot[]
  followedHotspots?: Hotspot[]
  onHotspotSelected?: (index: number, hotspot: Hotspot) => void
  selectedHotspotIndex: number
  onPressMapFilter: () => void
  mapFilter: MapFilters
}) => {
  const { t } = useTranslation()

  const style = useAnimatedStyle(
    () => ({
      position: 'absolute',
      bottom: showDetails ? -100 : -240,
      left: 0,
      right: 0,
      opacity: buttonsVisible || showNoLocation ? 1 : 0,
      transform: [
        {
          translateY: interpolate(
            animatedPosition.value,
            [-1, 0],
            [0, -1 * (detailHeaderHeight + (showNoLocation ? 40 : 180))],
            Extrapolate.CLAMP,
          ),
        },
      ],
    }),
    [showDetails, animatedPosition, buttonsVisible, detailHeaderHeight],
  )

  const getContentColor = useCallback((isFollowed, isOwned): Colors => {
    if (isFollowed) return 'purpleBright'
    if (isOwned) return 'blueBright'
    return 'blueGrayLight'
  }, [])

  const pillData = useMemo(() => {
    if (!hexHotspots?.length)
      return [
        {
          selectedBackgroundColor: 'blueGrayLight',
          selectedIconColor: 'white',
          iconColor: 'blueGrayLight',
          icon: HexPill,
          id: 'default',
        },
      ] as ContentPillItem[]
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
    <Animated.View style={style} pointerEvents="box-none">
      <Box
        padding="xs"
        flexDirection="row"
        alignItems="center"
        pointerEvents="box-none"
      >
        <Box
          flex={1}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          pointerEvents="box-none"
          marginRight="ms"
        >
          <ContentPill
            selectedIndex={selectedHotspotIndex}
            data={pillData}
            onPressItem={onPressContentPill}
            maxWidth={wp(75)}
          />
          <MapFiltersButton
            onPressMapFilter={onPressMapFilter}
            mapFilter={mapFilter}
          />
        </Box>
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
      </Box>
    </Animated.View>
  )
}

export default HotspotsViewHeader
