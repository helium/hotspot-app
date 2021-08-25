import React, { memo, useCallback, useMemo } from 'react'
import { SectionList } from 'react-native'
import { Hotspot, Sum } from '@helium/http'
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
import FocusAwareStatusBar from '../../../components/FocusAwareStatusBar'
import { CacheRecord } from '../../../utils/cacheUtils'

const HotspotsList = ({
  onSelectHotspot,
  visible,
  searchPressed,
  addHotspotPressed,
  accountRewards,
}: {
  onSelectHotspot: (hotspot: Hotspot, showNav: boolean) => void
  visible: boolean
  searchPressed?: () => void
  addHotspotPressed?: () => void
  accountRewards: CacheRecord<Sum>
}) => {
  const colors = useColors()
  const { top } = useSafeAreaInsets()
  const loadingRewards = useSelector(
    (state: RootState) => state.hotspots.loadingRewards,
  )
  const orderedHotspots = useSelector(
    (state: RootState) => state.hotspots.orderedHotspots,
  )
  const hiddenAddresses = useSelector(
    (state: RootState) => state.account.settings.hiddenAddresses,
  )
  const showHiddenHotspots = useSelector(
    (state: RootState) => state.account.settings.showHiddenHotspots,
  )
  const rewards = useSelector(
    (state: RootState) => state.hotspots.rewards || {},
  )
  const order = useSelector((state: RootState) => state.hotspots.order)

  const { t } = useTranslation()

  const visibleHotspots = useMemo(() => {
    if (showHiddenHotspots) {
      return orderedHotspots
    }
    return (
      orderedHotspots.filter((h) => !hiddenAddresses?.includes(h.address)) || []
    )
  }, [hiddenAddresses, orderedHotspots, showHiddenHotspots])

  const handlePress = useCallback(
    (hotspot: Hotspot) => {
      onSelectHotspot(hotspot, visibleHotspots.length > 1)
    },
    [onSelectHotspot, visibleHotspots.length],
  )

  const hasOfflineHotspot = useMemo(
    () => visibleHotspots.some((h: Hotspot) => h.status?.online !== 'online'),
    [visibleHotspots],
  )

  const sections = useMemo(() => {
    let data = visibleHotspots
    if (order === HotspotSort.Offline && hasOfflineHotspot) {
      data = visibleHotspots.filter((h) => h.status?.online !== 'online')
    }
    return [
      {
        data,
      },
    ]
  }, [hasOfflineHotspot, order, visibleHotspots])

  const renderHeader = useCallback(() => {
    const filterHasHotspots = visibleHotspots && visibleHotspots.length > 0
    return (
      <Box
        paddingVertical="s"
        borderTopRightRadius="m"
        borderTopLeftRadius="m"
        backgroundColor="white"
      >
        <HotspotsPicker visible={visible} />
        {order === HotspotSort.Offline &&
          !hasOfflineHotspot &&
          filterHasHotspots && (
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
        {!filterHasHotspots && (
          <Box paddingHorizontal="l">
            <Text variant="body1" color="grayDark" padding="m">
              {t('hotspots.list.no_results')}
            </Text>
          </Box>
        )}
      </Box>
    )
  }, [visibleHotspots, visible, order, hasOfflineHotspot, t])

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <HotspotListItem
          onPress={handlePress}
          hotspot={item}
          showCarot
          loading={loadingRewards}
          totalReward={rewards[item.address]}
          hidden={hiddenAddresses?.includes(item.address)}
        />
      )
    },
    [handlePress, hiddenAddresses, loadingRewards, rewards],
  )

  const contentContainerStyle = useMemo(
    () => ({
      paddingBottom: 30,
    }),
    [],
  )

  const topStyle = useMemo(() => ({ paddingTop: top }), [top])

  const keyExtractor = useCallback((item: Hotspot) => item.address, [])

  return (
    <Box
      backgroundColor="white"
      top={visible ? 0 : wh}
      left={0}
      right={0}
      bottom={visible ? 0 : wh}
      position="absolute"
    >
      {visible && <FocusAwareStatusBar barStyle="dark-content" />}
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        style={topStyle}
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
        keyExtractor={keyExtractor}
        ListHeaderComponent={
          <WelcomeOverview accountRewards={accountRewards} />
        }
        renderSectionHeader={renderHeader}
        renderItem={renderItem}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
      />
    </Box>
  )
}

export default memo(HotspotsList)
