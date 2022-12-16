/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Search from '@assets/images/search.svg'
import Close from '@assets/images/closeModal.svg'
import { useDebouncedCallback } from 'use-debounce/lib'
import { BoxProps } from '@shopify/restyle'
import { Keyboard } from 'react-native'
import Box from './Box'
import TextInput from './TextInput'
import TouchableOpacityBox from './TouchableOpacityBox'
import { Theme } from '../theme/theme'

export const HotspotFilterKeys = ['my_hotspots', 'all_hotspots'] as const
export type HotspotFilterType = typeof HotspotFilterKeys[number]

type Props = BoxProps<Theme> & {
  onSearch: (searchTerm: string) => void
  initialValue?: string
}
const HotspotSearch = ({
  onSearch,
  backgroundColor = 'grayBox',
  initialValue = '',
  ...boxProps
}: Props) => {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState(initialValue)

  useEffect(() => setSearchTerm(initialValue), [initialValue])

  const debouncedSearchTermHandler = useDebouncedCallback((term: string) => {
    onSearch(term)
  }, 500)

  useEffect(() => debouncedSearchTermHandler.callback(searchTerm), [
    debouncedSearchTermHandler,
    searchTerm,
  ])

  const handleClearSearch = useCallback(() => {
    setSearchTerm('')
    onSearch('')
  }, [onSearch])

  return (
    <Box
      flexDirection="row"
      backgroundColor={backgroundColor}
      alignItems="center"
      borderRadius="m"
      height={56}
      {...boxProps}
    >
      <Box padding="m">
        <Search color="#838BC0" height={16} width={16} />
      </Box>
      <TextInput
        height={56}
        flex={1}
        variant="light"
        backgroundColor={backgroundColor}
        placeholder={t('hotspots.search.placeholder')}
        onChangeText={setSearchTerm}
        value={searchTerm}
        keyboardAppearance="dark"
        autoCorrect={false}
        autoComplete="off"
        autoCapitalize="none"
        blurOnSubmit={false}
        returnKeyType="done"
        onSubmitEditing={Keyboard.dismiss}
      />
      {!!searchTerm && (
        <TouchableOpacityBox onPress={handleClearSearch} padding="m">
          <Close width={22} height={22} color="#838BC0" />
        </TouchableOpacityBox>
      )}
    </Box>
  )
}

export default memo(HotspotSearch)
