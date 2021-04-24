import React, { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import RecentSearches from '@assets/images/recent_searches.svg'
import SearchTips from '@assets/images/search_tips.svg'
import { useSelector } from 'react-redux'
import { FlatList } from 'react-native'
import ArrowRecent from '@assets/images/arrow_recent.svg'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import { RootState } from '../../../store/rootReducer'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'

type Props = { onSelectTerm: (term: string) => void }
const HotspotSearchEmpty = ({ onSelectTerm }: Props) => {
  const { t } = useTranslation()
  const recentSearches = useSelector(
    (state: RootState) => state.hotspotSearch.recentSearches,
  )

  const handleSelectTerm = useCallback(
    (term: string) => () => {
      onSelectTerm(term)
    },
    [onSelectTerm],
  )
  const keyExtractor = useCallback((item: string) => item, [])

  type ListItem = { item: string }
  const renderItem = useCallback(
    ({ item }: ListItem) => {
      return (
        <TouchableOpacityBox
          onPress={handleSelectTerm(item)}
          flexDirection="row"
          alignItems="center"
          paddingVertical="s"
        >
          <Text
            variant="regular"
            fontSize={13}
            color="purpleMain"
            marginRight="xs"
          >
            {item}
          </Text>
          <ArrowRecent />
        </TouchableOpacityBox>
      )
    },
    [handleSelectTerm],
  )

  return (
    <Box flex={1} marginTop="ms">
      <Box flexDirection="row" alignItems="center" marginBottom="ms">
        <RecentSearches />
        <Text variant="medium" fontSize={15} color="black" marginLeft="s">
          {t('hotspots.search.recent_searches')}
        </Text>
      </Box>
      <Box>
        <FlatList
          data={recentSearches}
          keyboardShouldPersistTaps="always"
          keyExtractor={keyExtractor}
          renderItem={renderItem}
        />
      </Box>
      <Box height={1} backgroundColor="grayPurple" marginVertical="lx" />
      <Box flexDirection="row" alignItems="center">
        <SearchTips />
        <Text variant="medium" fontSize={15} color="black" marginLeft="s">
          {t('hotspots.search.tips')}
        </Text>
      </Box>
      <Text
        variant="regular"
        fontSize={13}
        lineHeight={19}
        color="grayText"
        maxWidth={320}
        marginTop="s"
      >
        {t('hotspots.search.tips_body')}
      </Text>
    </Box>
  )
}

export default memo(HotspotSearchEmpty)
