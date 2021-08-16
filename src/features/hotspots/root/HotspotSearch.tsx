import React, { memo, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Hotspot, Validator } from '@helium/http'
import animalName from 'angry-purple-tiger'
import { FlatList } from 'react-native-gesture-handler'
import { Keyboard, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import HotspotIcon from '@assets/images/hotspotPillIcon.svg'
import ValidatorIcon from '@assets/images/validatorPillIcon.svg'
import LocationIcon from '@assets/images/location.svg'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import SearchInput from '../../../components/SearchInput'
import hotspotSearchSlice, {
  fetchData,
  restoreRecentSearches,
} from '../../../store/hotspotSearch/hotspotSearchSlice'
import { useAppDispatch } from '../../../store/store'
import { RootState } from '../../../store/rootReducer'
import { PlacePrediction } from '../../../utils/googlePlaces'
import HotspotSearchListItem from './HotspotSearchListItem'
import HotspotSearchEmpty from './HotspotSearchEmpty'
import usePrevious from '../../../utils/usePrevious'
import { isHotspot } from '../../../utils/hotspotUtils'
import { isValidator } from '../../../utils/validatorUtils'
import { wh } from '../../../utils/layout'
import { useColors, useSpacing } from '../../../theme/themeHooks'

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
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { top } = useSafeAreaInsets()
  const colors = useColors()
  const spacing = useSpacing()
  const { results: listData, searchTerm } = useSelector(
    (state: RootState) => state.hotspotSearch,
  )
  const prevSearchTerm = usePrevious(searchTerm)

  const updateSearchTerm = useCallback(
    (term) => dispatch(hotspotSearchSlice.actions.setSearchTerm(term)),
    [dispatch],
  )

  useEffect(() => {
    if (!visible || searchTerm === prevSearchTerm) return

    dispatch(fetchData({ filter: 'all_hotspots', searchTerm }))
  }, [dispatch, prevSearchTerm, searchTerm, visible])

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

      let icon
      let title = ''
      let subtitle = ''
      if ('placeId' in item) {
        title = item.description
        icon = <LocationIcon height={17} width={17} color={colors.offblack} />
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
        if (isValidator(item)) {
          subtitle = t('hotspots.owned.validator')
          icon = <ValidatorIcon color={colors.purpleBright} />
        } else {
          icon = <HotspotIcon color={colors.blueBright} />
        }
      }
      return (
        <HotspotSearchListItem
          icon={icon}
          title={title}
          subtitle={subtitle}
          isFirst={isFirst}
          isLast={isLast}
          onPress={onPressItem(item)}
        />
      )
    },
    [
      colors.blueBright,
      colors.offblack,
      colors.purpleBright,
      listData.length,
      onPressItem,
      t,
    ],
  )

  const paddingTop = useMemo(() => (Platform.OS === 'android' ? top : 0), [top])

  return (
    <Box
      top={visible ? paddingTop : wh}
      left={0}
      right={0}
      bottom={visible ? 0 : wh}
      position="absolute"
      backgroundColor="white"
      style={{ paddingTop: top }}
    >
      {visible && (
        <Box backgroundColor="white" flex={1} padding="l">
          <Text variant="h1" color="grayBlack">
            {t('hotspots.search.network')}
          </Text>
          <SearchInput
            onSearch={updateSearchTerm}
            marginVertical="m"
            initialValue={searchTerm}
          />
          {!!searchTerm && (
            <FlatList
              contentContainerStyle={{ paddingBottom: spacing.l }}
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
    </Box>
  )
}

export default memo(HotspotSearch)
