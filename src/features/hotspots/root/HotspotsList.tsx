import React, { memo, useCallback, useMemo } from 'react'
import { SectionList } from 'react-native'
import { Hotspot, Witness } from '@helium/http'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Search from '@assets/images/search.svg'
import Add from '@assets/images/add.svg'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useColors } from '../../../theme/themeHooks'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import HotspotListItem from '../../../components/HotspotListItem'
import { RootState } from '../../../store/rootReducer'
import WelcomeOverview from './WelcomeOverview'
import HotspotsPicker from './HotspotsPicker'
import { HotspotSort } from '../../../store/hotspots/hotspotsSlice'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import { wh } from '../../../utils/layout'

const HotspotsList = ({
  onSelectHotspot,
  visible,
  searchPressed,
  addHotspotPressed,
}: {
  onSelectHotspot: (hotspot: Hotspot | Witness, showNav: boolean) => void
  visible: boolean
  searchPressed?: () => void
  addHotspotPressed?: () => void
}) => {
  const colors = useColors()
  const { top } = useSafeAreaInsets()
  const loadingRewards = useSelector(
    (state: RootState) => state.hotspots.loadingRewards,
  )
  const orderedHotspots = useSelector(
    (state: RootState) => state.hotspots.orderedHotspots,
  )
  const rewards = useSelector(
    (state: RootState) => state.hotspots.rewards || {},
  )
  const order = useSelector((state: RootState) => state.hotspots.order)

  const { t } = useTranslation()

  const handlePress = useCallback(
    (hotspot: Hotspot | Witness) => {
      onSelectHotspot(hotspot, orderedHotspots.length > 1)
    },
    [onSelectHotspot, orderedHotspots.length],
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
      return (
        <HotspotListItem
          onPress={handlePress}
          hotspot={item}
          showCarot
          loading={loadingRewards}
          totalReward={rewards[item.address]?.balanceTotal}
        />
      )
    },
    [handlePress, loadingRewards, rewards],
  )

  const contentContainerStyle = useMemo(
    () => ({
      paddingBottom: 30,
    }),
    [],
  )

  return (
    <Box backgroundColor="white" flex={1} top={visible ? 0 : wh - 100}>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        style={{ paddingTop: top }}
      >
        <TouchableOpacityBox onPress={searchPressed} padding="l">
          <Search width={22} height={22} color={colors.purpleGrayLight} />
        </TouchableOpacityBox>
        <TouchableOpacityBox onPress={addHotspotPressed} padding="l">
          <Add width={22} height={22} color={colors.purpleGrayLight} />
        </TouchableOpacityBox>
      </Box>

      <SectionList
        sections={sections}
        keyExtractor={(item: Hotspot) => item.address}
        ListHeaderComponent={<WelcomeOverview />}
        renderSectionHeader={renderHeader}
        renderItem={renderItem}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
      />
    </Box>
  )
}

export default memo(HotspotsList)
