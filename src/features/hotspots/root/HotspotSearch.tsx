import React, { memo, useMemo, useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Hotspot, Validator } from '@helium/http'
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
import HotspotSearchEmpty from './HotspotSearchEmpty'
import SegmentedControl from '../../../components/SegmentedControl'
import CardHandle from '../../../components/CardHandle'
import usePrevious from '../../../utils/usePrevious'
import { isHotspot } from '../../../utils/hotspotUtils'
import { isValidator } from '../../../utils/validatorUtils'

const ItemSeparatorComponent = () => <Box height={1} backgroundColor="white" />

type Props = {
  onSelectHotspot: (hotspot: Hotspot) => void
  onSelectValidator: (validator: Validator) => void
  onSelectPlace: (place: PlacePrediction) => void
  visible: boolean
}
const HotspotSearch = ({
  onSelectHotspot,
  onSelectValidator,
  onSelectPlace,
  visible,
}: Props) => {
  const listRef = useRef<BottomSheet>(null)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { results: listData, filter, searchTerm } = useSelector(
    (state: RootState) => state.hotspotSearch,
  )
  const prevSearchTerm = usePrevious(searchTerm)

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
    if (!visible || searchTerm === prevSearchTerm) return

    dispatch(fetchData({ filter, searchTerm }))
  }, [dispatch, filter, prevSearchTerm, searchTerm, visible])

  useEffect(() => {
    if (!visible) return
    dispatch(restoreRecentSearches())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const keyExtractor = useCallback((item: PlacePrediction | Hotspot) => {
    if ('placeId' in item) {
      return item.placeId
    }
    return item.address
  }, [])

  const onPressItem = useCallback(
    (item: PlacePrediction | Hotspot | Validator) => () => {
      if (isHotspot(item)) {
        onSelectHotspot(item)
      } else if (isValidator(item)) {
        onSelectValidator(item)
      } else if ('placeId' in item) {
        onSelectPlace(item)
      }
      dispatch(hotspotSearchSlice.actions.addRecentSearchTerm(searchTerm))
      Keyboard.dismiss()
    },
    [dispatch, searchTerm, onSelectHotspot, onSelectValidator, onSelectPlace],
  )

  type ListItem = { item: PlacePrediction | Hotspot | Validator; index: number }
  const renderItem = useCallback(
    ({ item, index }: ListItem) => {
      const isFirst = index === 0
      const isLast = index === listData.length - 1

      let title = ''
      let subtitle = ''
      if ('placeId' in item) {
        title = item.description
      } else {
        title = animalName(item.address)
        if ('geocode' in item) {
          if (item.geocode?.longCity && item.geocode.shortState) {
            const { longCity, shortState } = item.geocode
            subtitle = `${longCity}${longCity ? ', ' : ''}${shortState}`
          } else {
            subtitle = t('hotspot_details.no_location_title')
          }
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
  const handle = useCallback(
    () => (
      <Box
        backgroundColor="white"
        borderTopLeftRadius="none"
        borderRadius="none"
        flexDirection="row"
        height={22}
        paddingTop="s"
        alignItems="center"
        justifyContent="center"
        flex={1}
      >
        <CardHandle />
      </Box>
    ),
    [],
  )

  useEffect(() => {
    if (!visible) {
      listRef.current?.close()
    } else {
      listRef.current?.expand()
    }
  }, [visible])

  return (
    <BottomSheet
      ref={listRef}
      snapPoints={snapPoints}
      handleComponent={handle}
      animateOnMount={false}
    >
      {visible && (
        <Box backgroundColor="white" flex={1} padding="l">
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
          {!searchTerm && (
            <HotspotSearchEmpty onSelectTerm={updateSearchTerm} />
          )}
        </Box>
      )}
    </BottomSheet>
  )
}

export default memo(HotspotSearch)
