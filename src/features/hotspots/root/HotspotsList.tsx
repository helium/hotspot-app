import React, { useCallback, useMemo } from 'react'
import { BottomSheetSectionList } from '@gorhom/bottom-sheet'
import { Hotspot } from '@helium/http'
import Balance, { CurrencyType } from '@helium/currency'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Box from '../../../components/Box'
import HotspotListItem from '../../../components/HotspotListItem'
import { RootState } from '../../../store/rootReducer'
import Text from '../../../components/Text'
import WelcomeOverview from './WelcomeOverview'

const HotspotsList = ({
  hotspots,
  onSelectHotspot,
}: {
  hotspots: Hotspot[]
  onSelectHotspot: (hotspot: Hotspot) => void
}) => {
  const { t } = useTranslation()

  const {
    hotspots: { rewards },
  } = useSelector((state: RootState) => state)

  const handlePress = useCallback(
    (hotspot: Hotspot) => {
      onSelectHotspot(hotspot)
    },
    [onSelectHotspot],
  )

  const sections = useMemo(
    () => [
      {
        title: 'Your Hotspots',
        data: hotspots,
      },
    ],
    [hotspots],
  )

  const renderHeader = useCallback(
    () => (
      <Box
        paddingTop="s"
        paddingBottom="m"
        borderTopRightRadius="m"
        borderTopLeftRadius="m"
        backgroundColor="white"
      >
        <Text variant="subtitleBold" color="black" paddingStart="l">
          {t('hotspots.owned.your_hotspots')}
        </Text>
      </Box>
    ),
    [t],
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

export default HotspotsList
