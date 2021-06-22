import React, { memo, useMemo, useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Hotspot } from '@helium/http'
import animalName from 'angry-purple-tiger'
import { FlatList } from 'react-native-gesture-handler'
import { Keyboard } from 'react-native'
import BottomSheet from '@gorhom/bottom-sheet'
import Box from '../../../components/Box'
import SearchInput from '../../../components/SearchInput'
import hotspotSearchSlice, {
  fetchData,
  HotspotSearchFilterKeys,
  restoreRecentSearches,
} from '../../../store/hotspotSearch/hotspotSearchSlice'
import { useAppDispatch } from '../../../store/store'
import { RootState } from '../../../store/rootReducer'
import { PlacePrediction } from '../../../utils/googlePlaces'
import HotspotSearchListItem from './HotspotSearchListItem'
import animateTransition from '../../../utils/animateTransition'
import HotspotSearchEmpty from './HotspotSearchEmpty'
import SegmentedControl from '../../../components/SegmentedControl'

const ItemSeparatorComponent = () => <Box height={1} backgroundColor="white" />

type Props = {
  onSelectHotspot: (hotspot: Hotspot) => void
  onSelectPlace: (place: PlacePrediction) => void
  visible: boolean
}
const HotspotSearch = ({ onSelectHotspot, onSelectPlace, visible }: Props) => {
  const listRef = useRef<BottomSheet>(null)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { hotspots, locations, filter, searchTerm } = useSelector(
    (state: RootState) => state.hotspotSearch,
  )

  const filterNames = HotspotSearchFilterKeys.map((f) =>
    t(`hotspots.search.${f}`),
  )
  const selectedFilterIndex = useMemo(
    () => HotspotSearchFilterKeys.indexOf(filter),
    [filter],
  )

  const handleFilterChange = useCallback(
    (value) =>
      dispatch(
        hotspotSearchSlice.actions.setFilter(HotspotSearchFilterKeys[value]),
      ),
    [dispatch],
  )

  const updateSearchTerm = useCallback(
    (term) => dispatch(hotspotSearchSlice.actions.setSearchTerm(term)),
    [dispatch],
  )

  useEffect(() => {
    if (!visible) return

    dispatch(fetchData({ filter, searchTerm }))
  }, [dispatch, filter, searchTerm, visible])

  useEffect(() => {
    if (!visible) return
    dispatch(restoreRecentSearches())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  useEffect(() => {
    if (!visible) return

    animateTransition('HotspotSearch.Hotspots.Locations.Change')
  }, [hotspots, locations, visible])

  const listData = useMemo(() => [...hotspots, ...locations], [
    hotspots,
    locations,
  ])

  const keyExtractor = useCallback((item: PlacePrediction | Hotspot) => {
    if ('placeId' in item) {
      return item.placeId
    }
    return item.address
  }, [])

  const onPressItem = useCallback(
    (item: PlacePrediction | Hotspot) => () => {
      if ('address' in item) {
        onSelectHotspot(item)
      } else {
        onSelectPlace(item)
      }
      dispatch(hotspotSearchSlice.actions.addRecentSearchTerm(searchTerm))
      Keyboard.dismiss()
    },
    [dispatch, searchTerm, onSelectHotspot, onSelectPlace],
  )

  type ListItem = { item: PlacePrediction | Hotspot; index: number }
  const renderItem = useCallback(
    ({ item, index }: ListItem) => {
      const isFirst = index === 0
      const isLast = index === listData.length - 1

      let title = ''
      let subtitle = ''
      if ('placeId' in item) {
        title = item.description
      } else if (item.name) {
        title = animalName(item.address)
        if (item.geocode?.longCity && item.geocode.shortState) {
          const { longCity, shortState } = item.geocode
          subtitle = `${longCity}${longCity ? ', ' : ''}${shortState}`
        } else {
          subtitle = t('hotspot_details.no_location_title')
        }
      }
      return (
        <HotspotSearchListItem
          title={title}
          subtitle={subtitle}
          isFirst={isFirst}
          isLast={isLast}
          onPress={onPressItem(item)}
        />
      )
    },
    [listData.length, onPressItem, t],
  )

  const snapPoints = useMemo(() => [95, '75%'], [])
  if (!visible) return null

  return (
    <BottomSheet
      ref={listRef}
      snapPoints={snapPoints}
      index={1}
      animateOnMount={false}
    >
      <Box paddingHorizontal="l" paddingVertical="l" flex={1}>
        <SegmentedControl
          values={filterNames}
          selectedIndex={selectedFilterIndex}
          onChange={handleFilterChange}
        />
        <SearchInput
          onSearch={updateSearchTerm}
          marginVertical="m"
          initialValue={searchTerm}
        />
        {!!searchTerm && (
          <FlatList
            data={listData}
            keyboardShouldPersistTaps="always"
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ItemSeparatorComponent={ItemSeparatorComponent}
          />
        )}
        {!searchTerm && <HotspotSearchEmpty onSelectTerm={updateSearchTerm} />}
      </Box>
    </BottomSheet>
  )
}

export default memo(HotspotSearch)
