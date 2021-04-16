import React, { memo, useCallback, useEffect, useMemo } from 'react'
import { BottomSheetSectionList } from '@gorhom/bottom-sheet'
import { Hotspot } from '@helium/http'
import Balance, { CurrencyType } from '@helium/currency'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import HotspotListItem from '../../../components/HotspotListItem'
import { RootState } from '../../../store/rootReducer'
import WelcomeOverview from './WelcomeOverview'
import HotspotsPicker from './HotspotsPicker'
import { HotspotSort } from '../../../store/hotspots/hotspotsSlice'
import animateTransition from '../../../utils/animateTransition'

const HotspotsList = ({
  onSelectHotspot,
}: {
  onSelectHotspot: (hotspot: Hotspot) => void
}) => {
  const loading = useSelector(
    (state: RootState) => state.hotspots.loadingOrderedHotspots,
  )
  const orderedHotspots = useSelector(
    (state: RootState) => state.hotspots.orderedHotspots,
  )
  const rewards = useSelector((state: RootState) => state.hotspots.rewards)
  const order = useSelector((state: RootState) => state.hotspots.order)

  const { t } = useTranslation()

  useEffect(() => {
    animateTransition(false)
  }, [loading])

  const handlePress = useCallback(
    (hotspot: Hotspot) => {
      onSelectHotspot(hotspot)
    },
    [onSelectHotspot],
  )

  const hasOfflineHotspot = useMemo(
    () => orderedHotspots.some((h: Hotspot) => h.status?.online !== 'online'),
    [orderedHotspots],
  )

  const sections = useMemo(() => {
    let data = orderedHotspots
    if (order === HotspotSort.Offline && hasOfflineHotspot) {
      data = orderedHotspots.filter((h) => h.status?.online !== 'online')
    }
    return [
      {
        data,
      },
    ]
  }, [hasOfflineHotspot, order, orderedHotspots])

  const renderHeader = useCallback(() => {
    const hasHotspots = orderedHotspots && orderedHotspots.length > 0
    return (
      <Box
        paddingVertical="s"
        borderTopRightRadius="m"
        borderTopLeftRadius="m"
        backgroundColor="white"
      >
        <HotspotsPicker />
        {order === HotspotSort.Offline && !hasOfflineHotspot && hasHotspots && (
          <Box paddingHorizontal="l">
            <Text
              variant="body3Medium"
              color="grayDark"
              marginTop="xs"
              marginBottom="xl"
              letterSpacing={1}
            >
              {t('hotspots.list.no_offline')}
            </Text>
            <Text variant="body3Medium" color="grayDark" letterSpacing={1}>
              {t('hotspots.list.online')}
            </Text>
          </Box>
        )}
        {!hasHotspots && (
          <Box paddingHorizontal="l">
            <Text variant="body1" color="grayDark" padding="m">
              {t('hotspots.list.no_results')}
            </Text>
          </Box>
        )}
      </Box>
    )
  }, [order, hasOfflineHotspot, orderedHotspots, t])

  const renderItem = useCallback(
    ({ item }) => {
      const totalReward =
        rewards && rewards[item.address]
          ? rewards[item.address].balanceTotal
          : new Balance(0, CurrencyType.networkToken)

      return (
        <HotspotListItem
          onPress={handlePress}
          hotspot={item}
          showCarot
          totalReward={totalReward}
        />
      )
    },
    [handlePress, rewards],
  )

  const contentContainerStyle = useMemo(
    () => ({
      paddingBottom: 30,
    }),
    [],
  )

  return (
    <BottomSheetSectionList
      sections={sections}
      keyExtractor={(item: Hotspot) => item.address}
      ListHeaderComponent={<WelcomeOverview />}
      renderSectionHeader={renderHeader}
      renderItem={renderItem}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={false}
    />
  )
}

export default memo(HotspotsList)
