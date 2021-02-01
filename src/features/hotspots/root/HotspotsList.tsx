import React, { useEffect } from 'react'
import { BottomSheetSectionList } from '@gorhom/bottom-sheet'
import { Hotspot } from '@helium/http'
import Balance, { CurrencyType } from '@helium/currency'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import Box from '../../../components/Box'
import HotspotListItem from '../../../components/HotspotListItem'
import { RootState } from '../../../store/rootReducer'
import Text from '../../../components/Text'
import { useAppDispatch } from '../../../store/store'
import hotspotDetailsSlice, {
  fetchHotspotDetails,
} from '../../../store/hotspotDetails/hotspotDetailsSlice'

const HotspotsList = () => {
  const {
    account: { hotspots },
    hotspots: { rewards },
  } = useSelector((state: RootState) => state)
  const navigation = useNavigation()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(hotspotDetailsSlice.actions.clearHotspotDetails())
    })

    return unsubscribe
  }, [navigation, dispatch])

  const handlePress = (hotspot: Hotspot) => {
    dispatch(fetchHotspotDetails(hotspot.address))
    navigation.navigate('HotspotDetails', { hotspot })
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
      renderSectionHeader={renderHeader}
      renderItem={({ item }) => (
        <Box marginHorizontal="l" marginBottom="s">
          <HotspotListItem
            onPress={handlePress}
            hotspot={item}
            showCarot
            totalReward={
              rewards
                ? rewards[item.address].total
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
