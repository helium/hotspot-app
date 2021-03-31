import React, { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, SectionList } from 'react-native'
import { useDebouncedCallback } from 'use-debounce'
import Box from '../../../components/Box'
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
  onSelectPlace: (placeGeography: PlaceGeography, locationName: string) => void
}

const ReassertAddressSearch = ({ onSelectPlace }: Props) => {
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
      onSelectPlace(
        placeLocation,
        `${searchResult.mainText}, ${searchResult.secondaryText}`,
      )
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
    <Box height={600} padding="none" paddingTop="lx">
      <SectionList
        keyExtractor={(item) => item.placeId}
        sections={sections}
        renderSectionHeader={renderHeader}
        renderItem={renderItem}
        contentContainerStyle={contentContainerStyle}
        keyboardShouldPersistTaps="handled"
      />
    </Box>
  )
}

export default memo(ReassertAddressSearch)
