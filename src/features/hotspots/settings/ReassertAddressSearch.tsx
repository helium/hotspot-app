import React, { memo, useCallback, useMemo, useState } from 'react'
import { Keyboard, SectionList, TextInput } from 'react-native'
import { useDebouncedCallback } from 'use-debounce'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import { useColors, useSpacing } from '../../../theme/themeHooks'
import {
  autocompleteAddress,
  AutocompleteSearchResult,
  getPlaceGeography,
  PlaceGeography,
} from '../../../utils/googlePlaces'
import { hp } from '../../../utils/layout'

type Props = {
  onSelectPlace: (placeGeography: PlaceGeography) => void
}

const ReassertAddressSearch = ({ onSelectPlace }: Props) => {
  const spacing = useSpacing()
  const colors = useColors()

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
      <Box
        backgroundColor="offwhite"
        padding="m"
        borderRadius="m"
        marginBottom="m"
      >
        <TextInput
          onChangeText={handleSearchChange}
          placeholder="Search for an address or place"
          placeholderTextColor={colors.grayLightText}
          autoFocus
          autoCorrect={false}
        />
      </Box>
    )
  }, [colors.grayLightText, handleSearchChange])

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
    <Box minHeight={hp(50)} padding="l" paddingTop="lx">
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
