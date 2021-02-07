import React from 'react'
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
  const {
    hotspots: { rewards },
  } = useSelector((state: RootState) => state)
  const { t } = useTranslation()

  const handlePress = (hotspot: Hotspot) => {
    onSelectHotspot(hotspot)
  }

  const sections = [
    {
      title: 'Your Hotspots',
      data: hotspots,
    },
  ]

  const renderHeader = () => (
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
  )

  return (
    <BottomSheetSectionList
      sections={sections}
      keyExtractor={(item: Hotspot) => item.address}
      ListHeaderComponent={<WelcomeOverview />}
      renderSectionHeader={renderHeader}
      renderItem={({ item }) => (
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
      )}
      contentContainerStyle={{
        paddingBottom: 30,
      }}
      showsVerticalScrollIndicator={false}
    />
  )
}

export default HotspotsList
