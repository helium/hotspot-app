import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList } from 'react-native-gesture-handler'
import { Edge } from 'react-native-safe-area-context'
import BackScreen from '../../../components/BackScreen'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import {
  HotspotType,
  HotspotTypeKeys,
} from '../../../store/connectedHotspot/connectedHotspotSlice'
import HotspotSelectionListItem from './HotspotSelectionListItem'
import { HotspotSetupNavigationProp } from './hotspotSetupTypes'
import hotspotOnboardingSlice from '../../../store/hotspots/hotspotOnboardingSlice'
import { useAppDispatch } from '../../../store/store'

const ItemSeparatorComponent = () => (
  <Box height={1} backgroundColor="primaryBackground" />
)

const HotspotSetupSelectionScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  const dispatch = useAppDispatch()
  const edges = useMemo((): Edge[] => ['top', 'left', 'right'], [])

  // clear any existing onboarding state
  useEffect(() => {
    dispatch(hotspotOnboardingSlice.actions.reset())
  }, [dispatch])

  const handlePress = useCallback(
    (hotspotType: HotspotType) => () => {
      dispatch(hotspotOnboardingSlice.actions.setHotspotType(hotspotType))
      navigation.push('HotspotSetupEducationScreen', { hotspotType })
    },
    [dispatch, navigation],
  )

  const keyExtractor = useCallback((item) => item, [])

  const renderItem = useCallback(
    ({ item, index }) => {
      const isFirst = index === 0
      const isLast = index === HotspotTypeKeys.length - 1
      return (
        <HotspotSelectionListItem
          isFirst={isFirst}
          isLast={isLast}
          hotspotType={item}
          onPress={handlePress(item)}
        />
      )
    },
    [handlePress],
  )

  return (
    <BackScreen
      backgroundColor="primaryBackground"
      padding="lx"
      paddingBottom="none"
      edges={edges}
    >
      <Text variant="h1" numberOfLines={2} adjustsFontSizeToFit>
        {t('hotspot_setup.selection.title')}
      </Text>
      <Text
        variant="subtitle"
        maxFontSizeMultiplier={1}
        numberOfLines={2}
        adjustsFontSizeToFit
        marginVertical="l"
      >
        {t('hotspot_setup.selection.subtitle')}
      </Text>
      <FlatList
        ItemSeparatorComponent={ItemSeparatorComponent}
        data={HotspotTypeKeys}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListFooterComponent={<Box height={32} />}
      />
    </BackScreen>
  )
}

export default HotspotSetupSelectionScreen
