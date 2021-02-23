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

const HotspotsList = ({
  onSelectHotspot,
}: {
  onSelectHotspot: (hotspot: Hotspot) => void
}) => {
  const {
    hotspots: { hotspots, rewards, order },
  } = useSelector((state: RootState) => state)
  const { t } = useTranslation()

  const handlePress = useCallback(
    (hotspot: Hotspot) => {
      onSelectHotspot(hotspot)
    },
    [onSelectHotspot],
  )

  const sections = useMemo(
    () => [
      {
        data: hotspots,
      },
    ],
    [hotspots],
  )

  const renderHeader = useCallback(
    ({ section }) => {
      const hasOfflineHotspot = section.data.some(
        (h: Hotspot) => h.status?.online !== 'online',
      )
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
    },
    [t, order],
  )

  const renderItem = useCallback(
    ({ item }) => (
      <Box marginHorizontal="l" marginBottom="s">
        <HotspotListItem
          onPress={handlePress}
          hotspot={item}
          showCarot
          totalReward={
            rewards
              ? rewards[item.address].balanceTotal
              : new Balance(0, CurrencyType.networkToken)
          }
        />
      </Box>
    ),
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
