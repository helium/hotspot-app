import React, { memo, useCallback, useMemo } from 'react'
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
import useCurrency from '../../../utils/useCurrency'

const HotspotsList = ({
  onSelectHotspot,
}: {
  onSelectHotspot: (hotspot: Hotspot) => void
}) => {
  const { hntBalanceToDisplayVal } = useCurrency()
  const hotspots = useSelector((state: RootState) => state.hotspots.hotspots)
  const rewards = useSelector((state: RootState) => state.hotspots.rewards)
  const order = useSelector((state: RootState) => state.hotspots.order)

  const { t } = useTranslation()

  const handlePress = useCallback(
    (hotspot: Hotspot) => {
      onSelectHotspot(hotspot)
    },
    [onSelectHotspot],
  )

  const hasOfflineHotspot = useMemo(
    () => hotspots.some((h: Hotspot) => h.status?.online !== 'online'),
    [hotspots],
  )

  const sections = useMemo(() => {
    let data = hotspots
    if (order === HotspotSort.Offline && hasOfflineHotspot) {
      data = hotspots.filter((h) => h.status?.online !== 'online')
    }
    return [
      {
        data,
      },
    ]
  }, [hasOfflineHotspot, order, hotspots])

  const renderHeader = useCallback(() => {
    return (
      <Box
        paddingTop="s"
        paddingBottom="m"
        borderTopRightRadius="m"
        borderTopLeftRadius="m"
        backgroundColor="white"
      >
        <HotspotsPicker />
        {order === HotspotSort.Offline && !hasOfflineHotspot ? (
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
        ) : null}
      </Box>
    )
  }, [hasOfflineHotspot, t, order])

  const renderItem = useCallback(
    ({ item }) => {
      const totalReward = rewards
        ? rewards[item.address].balanceTotal
        : new Balance(0, CurrencyType.networkToken)

      const reward = `+${hntBalanceToDisplayVal(totalReward)}`
      return (
        <HotspotListItem
          onPress={handlePress}
          hotspot={item}
          showCarot
          totalReward={reward}
        />
      )
    },
    [handlePress, hntBalanceToDisplayVal, rewards],
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
