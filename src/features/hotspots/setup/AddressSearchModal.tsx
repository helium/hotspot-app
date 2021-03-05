import React, { memo, useCallback, useMemo, useState } from 'react'
import { BottomSheetSectionList } from '@gorhom/bottom-sheet'
import { Keyboard } from 'react-native'
import { useDebouncedCallback } from 'use-debounce'
import { useTranslation } from 'react-i18next'
import Text from '../../../components/Text'
import TextInput from '../../../components/TextInput'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import { useSpacing } from '../../../theme/themeHooks'
import {
  autocompleteAddress,
  AutocompleteSearchResult,
  getPlaceGeography,
  PlaceGeography,
} from '../../../utils/googlePlaces'

type Props = {
  onSelectPlace: (placeGeography: PlaceGeography) => void
}

const AddressSearchModal = ({ onSelectPlace }: Props) => {
  const spacing = useSpacing()
  const { t } = useTranslation()
  const [searchResults, setSearchResults] = useState<
    AutocompleteSearchResult[]
  >([])

  const sections = useMemo(
    () => [
      {
        data: searchResults,
      },
    ],
    [searchResults],
  )

  const triggerAutocompleteSearch = useDebouncedCallback(async (term) => {
    const results = await autocompleteAddress(term)
    setSearchResults(results)
  }, 500)

  const handleSearchChange = useCallback(
    (term) => {
      triggerAutocompleteSearch.callback(term)
    },
    [triggerAutocompleteSearch],
  )

  const handleSelectPlace = useCallback(
    (searchResult: AutocompleteSearchResult) => async () => {
      const placeLocation = await getPlaceGeography(searchResult.placeId)
      Keyboard.dismiss()
      onSelectPlace(placeLocation)
    },
    [onSelectPlace],
  )

  const renderHeader = useCallback(() => {
    return (
      <TextInput
        onChangeText={handleSearchChange}
        padding="m"
        placeholder={t('generic.search_location')}
        autoFocus
        autoCorrect={false}
        variant="light"
      />
    )
  }, [handleSearchChange, t])

  const renderItem = useCallback(
    ({ item: searchResult }) => {
      return (
        <TouchableOpacityBox
          onPress={handleSelectPlace(searchResult)}
          backgroundColor="offwhite"
          padding="s"
          marginVertical="xxs"
        >
          <Text variant="body2Medium" color="black" marginBottom="xs">
            {searchResult.mainText}
          </Text>
          <Text variant="body2Light" color="black">
            {searchResult.secondaryText}
          </Text>
        </TouchableOpacityBox>
      )
    },
    [handleSelectPlace],
  )

  const contentContainerStyle = useMemo(
    () => ({
      paddingHorizontal: spacing.m,
    }),
    [spacing],
  )

  return (
    <BottomSheetSectionList
      keyExtractor={(item) => item.placeId}
      sections={sections}
      renderSectionHeader={renderHeader}
      renderItem={renderItem}
      contentContainerStyle={contentContainerStyle}
      keyboardShouldPersistTaps="handled"
    />
  )
}

export default memo(AddressSearchModal)
