import { useNavigation } from '@react-navigation/native'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList } from 'react-native-gesture-handler'
import { Edge } from 'react-native-safe-area-context'
import Fuse from 'fuse.js'
import { useSelector } from 'react-redux'
import BackScreen from '../../../components/BackScreen'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import HotspotSetupSelectionListItem from './HotspotSetupSelectionListItem'
import { HotspotSetupNavigationProp } from './hotspotSetupTypes'
import hotspotOnboardingSlice from '../../../store/hotspots/hotspotOnboardingSlice'
import { useAppDispatch } from '../../../store/store'
import {
  HotspotType,
  HotspotModelKeys,
  HotspotMakerModels,
} from '../../../makers'
import SearchInput from '../../../components/SearchInput'
import animateTransition from '../../../utils/animateTransition'
import { useBorderRadii } from '../../../theme/themeHooks'
import { RootState } from '../../../store/rootReducer'

const ItemSeparatorComponent = () => (
  <Box height={1} backgroundColor="primaryBackground" />
)

const HotspotSetupSelectionScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  const dispatch = useAppDispatch()
  const edges = useMemo((): Edge[] => ['top', 'left', 'right'], [])
  const radii = useBorderRadii()
  const [searchTerm, setSearchTerm] = useState('')

  const qrOnboardEnabled = useSelector(
    (state: RootState) => state.features.qrOnboardEnabled,
  )
  // clear any existing onboarding state
  useEffect(() => {
    dispatch(hotspotOnboardingSlice.actions.reset())
  }, [dispatch])

  const handlePress = useCallback(
    (hotspotType: HotspotType) => () => {
      dispatch(hotspotOnboardingSlice.actions.setHotspotType(hotspotType))

      const qrScanFlow = HotspotMakerModels[hotspotType].onboardType === 'QR'
      if (qrScanFlow) {
        navigation.push('HotspotSetupScanQrScreen', { hotspotType })
      } else {
        navigation.push('HotspotSetupEducationScreen', { hotspotType })
      }
    },
    [dispatch, navigation],
  )

  const keyExtractor = useCallback((item) => item, [])

  const data = useMemo(() => {
    let results: HotspotType[] = HotspotModelKeys

    if (!qrOnboardEnabled) {
      results = results.flatMap((r) =>
        HotspotMakerModels[r].onboardType === 'QR' ? [] : [r],
      )
    }

    if (!searchTerm) return results

    results = new Fuse(
      results.map((key) => ({
        key,
        name: t(`hotspot_setup.selection.${key.toLowerCase()}`),
      })),
      {
        keys: ['key', 'name'],
        threshold: 0.3,
      },
    )
      .search(searchTerm)
      .map(({ item }) => item.key)

    return results
  }, [qrOnboardEnabled, searchTerm, t])

  const renderItem = useCallback(
    ({ item, index }) => {
      const isFirst = index === 0
      const isLast = index === data.length - 1
      return (
        <HotspotSetupSelectionListItem
          isFirst={isFirst}
          isLast={isLast}
          hotspotType={item}
          onPress={handlePress(item)}
        />
      )
    },
    [data.length, handlePress],
  )

  const updateSearch = useCallback((term) => {
    animateTransition('HotspotSetupSelectionScreen.UpdateSearchTerm')
    setSearchTerm(term)
  }, [])

  const flatListStyle = useMemo(() => {
    return { flex: 1, borderRadius: radii.m }
  }, [radii.m])

  return (
    <BackScreen
      backgroundColor="primaryBackground"
      paddingTop="m"
      padding="lx"
      hideBack
      onClose={navigation.goBack}
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

      <SearchInput
        backgroundColor="white"
        onSearch={updateSearch}
        marginVertical="m"
        initialValue={searchTerm}
      />
      <FlatList
        style={flatListStyle}
        ItemSeparatorComponent={ItemSeparatorComponent}
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListFooterComponent={<Box height={32} />}
      />
    </BackScreen>
  )
}

export default memo(HotspotSetupSelectionScreen)
